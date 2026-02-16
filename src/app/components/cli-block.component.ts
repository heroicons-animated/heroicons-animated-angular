import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons-animated/angular";
import { toast } from "ngx-sonner";
import { ICON_MANIFEST } from "../icon-manifest";

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

@Component({
  selector: "app-cli-block",
  standalone: true,
  imports: [CheckIcon, ClipboardDocumentIcon, XMarkIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <div class="w-full">
        <div class="flex w-full">
          @for (pm of packageManagers; track pm) {
            <button [class]="tabClasses(pm)" type="button" (click)="selectedPm.set(pm)">
              {{ pm }}
            </button>
          }
        </div>

        <div class="mt-px overflow-hidden rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px]">
          <div
            class="relative isolate overflow-hidden rounded-tr-[8px] rounded-br-[8px] rounded-bl-[8px] bg-white whitespace-nowrap px-4 py-3 pr-20 font-mono text-sm tracking-tight dark:bg-white/10"
            (mouseenter)="isHovered.set(true)"
            (mouseleave)="isHovered.set(false)"
          >
            <span class="sr-only">{{ fullCommand() }}</span>
            <span class="text-neutral-600 dark:text-neutral-400">{{ cliPrefix() }}</span>
            <span class="text-black dark:text-white"> &#64;heroicons-animated/angular add </span>
            <span
              class="inline-flex w-[20ch] shrink-0 text-primary"
            >
              @if (animationName() === 'text-loop-a') {
                <span class="text-loop text-loop-a">{{ currentIconName() }}</span>
              } @else {
                <span class="text-loop text-loop-b">{{ currentIconName() }}</span>
              }
            </span>

            <button
              [attr.aria-disabled]="copyStatus() !== 'idle'"
              aria-label="Copy to clipboard"
              class="absolute top-1/2 right-1.5 z-20 -translate-y-1/2 cursor-pointer rounded-[5px] p-2 transition-colors duration-100 focus-within:outline-offset-1 hover:bg-neutral-100 focus-visible:outline-1 focus-visible:outline-primary dark:hover:bg-neutral-700"
              type="button"
              (click)="handleCopy()"
            >
              @if (copyStatus() === 'done') {
                <hi-check aria-hidden="true" [size]="16" />
              } @else if (copyStatus() === 'error') {
                <hi-x-mark aria-hidden="true" [size]="16" />
              } @else {
                <hi-clipboard-document aria-hidden="true" [size]="16" [animate]="isHovered()" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .text-loop {
      animation-duration: 0.25s;
      animation-timing-function: ease-out;
      animation-fill-mode: both;
      will-change: transform, opacity, filter;
      transform-origin: 50% 50%;
    }

    .text-loop-a {
      animation-name: text-loop-a;
    }

    .text-loop-b {
      animation-name: text-loop-b;
    }

    @keyframes text-loop-a {
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

    @keyframes text-loop-b {
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
  private readonly platformId = inject(PLATFORM_ID);

  readonly staticIconName = input("");
  readonly className = input("");

  readonly packageManagers: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
  readonly selectedPm = signal<PackageManager>("pnpm");
  readonly isHovered = signal(false);
  readonly loopIndex = signal(0);
  readonly copyStatus = signal<"idle" | "done" | "error">("idle");
  readonly animationName = signal<"text-loop-a" | "text-loop-b">("text-loop-a");

  private readonly iconList = ICON_MANIFEST.filter(
    (icon) => icon.name.length <= 20
  );
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly currentIconName = computed(() => {
    if (this.staticIconName()) {
      return this.staticIconName();
    }
    return this.iconList[this.loopIndex()]?.name ?? "";
  });

  readonly cliPrefix = computed(() => {
    switch (this.selectedPm()) {
      case "pnpm":
        return "pnpm dlx";
      case "npm":
        return "npx";
      case "yarn":
        return "yarn dlx";
      case "bun":
        return "bunx";
      default:
        return "pnpm dlx";
    }
  });

  readonly fullCommand = computed(
    () =>
      `${this.cliPrefix()} @heroicons-animated/angular add ${this.currentIconName()}`
  );

  readonly containerClasses = computed(() =>
    `relative mt-[40px] w-full max-w-[642px] px-4 ${this.className()}`.trim()
  );

  tabClasses(pm: PackageManager) {
    return [
      "z-50 inline-flex cursor-pointer items-center justify-center whitespace-nowrap px-4 py-1 font-mono text-sm tracking-tight first:rounded-tl-[6px] last:rounded-tr-[6px] transition-colors duration-50 focus-within:outline-offset-0 focus-visible:outline-1 focus-visible:outline-primary",
      pm === this.selectedPm()
        ? "bg-primary text-white"
        : "bg-white text-black hover:bg-neutral-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/5",
    ].join(" ");
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId) || this.staticIconName()) {
      return;
    }

    this.intervalId = setInterval(() => {
      if (this.iconList.length === 0) {
        return;
      }

      this.loopIndex.update((value) => (value + 1) % this.iconList.length);
      this.animationName.update((value) =>
        value === "text-loop-a" ? "text-loop-b" : "text-loop-a"
      );
    }, 1500);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async handleCopy() {
    if (this.copyStatus() !== "idle") {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.fullCommand());
      this.copyStatus.set("done");
    } catch {
      toast.error("Failed to copy to clipboard");
      this.copyStatus.set("error");
    } finally {
      setTimeout(() => this.copyStatus.set("idle"), 2000);
    }
  }
}
