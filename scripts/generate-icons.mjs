#!/usr/bin/env node

/**
 * Icon Generator Script
 *
 * Fetches all Svelte icon components from the heroicons-animated-svelte repo
 * and generates Angular standalone components with equivalent animations.
 *
 * Usage: node scripts/generate-icons.mjs
 */

import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const REPO_API =
  'https://api.github.com/repos/heroicons-animated/heroicons-animated-svelte/contents/src/lib/icons';
const RAW_BASE =
  'https://raw.githubusercontent.com/heroicons-animated/heroicons-animated-svelte/main/src/lib/icons';

const OUTPUT_DIR = join(process.cwd(), 'packages', 'angular', 'src', 'icons');
const INDEX_FILE = join(process.cwd(), 'packages', 'angular', 'src', 'index.ts');

// ─── Helpers ────────────────────────────────────────────────────────────────

function kebabToPascal(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function escapeTemplate(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

// ─── Svelte Parser ──────────────────────────────────────────────────────────

function parseSvelteFile(content) {
  // Extract <script> content
  const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  const script = scriptMatch ? scriptMatch[1].trim() : '';

  // Extract <style> content
  const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1].trim() : '';

  // Extract template (everything not in script/style)
  let template = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/, '')
    .trim();

  return { script, template, style };
}

// ─── Script Analysis ────────────────────────────────────────────────────────

function analyzeScript(script) {
  const hasBindThis = /bind:this/.test(script) || /let\s+\w+Path\b/.test(script);
  const hasWebAnimation = /\.animate\s*\(/.test(script);
  const hasRAF = /requestAnimationFrame/.test(script);
  const hasOnDestroy = /onDestroy/.test(script);

  // Extract variable names bound with bind:this
  const bindThisVars = [];
  const bindMatches = script.matchAll(/let\s+(\w+)(?:\s*:\s*SVGPathElement)?/g);
  for (const m of bindMatches) {
    if (
      script.includes(`bind:this={${m[1]}}`) ||
      script.includes(`${m[1]}.setAttribute`) ||
      script.includes(`${m[1]}.animate`) ||
      script.includes(`${m[1]}.getTotalLength`) ||
      script.includes(`${m[1]}.style`)
    ) {
      bindThisVars.push(m[1]);
    }
  }

  // Extract constants and complex JS logic
  const jsLogicLines = [];
  const lines = script.split('\n');
  let inFunction = false;
  let braceDepth = 0;
  let collectingConst = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip imports and basic props/state
    if (trimmed.startsWith('import ')) continue;
    if (trimmed.startsWith('let {')) continue;
    if (trimmed.includes('}: IconProps')) continue;
    if (trimmed.startsWith('let isHovered')) continue;
    if (trimmed.startsWith('let shouldAnimate')) continue;
    if (/^function handleMouse(Enter|Leave)/.test(trimmed)) continue;
    if (trimmed === 'isHovered = true;' || trimmed === 'isHovered = false;') continue;

    // Collect constants, functions, effects
    if (
      trimmed.startsWith('const ') ||
      trimmed.startsWith('let ') ||
      trimmed.startsWith('function ') ||
      trimmed.startsWith('$effect') ||
      trimmed.startsWith('interface ') ||
      collectingConst
    ) {
      jsLogicLines.push(line);
      // Track brace depth for multi-line blocks
      for (const ch of trimmed) {
        if (ch === '{' || ch === '[' || ch === '(') braceDepth++;
        if (ch === '}' || ch === ']' || ch === ')') braceDepth--;
      }
      collectingConst = braceDepth > 0;
    }
  }

  return {
    hasBindThis,
    hasWebAnimation,
    hasRAF,
    hasOnDestroy,
    bindThisVars,
    jsLogic: jsLogicLines.join('\n'),
  };
}

// ─── Template Conversion ────────────────────────────────────────────────────

