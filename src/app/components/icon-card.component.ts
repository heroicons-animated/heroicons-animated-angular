import { Component, input, signal, computed, ChangeDetectionStrategy, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import {
  ClipboardDocumentIcon,
  CommandLineIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons-animated/angular';
import { ICON_COMPONENTS } from '../icon-components';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-icon-card',
  standalone: true,
  imports: [NgComponentOutlet, ClipboardDocumentIcon, CommandLineIcon, PlayIcon, PauseIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="group relative flex flex-col items-center justify-center rounded-2xl bg-background px-4 pb-5 pt-10 cursor-pointer transition-all hover:shadow-sm"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
      (focusin)="handleMouseEnter()"
      (touchstart)="handleMouseEnter()"
    >
      <!-- Play/Pause button -->
      <button
        class="absolute top-2 left-2 p-1 rounded-lg text-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground/60 hover:bg-foreground/5"
        (click)="handlePlayClick($event)"
      >
        @if (isAnimating()) {
          <hi-pause [size]="14" />
        } @else {
          <hi-play [size]="14" />
        }
      </button>

      <!-- Dynamic icon -->
      <div class="flex items-center justify-center text-foreground/80">
        <ng-container *ngComponentOutlet="iconComponent(); inputs: iconInputs()" />
      </div>

      <!-- Icon name -->
      <p class="mt-7 w-full truncate text-center font-mono text-xs text-foreground/40">
        {{ name() }}
      </p>

      <!-- Action buttons -->
      <div
        class="absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <!-- Copy code -->
        <button
          class="rounded-lg p-1 text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
          [title]="'Copy .ts code'"
          (click)="handleCopyCode($event)"
        >
          <hi-clipboard-document
            [size]="14"
            [animate]="isCodeHovered()"
            (mouseenter)="isCodeHovered.set(true)"
            (mouseleave)="isCodeHovered.set(false)"
          />
        </button>

        <!-- Copy CLI -->
        <button
          class="rounded-lg p-1 text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
          [title]="'Copy CLI command'"
          (click)="handleCopyCLI($event)"
        >
          <hi-command-line
            [size]="14"
            [animate]="isCLIHovered()"
            (mouseenter)="isCLIHovered.set(true)"
            (mouseleave)="isCLIHovered.set(false)"
          />
        </button>
      </div>
    </div>
  `,
})
export class IconCardComponent {
  readonly name = input.required<string>();
  readonly size = input(40);

  readonly iconAnimate = signal(false);
  readonly isAnimating = signal(false);
  readonly isCodeHovered = signal(false);
  readonly isCLIHovered = signal(false);

  private playTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly iconComponent = computed((): Type<unknown> | null => {
    return ICON_COMPONENTS[this.name()] ?? null;
  });

  readonly iconInputs = computed(() => ({
    size: this.size(),
    animate: this.iconAnimate(),
  }));

  handleMouseEnter() {
    this.iconAnimate.set(true);
  }

  handleMouseLeave() {
    this.iconAnimate.set(false);
    this.isCodeHovered.set(false);
    this.isCLIHovered.set(false);
  }

  handlePlayClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isAnimating()) {
      this.iconAnimate.set(false);
      this.isAnimating.set(false);
      if (this.playTimeout) clearTimeout(this.playTimeout);
      return;
    }
    this.iconAnimate.set(true);
    this.isAnimating.set(true);
    this.playTimeout = setTimeout(() => {
      this.isAnimating.set(false);
      this.iconAnimate.set(false);
    }, 1500);
  }

  async handleCopyCode(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const code = `<hi-${this.name()} [size]="28" />`;
      await navigator.clipboard.writeText(code);
      toast.success('Copied component code');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }

  async handleCopyCLI(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    try {
      const cmd = `pnpm dlx @heroicons-animated/angular add ${this.name()}`;
      await navigator.clipboard.writeText(cmd);
      toast.success('Copied CLI command');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  }
}
