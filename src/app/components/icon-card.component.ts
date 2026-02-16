import { NgComponentOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type OnDestroy,
  signal,
  type Type,
} from "@angular/core";
import {
  ArrowPathIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CommandLineIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from "@heroicons-animated/angular";
import { BrnTooltipImports } from "@spartan-ng/brain/tooltip";
import { toast } from "ngx-sonner";
import { ICON_COMPONENTS } from "../icon-components";
import { SITE } from "../site.constants";

@Component({
  selector: "app-icon-card",
  standalone: true,
  imports: [
    NgComponentOutlet,
    ...BrnTooltipImports,
    ArrowPathIcon,
    CheckIcon,
    ClipboardDocumentIcon,
    CommandLineIcon,
    PauseIcon,
    PlayIcon,
    XMarkIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="cardClasses()"
      role="group"
      (mouseenter)="handleMouseEnter()"
      (mouseleave)="handleMouseLeave()"
    >
      <button
        [attr.aria-label]="isAnimating() ? 'Stop animation' : 'Play animation'"
        [attr.aria-pressed]="isAnimating()"
        class="play-toggle pointer-events-auto absolute top-3 right-3 z-10 flex size-10 cursor-pointer items-center justify-center rounded-[10px] bg-neutral-200/20 transition-colors duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-primary dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
        type="button"
        (click)="handlePlayClick($event)"
      >
        @if (isAnimating()) {
          <hi-pause
            aria-hidden="true"
            class="size-4 text-neutral-800 dark:text-neutral-100"
            [size]="16"
          />
        } @else {
          <hi-play
            aria-hidden="true"
            class="size-4 text-neutral-800 dark:text-neutral-100"
            [size]="16"
          />
        }
      </button>

      @if (iconComponent()) {
        <div [class]="iconWrapperClasses()">
          <ng-container *ngComponentOutlet="iconComponent(); inputs: iconInputs()" />
        </div>
      }

      @if (showTitle()) {
        <p
          class="mt-[36px] line-clamp-1 text-center font-mono text-[#9F9FA9] text-xs dark:text-[#D4D4D4]"
          [title]="name()"
        >
          {{ name() }}
        </p>
      }

      @if (showActions()) {
        <div [class]="actionsClasses()">
          <button
            [attr.aria-disabled]="codeState() !== 'idle'"
            [attr.data-busy]="codeState() !== 'idle' ? '' : null"
            [brnTooltipTrigger]="'Copy .ts code'"
            [tooltipContentClasses]="tooltipContentClasses"
            aria-label="Copy code"
            class="flex size-10 cursor-pointer items-center justify-center rounded-[10px] bg-neutral-200/20 transition-colors duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-primary dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
            position="above"
            type="button"
            (blur)="isCodeActionHovered.set(false)"
            (focus)="isCodeActionHovered.set(true)"
            (mouseenter)="isCodeActionHovered.set(true)"
            (mouseleave)="isCodeActionHovered.set(false)"
            (click)="handleCopyCode($event)"
          >
            @if (codeState() === 'loading') {
              <hi-arrow-path
                aria-hidden="true"
                class="size-4 animate-spin text-neutral-800 dark:text-neutral-100"
                [size]="16"
              />
            } @else if (codeState() === 'done') {
              <hi-check
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
              />
            } @else if (codeState() === 'error') {
              <hi-x-mark
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
              />
            } @else {
              <hi-clipboard-document
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
                [animate]="isCodeActionHovered()"
              />
            }
          </button>

          <button
            [attr.aria-disabled]="cliState() !== 'idle'"
            [attr.data-busy]="cliState() !== 'idle' ? '' : null"
            [brnTooltipTrigger]="'Copy registry URL'"
            [tooltipContentClasses]="tooltipContentClasses"
            aria-label="Copy CLI command"
            class="flex size-10 cursor-pointer items-center justify-center rounded-[10px] bg-neutral-200/20 transition-colors duration-100 hover:bg-neutral-200 focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-primary dark:bg-neutral-800/20 dark:hover:bg-neutral-700"
            position="above"
            type="button"
            (blur)="isCLIActionHovered.set(false)"
            (focus)="isCLIActionHovered.set(true)"
            (mouseenter)="isCLIActionHovered.set(true)"
            (mouseleave)="isCLIActionHovered.set(false)"
            (click)="handleCopyCLI($event)"
          >
            @if (cliState() === 'done') {
              <hi-check
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
              />
            } @else if (cliState() === 'error') {
              <hi-x-mark
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
              />
            } @else {
              <hi-command-line
                aria-hidden="true"
                class="size-4 text-neutral-800 dark:text-neutral-100"
                [size]="16"
                [animate]="isCLIActionHovered()"
              />
            }
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    @media (hover: hover) {
      .play-toggle {
        opacity: 0;
        pointer-events: none;
      }
    }

    @media (hover: none) {
      .icon-card-root {
        pointer-events: none;
      }

      .icon-card-root button {
        pointer-events: auto;
      }

      .actions-row {
        opacity: 1;
      }
    }
  `,
})
export class IconCardComponent implements OnDestroy {
  readonly tooltipContentClasses =
    "rounded-[8px] bg-neutral-900 px-2 py-1 font-sans text-[11px] text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900";

  readonly name = input.required<string>();
  readonly size = input(40);
  readonly showActions = input(true);
  readonly showTitle = input(true);
  readonly actionsAlwaysVisible = input(false);
  readonly cardClassName = input("");
  readonly iconClassName = input("");

  readonly iconAnimate = signal(false);
  readonly isAnimating = signal(false);
  readonly isCodeActionHovered = signal(false);
  readonly isCLIActionHovered = signal(false);
  readonly cliState = signal<"idle" | "done" | "error">("idle");
  readonly codeState = signal<"idle" | "loading" | "done" | "error">("idle");

  private playTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly iconComponent = computed(
    (): Type<unknown> | null => ICON_COMPONENTS[this.name()] ?? null
  );

  readonly cardClasses = computed(() =>
    `icon-card-root group relative flex flex-col items-center justify-center rounded-[16px] bg-white px-[28px] pt-[50px] dark:bg-[#0A0A0A] ${this.cardClassName()}`.trim()
  );

  readonly iconWrapperClasses = computed(() =>
    `flex items-center justify-center text-neutral-800 dark:text-neutral-100 ${this.iconClassName()}`.trim()
  );

  readonly iconInputs = computed(() => ({
    size: this.size(),
    animate: this.iconAnimate(),
  }));

  readonly actionsClasses = computed(() => {
    const base =
      "actions-row my-6 flex items-center justify-center gap-2 transition-opacity duration-100";
    if (this.actionsAlwaysVisible()) {
      return `${base} opacity-100`;
    }
    return `${base} opacity-0 group-hover:opacity-100 has-data-busy:opacity-100 has-focus-visible:opacity-100`;
  });

  handleMouseEnter() {
    this.iconAnimate.set(true);
  }

  handleMouseLeave() {
    this.iconAnimate.set(false);
    this.isCodeActionHovered.set(false);
    this.isCLIActionHovered.set(false);
  }

  handlePlayClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.isAnimating()) {
      this.iconAnimate.set(false);
      this.isAnimating.set(false);
      if (this.playTimeout) {
        clearTimeout(this.playTimeout);
        this.playTimeout = null;
      }
      return;
    }

    this.iconAnimate.set(true);
    this.isAnimating.set(true);
    this.playTimeout = setTimeout(() => {
      this.isAnimating.set(false);
      this.iconAnimate.set(false);
      this.playTimeout = null;
    }, 1500);
  }

  async handleCopyCode(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.codeState() !== "idle") {
      return;
    }

    try {
      this.codeState.set("loading");
      const code = `<hi-${this.name()} [size]="28" />`;
      await navigator.clipboard.writeText(code);
      this.codeState.set("done");
    } catch {
      toast.error("Failed to copy to clipboard");
      this.codeState.set("error");
    } finally {
      setTimeout(() => this.codeState.set("idle"), 2000);
    }
  }

  async handleCopyCLI(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.cliState() !== "idle") {
      return;
    }

    try {
      const command = `${SITE.url}/r/${this.name()}`;
      await navigator.clipboard.writeText(command);
      this.cliState.set("done");
    } catch {
      toast.error("Failed to copy to clipboard");
      this.cliState.set("error");
    } finally {
      setTimeout(() => this.cliState.set("idle"), 2000);
    }
  }

  ngOnDestroy() {
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }
  }
}
