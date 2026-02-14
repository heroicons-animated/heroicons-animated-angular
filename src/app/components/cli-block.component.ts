import {
  Component,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ClipboardDocumentIcon } from '@heroicons-animated/angular';
import { ICON_MANIFEST } from '../icon-manifest';
import { toast } from 'ngx-sonner';

type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

@Component({
  selector: 'app-cli-block',
  standalone: true,
  imports: [ClipboardDocumentIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="view-container"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)"
    >
      <div class="rounded-xl border border-foreground/10 bg-background overflow-hidden">
        <!-- Tabs -->
        <div class="flex items-center border-b border-foreground/10">
          <div class="flex gap-0 px-2" (click)="$event.stopPropagation()">
            @for (pm of packageManagers; track pm) {
              <button
                class="px-3 py-2 text-xs font-medium transition-colors"
                [class]="
                  selectedPm() === pm
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-foreground/40 hover:text-foreground/60'
                "
                (click)="selectedPm.set(pm)"
              >
                {{ pm }}
              </button>
            }
          </div>
        </div>

        <!-- Command display -->
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <div class="flex-1 overflow-hidden">
            <code class="flex items-baseline gap-1.5 font-mono text-sm whitespace-nowrap">
              <span class="text-foreground/50">{{ prefix() }}</span>
              <span class="text-foreground/70">dlx &#64;heroicons-animated/angular add</span>
              <span class="text-primary font-medium cli-text-loop">{{ currentIconName() }}</span>
            </code>
          </div>
          <button
            class="shrink-0 rounded-lg p-1.5 text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
            (click)="handleCopy()"
          >
            <hi-clipboard-document [size]="16" [animate]="isHovered()" />
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .cli-text-loop {
      display: inline-block;
      transform-origin: 50% 50%;
      will-change: transform, opacity, filter;
      animation: cli-text-loop-in 0.25s ease-out;
    }

    @keyframes cli-text-loop-in {
      0% {
        transform: translateY(-12px) rotateX(-90deg);
        opacity: 0;
        filter: blur(2px);
      }
      100% {
        transform: translateY(0) rotateX(0deg);
        opacity: 1;
        filter: blur(0);
      }
    }
  `,
})
export class CliBlockComponent implements OnInit, OnDestroy {
  readonly packageManagers: PackageManager[] = ['pnpm', 'npm', 'yarn', 'bun'];
  readonly selectedPm = signal<PackageManager>('pnpm');
  readonly isHovered = signal(false);
  readonly loopIndex = signal(0);

  private iconList = ICON_MANIFEST.filter((i) => i.name.length <= 20);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly prefix = computed(() => {
    switch (this.selectedPm()) {
      case 'pnpm':
        return 'pnpm';
      case 'npm':
        return 'npx';
      case 'yarn':
        return 'yarn';
      case 'bun':
        return 'bunx';
    }
  });

  readonly currentIconName = computed(() => {
    return this.iconList[this.loopIndex()]?.name || '';
  });

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (this.iconList.length === 0) return;
      this.loopIndex.update((i) => (i + 1) % this.iconList.length);
    }, 1500);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async handleCopy() {
    try {
      const cmd = `${this.prefix()} dlx @heroicons-animated/angular add ${this.currentIconName()}`;
      await navigator.clipboard.writeText(cmd);
      toast.success('Copied CLI command');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }
}