function convertTemplate(template, iconName) {
  // Remove outer div wrapper - we use :host
  let svg = template;

  // Extract just the <svg...>...</svg>
  const svgMatch = svg.match(/<svg[\s\S]*<\/svg>/);
  if (!svgMatch) return '';
  svg = svgMatch[0];

  // Convert Svelte bindings to Angular
  // bind:this={varName} -> #varName
  svg = svg.replace(/bind:this=\{(\w+)\}/g, '#$1');

  // class:foo={expr} -> [class.foo]="expr"
  // Need to handle the Svelte expression -> Angular signal calls
  svg = svg.replace(/class:(\S+?)=\{(\w+)\}/g, (_, cls, expr) => {
    // If it's a simple variable like shouldAnimate, make it a signal call
    return `[class.${cls}]="${expr}()"`;
  });

  // Convert {size} -> [attr.width]="size()" etc.
  svg = svg.replace(/width=\{size\}/g, '[attr.width]="size()"');
  svg = svg.replace(/height=\{size\}/g, '[attr.height]="size()"');
  svg = svg.replace(/stroke=\{color\}/g, '[attr.stroke]="color()"');
  svg = svg.replace(/stroke-width=\{strokeWidth\}/g, '[attr.stroke-width]="strokeWidth()"');
  svg = svg.replace(/fill=\{color\}/g, '[attr.fill]="color()"');

  // Handle d={CONST[0]} or d={SOME_VAR}
  svg = svg.replace(/d=\{([^}]+)\}/g, (_, expr) => {
    // Convert to Angular - these are usually constants
    return `[attr.d]="${expr}"`;
  });

  return svg;
}

// ─── Style Conversion ───────────────────────────────────────────────────────

