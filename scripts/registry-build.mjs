import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, "../packages/angular/src/icons");
const publicRegistryDir = path.resolve(__dirname, "../public/r");
const publicRegistryIndexPath = path.join(publicRegistryDir, "registry.json");
const rootRegistryPath = path.resolve(__dirname, "../registry.json");

const schemaUrl = "https://ui.shadcn.com/schema/registry-item.json";
const registrySchemaUrl = "https://ui.shadcn.com/schema/registry.json";
const registryItemType = "registry:component";
const sourcePathPrefix = "packages/angular/src/icons";
const targetPathPrefix = "~/src/app/components/heroicons-animated";
const homepage = "https://angular.heroicons-animated.com";
const packageName = "heroicons-animated-angular";
const author = "Aniket Pawar <pawaraniket508@gmail.com>";

const ensureDir = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
};

const stripContent = (schema, includeDotPrefix = false) => {
  const { files, $schema: _itemSchema, ...rest } = schema;
  return {
    ...rest,
    files: files.map(({ content: _content, path: filePath, ...file }) => ({
      ...file,
      path: includeDotPrefix ? `./${filePath}` : filePath,
    })),
  };
};

const writeSchemaFile = (name, schema) => {
  const filePath = path.join(publicRegistryDir, `${name}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
};

const buildRegistryItems = () => {
  if (!fs.existsSync(iconsDir)) {
    throw new Error(`Icons directory not found: ${iconsDir}`);
  }

  const iconFiles = fs
    .readdirSync(iconsDir)
    .filter((file) => file.endsWith(".ts"))
    .sort((left, right) => left.localeCompare(right));

  const publicIndexItems = [];
  const rootIndexItems = [];

  for (const file of iconFiles) {
    const name = file.replace(".ts", "");
    const sourcePath = `${sourcePathPrefix}/${name}.ts`;
    const targetPath = `${targetPathPrefix}/${name}.ts`;
    const content = fs.readFileSync(path.join(iconsDir, file), "utf8");

    const schema = {
      $schema: schemaUrl,
      name,
      type: registryItemType,
      title: name,
      description: `Animated ${name} icon for Angular`,
      author,
      registryDependencies: [],
      dependencies: [],
      files: [
        {
          path: sourcePath,
          type: registryItemType,
          target: targetPath,
          content,
        },
      ],
    };

    writeSchemaFile(name, schema);
    publicIndexItems.push(stripContent(schema));
    rootIndexItems.push(stripContent(schema, true));
  }

  return { publicIndexItems, rootIndexItems };
};

const writeRegistryIndex = (targetPath, items) => {
  const registryIndex = {
    $schema: registrySchemaUrl,
    name: packageName,
    homepage,
    items,
  };

  fs.writeFileSync(targetPath, JSON.stringify(registryIndex, null, 2));
  fs.appendFileSync(targetPath, "\n");
};

const buildRegistry = () => {
  ensureDir(publicRegistryDir);

  const { publicIndexItems, rootIndexItems } = buildRegistryItems();

  writeRegistryIndex(publicRegistryIndexPath, publicIndexItems);
  writeRegistryIndex(rootRegistryPath, rootIndexItems);

  console.log(`Built ${publicIndexItems.length} Angular registry components`);
};

buildRegistry();