function convertStyle(style) {
  // Replace 'div {' with ':host {'
  let css = style.replace(/^\s*div\s*\{/m, ':host {');
  return css;
}

// ─── JS Logic Conversion ────────────────────────────────────────────────────

function convertJsLogic(jsLogic, analysis) {
  if (!jsLogic.trim()) return '';

  let code = jsLogic;

  // Convert Svelte reactivity to Angular
  // $effect(() => { ... }) -> effect(() => { ... })  (handled in wrapping)
  code = code.replace(/\$effect\(\(\)\s*=>\s*\{/g, '// effect start\n{');

  // Convert bind:this references to viewChild signal calls
  for (const v of analysis.bindThisVars) {
    // Replace direct usage like `if (!pathElement)` with signal access
    code = code.replace(new RegExp(`if\\s*\\(!${v}\\)`, 'g'), `if (!this.${v}()?.nativeElement)`);
    code = code.replace(new RegExp(`if\\s*\\(${v}\\)`, 'g'), `if (this.${v}()?.nativeElement)`);
    code = code.replace(
      new RegExp(`${v}\\.setAttribute`, 'g'),
      `this.${v}()?.nativeElement.setAttribute`,
    );
    code = code.replace(
      new RegExp(`${v}\\.getTotalLength`, 'g'),
      `this.${v}()?.nativeElement.getTotalLength`,
    );
    code = code.replace(new RegExp(`${v}\\.animate`, 'g'), `this.${v}()?.nativeElement.animate`);
    code = code.replace(new RegExp(`${v}\\.style`, 'g'), `this.${v}()?.nativeElement.style`);
  }

  return code;
}

// ─── Angular Component Generator ────────────────────────────────────────────

function generateAngularComponent(iconName, svelteContent) {
  const { script, template, style } = parseSvelteFile(svelteContent);
  const analysis = analyzeScript(script);
  const angularSvg = convertTemplate(svelteContent, iconName);
  const angularStyle = convertStyle(style);
  const pascalName = kebabToPascal(iconName);

  // Determine which Angular imports we need
  const imports = new Set(['Component', 'ChangeDetectionStrategy', 'input', 'signal', 'computed']);

  if (analysis.hasBindThis || analysis.hasWebAnimation || analysis.hasRAF) {
    imports.add('viewChild');
    imports.add('ElementRef');
    imports.add('effect');
  }

  if (analysis.hasOnDestroy || analysis.hasRAF) {
    imports.add('inject');
    imports.add('DestroyRef');
  }

  if (analysis.hasRAF || analysis.hasWebAnimation) {
    imports.add('effect');
  }

  // Build the component class body
  let classBody = '';

  // Inputs
  classBody += `  readonly color = input('currentColor');\n`;
  classBody += `  readonly size = input(28);\n`;
  classBody += `  readonly strokeWidth = input(1.5);\n`;
  classBody += `  readonly animate = input(false);\n`;
  classBody += `\n`;

  // State
  classBody += `  protected isHovered = signal(false);\n`;
  classBody += `  protected shouldAnimate = computed(() => this.animate() || this.isHovered());\n`;
  classBody += `\n`;

  // ViewChild refs for icons with element refs
  if (analysis.hasBindThis || analysis.hasWebAnimation || analysis.hasRAF) {
    for (const v of analysis.bindThisVars) {
      classBody += `  protected readonly ${v} = viewChild<ElementRef<SVGPathElement>>('${v}');\n`;
    }
    classBody += `\n`;
  }

  // DestroyRef for cleanup
  if (analysis.hasOnDestroy || analysis.hasRAF) {
    classBody += `  private readonly destroyRef = inject(DestroyRef);\n`;
    classBody += `\n`;
  }

  // Complex JS logic (constants, path morphing, etc.)
  if (analysis.jsLogic.trim()) {
    // We need to convert the complex JS and put it in the class
    // This is the hardest part - handle it by embedding the logic
    const convertedLogic = convertComplexLogic(script, analysis, iconName);
    if (convertedLogic) {
      classBody += convertedLogic;
      classBody += `\n`;
    }
  }

  // Mouse handlers
  classBody += `  onMouseEnter() {\n    this.isHovered.set(true);\n  }\n`;
  classBody += `\n`;
  classBody += `  onMouseLeave() {\n    this.isHovered.set(false);\n  }\n`;

  // Build the full component
  const angularImports = Array.from(imports).join(', ');

  const component = `import { ${angularImports} } from '@angular/core';

@Component({
  selector: 'hi-${iconName}',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': "'${iconName}'",
    'role': 'img',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: \`${escapeTemplate(angularSvg)}\`,
  styles: [\`${escapeTemplate(angularStyle)}\`],
})
export class ${pascalName}Icon {
${classBody}}
`;

  return component;
}

// ─── Complex Logic Converter ────────────────────────────────────────────────

function convertComplexLogic(script, analysis, iconName) {
  const parts = [];

  // Handle Web Animations API (like check.svelte)
  if (analysis.hasWebAnimation) {
    parts.push(generateWebAnimationLogic(script, analysis));
  }

  // Handle requestAnimationFrame path morphing
  if (analysis.hasRAF) {
    parts.push(generateRAFLogic(script, analysis));
  }

  // If neither, check for cleanup timeouts etc.
  if (!analysis.hasWebAnimation && !analysis.hasRAF && analysis.hasOnDestroy) {
    // Simple cleanup logic
  }

  return parts.filter(Boolean).join('\n\n');
}

function generateWebAnimationLogic(script, analysis) {
  // Extract the animation keyframes and options from the script
  // This handles patterns like check.svelte where pathElement.animate() is used

  const lines = [];
  lines.push(`  private pathAnimation: Animation | null = null;`);
  lines.push('');
  lines.push(`  constructor() {`);
  lines.push(`    effect(() => {`);
  lines.push(`      if (this.shouldAnimate()) {`);
  lines.push(`        this.startAnimation();`);
  lines.push(`      } else {`);
  lines.push(`        this.stopAnimation();`);
  lines.push(`      }`);
  lines.push(`    });`);
  lines.push(`    this.destroyRef.onDestroy(() => this.stopAnimation());`);
  lines.push(`  }`);
  lines.push('');

  // Extract startAnimation and stopAnimation from the script
  const startFn = extractFunction(script, 'startAnimation');
  const stopFn = extractFunction(script, 'stopAnimation');

  if (startFn) {
    let converted = convertFunctionBody(startFn, analysis);
    lines.push(`  private startAnimation() {`);
    lines.push(converted);
    lines.push(`  }`);
    lines.push('');
  }

  if (stopFn) {
    let converted = convertFunctionBody(stopFn, analysis);
    lines.push(`  private stopAnimation() {`);
    lines.push(converted);
    lines.push(`  }`);
  }

  return lines.join('\n');
}

function generateRAFLogic(script, analysis) {
  // For icons using requestAnimationFrame (arrow-down, rocket-launch, etc.)
  // Extract all the path morphing constants and logic

  const lines = [];

  // Extract constants (PATH arrays, TIMES, DURATION, NUMBER_PATTERN, parsed paths, etc.)
  const constMatches = script.matchAll(
    /const\s+(\w+)\s*=\s*((?:\[[\s\S]*?\](?:\s*as\s*const)?|[^;]+));/g,
  );
  for (const m of constMatches) {
    const name = m[1];
    const value = m[2].trim();
    // Skip parsed derivatives - we'll regenerate
    if (
      name.startsWith('parsed') ||
      name === 'canMorph' ||
      name.endsWith('Template') ||
      name.endsWith('NumberCount')
    )
      continue;
    lines.push(`  private readonly ${name} = ${value};`);
  }

  // Extract number pattern
  if (script.includes('NUMBER_PATTERN')) {
    lines.push(`  private readonly NUMBER_PATTERN = /-?\\d*\\.?\\d+(?:e[-+]?\\d+)?/gi;`);
  }

  lines.push('');

  // Add animation frame tracking
  const frameVars = script.match(/let\s+(\w+AnimationFrame)\b/g);
  if (frameVars) {
    for (const fv of frameVars) {
      const name = fv.replace('let ', '');
      lines.push(`  private ${name}: number | null = null;`);
    }
  }
  // Also check for non-frame variables like pathAnimation
  if (script.includes('pathAnimation')) {
    lines.push(`  private pathAnimation: Animation | null = null;`);
  }

  lines.push('');

  // Constructor with effect
  lines.push(`  constructor() {`);
  lines.push(`    effect(() => {`);
  lines.push(`      if (this.shouldAnimate()) {`);
  lines.push(`        this.startAnimation();`);
  lines.push(`      } else {`);
  lines.push(`        this.stopAnimation();`);
  lines.push(`      }`);
  lines.push(`    });`);
  lines.push(`    this.destroyRef.onDestroy(() => this.stopAnimation());`);
  lines.push(`  }`);
  lines.push('');

  // Extract and convert all functions
  const functionNames = [...script.matchAll(/function\s+(\w+)\s*\(/g)].map((m) => m[1]);

  for (const fnName of functionNames) {
    if (fnName === 'handleMouseEnter' || fnName === 'handleMouseLeave') continue;

    const fn = extractFunction(script, fnName);
    if (fn) {
      const converted = convertFunctionBody(fn, analysis);
      const isPrivate = fnName !== 'startAnimation' && fnName !== 'stopAnimation';
      lines.push(`  private ${fnName}${fn.match(/\([^)]*\)/)?.[0] || '()'} {`);
      lines.push(converted);
      lines.push(`  }`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

function extractFunction(script, fnName) {
  const regex = new RegExp(`function\\s+${fnName}\\s*\\([^)]*\\)\\s*\\{`);
  const match = script.match(regex);
  if (!match) return null;

  const startIdx = match.index + match[0].length;
  let depth = 1;
  let i = startIdx;
  while (i < script.length && depth > 0) {
    if (script[i] === '{') depth++;
    if (script[i] === '}') depth--;
    i++;
  }

  return script.substring(match.index, i);
}

function convertFunctionBody(fnStr, analysis) {
  // Extract just the body (between outer braces)
  const firstBrace = fnStr.indexOf('{');
  const lastBrace = fnStr.lastIndexOf('}');
  let body = fnStr.substring(firstBrace + 1, lastBrace).trim();

  // Convert element references
  for (const v of analysis.bindThisVars) {
    body = body.replace(
      new RegExp(`if\\s*\\(!\\s*${v}\\s*\\)\\s*\\{[^}]*return;?[^}]*\\}`, 'g'),
      `if (!this.${v}()?.nativeElement) return;`,
    );
    body = body.replace(
      new RegExp(`if\\s*\\(!\\s*${v}\\s*\\)\\s*return;?`, 'g'),
      `if (!this.${v}()?.nativeElement) return;`,
    );
    body = body.replace(
      new RegExp(`if\\s*\\(\\s*${v}\\s*\\)`, 'g'),
      `if (this.${v}()?.nativeElement)`,
    );
    body = body.replace(
      new RegExp(`${v}\\.setAttribute`, 'g'),
      `this.${v}()!.nativeElement.setAttribute`,
    );
    body = body.replace(
      new RegExp(`${v}\\.getTotalLength`, 'g'),
      `this.${v}()!.nativeElement.getTotalLength`,
    );
    body = body.replace(
      new RegExp(`${v}\\.animate\\(`, 'g'),
      `this.${v}()!.nativeElement.animate(`,
    );
    body = body.replace(new RegExp(`${v}\\.style\\.`, 'g'), `this.${v}()!.nativeElement.style.`);
  }

  // Convert `this` references for class fields
  body = body.replace(/\bpathAnimation\b/g, 'this.pathAnimation');
  body = body.replace(
    /\b(lineAnimationFrame|fireAnimationFrame|headAnimationFrame|bodyAnimationFrame)\b/g,
    'this.$1',
  );

  // Convert function calls to method calls
  body = body.replace(/\bclearLineAnimation\b/g, 'this.clearLineAnimation');
  body = body.replace(/\bclearFireAnimation\b/g, 'this.clearFireAnimation');
  body = body.replace(/\bstopFireAnimation\b/g, 'this.stopFireAnimation');
  body = body.replace(/\bstartFireAnimation\b/g, 'this.startFireAnimation');
  body = body.replace(/\bstopAnimation\b/g, 'this.stopAnimation');
  body = body.replace(/\bstartAnimation\b/g, 'this.startAnimation');
  body = body.replace(/\bsetLinePath\b/g, 'this.setLinePath');
  body = body.replace(/\bsetFirePathAt\b/g, 'this.setFirePathAt');
  body = body.replace(/\bformatNumber\b/g, 'this.formatNumber');
  body = body.replace(/\binterpolatePath\b/g, 'this.interpolatePath');
  body = body.replace(/\bgetEaseInOut\b/g, 'this.getEaseInOut');

  // Convert constants to this references
  body = body.replace(
    /\b(LINE_PATH_KEYFRAMES|LINE_PATH_TIMES|FIRE_PATHS|FIRE_TIMES|FIRE_DURATION|NUMBER_PATTERN)\b/g,
    'this.$1',
  );
  body = body.replace(
    /\b(parsedLinePaths|parsedFirePaths|lineTemplate|lineNumberCount|canMorphLine|canMorphFire|fireTemplate|fireNumberCount|lineAnimationDuration)\b/g,
    'this.$1',
  );

  // Indent
  const indented = body
    .split('\n')
    .map((l) => '    ' + l)
    .join('\n');

  return indented;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function fetchIconList() {
  console.log('Fetching icon list from GitHub...');
  const resp = await fetch(REPO_API, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'heroicons-angular-generator',
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch icon list: ${resp.status} ${resp.statusText}`);
  }

  const files = await resp.json();
  return files.filter((f) => f.name.endsWith('.svelte')).map((f) => f.name.replace('.svelte', ''));
}

async function fetchIconSource(name) {
  const url = `${RAW_BASE}/${name}.svelte`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'heroicons-angular-generator' },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch ${name}: ${resp.status}`);
  }

  return resp.text();
}

async function main() {
  console.log('=== Heroicons Animated Angular Generator ===\n');

  // Get list of all icons
  const iconNames = await fetchIconList();
  console.log(`Found ${iconNames.length} icons\n`);

  // Clean output directory
  if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true });
  }
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Process each icon
  const results = { success: 0, failed: 0, errors: [] };
  const allIcons = [];

  // Fetch in batches of 10 to avoid rate limits
  for (let i = 0; i < iconNames.length; i += 10) {
    const batch = iconNames.slice(i, i + 10);
    const promises = batch.map(async (name) => {
      try {
        const source = await fetchIconSource(name);
        const angular = generateAngularComponent(name, source);
        const outPath = join(OUTPUT_DIR, `${name}.ts`);
        writeFileSync(outPath, angular);
        allIcons.push(name);
        results.success++;
        process.stdout.write(`  ✓ ${name}\n`);
      } catch (err) {
        results.failed++;
        results.errors.push({ name, error: err.message });
        process.stdout.write(`  ✗ ${name}: ${err.message}\n`);
      }
    });
    await Promise.all(promises);
  }

  // Sort icons alphabetically
  allIcons.sort();

  // Generate barrel index.ts
  console.log('\nGenerating index.ts...');
  const indexLines = [
    '// Auto-generated barrel file - do not edit manually',
    '// Generated by scripts/generate-icons.mjs',
    '',
    '// Tokens & Provider',
    'export {',
    '  HEROICONS_ANIMATED_CONFIG,',
    '  type HeroiconsAnimatedOptions,',
    '  provideHeroiconsAnimated,',
    "} from './tokens/provider';",
    '',
    '// Icons',
  ];

  for (const name of allIcons) {
    const pascal = kebabToPascal(name);
    indexLines.push(`export { ${pascal}Icon } from './icons/${name}';`);
    indexLines.push(`export { ${pascal}Icon as ${pascal} } from './icons/${name}';`);
  }

  indexLines.push('');
  writeFileSync(INDEX_FILE, indexLines.join('\n'));

  // Generate manifest for the demo site
  const manifestPath = join(process.cwd(), 'src', 'app', 'icon-manifest.ts');
  const manifestLines = [
    '// Auto-generated icon manifest - do not edit manually',
    '',
    'export interface IconManifest {',
    '  name: string;',
    '  keywords: string[];',
    '}',
    '',
    'export const ICON_MANIFEST: IconManifest[] = [',
  ];
  for (const name of allIcons) {
    const keywords = name.split('-');
    manifestLines.push(
      `  { name: '${name}', keywords: [${keywords.map((k) => `'${k}'`).join(', ')}] },`,
    );
  }
  manifestLines.push('];');
  manifestLines.push('');
  writeFileSync(manifestPath, manifestLines.join('\n'));

  console.log(`\n=== Results ===`);
  console.log(`Success: ${results.success}`);
  console.log(`Failed:  ${results.failed}`);
  if (results.errors.length > 0) {
    console.log(`\nErrors:`);
    for (const e of results.errors) {
      console.log(`  ${e.name}: ${e.error}`);
    }
  }
  console.log(`\nGenerated ${allIcons.length} icon components`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Index:  ${INDEX_FILE}`);
  console.log(`Manifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
