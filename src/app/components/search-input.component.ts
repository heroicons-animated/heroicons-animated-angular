import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  input,
  type OnDestroy,
  type OnInit,
  output,
  viewChild,
} from "@angular/core";
import { MagnifyingGlassIcon } from "@heroicons-animated/angular";
import { KbdComponent } from "./kbd.component";

@Component({
  selector: "app-search-input",
  standalone: true,
  imports: [MagnifyingGlassIcon, KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="sticky top-0 z-50 border-neutral-200 border-y bg-background/80 backdrop-blur-md dark:border-neutral-800 dark:bg-background/80"
    >
      <div
        class="view-container flex items-center gap-2 border-neutral-200 py-2 xl:border-x dark:border-neutral-800"
      >
        <div class="group relative w-full">
          <span class="pointer-events-none absolute top-1/2 left-3 inline-flex shrink-0 -translate-y-1/2">
            <hi-magnifying-glass class="text-neutral-500" [size]="20" />
          </span>
          <input
            #searchInput
            aria-label="Search icons"
            autocomplete="off"
            autocorrect="off"
            class="flex h-10 w-full min-w-0 rounded-[10px] px-3 py-1 pl-10 pr-12 font-sans text-sm outline-none ring-1 bg-white text-neutral-800 ring-neutral-200 selection:bg-primary selection:text-white placeholder:text-neutral-400/70 transition-colors focus-visible:ring-primary dark:bg-[#0A0A0A] dark:text-neutral-100 dark:ring-neutral-800 dark:focus-visible:ring-primary"
            inputmode="search"
            placeholder="Search icons..."
            role="search"
            spellcheck="false"
            type="text"
            [value]="value()"
            (input)="onInput($event)"
          />
          <span class="pointer-events-none absolute top-1/2 right-3 inline-flex shrink-0 -translate-y-1/2">
            @if (showResultCount()) {
              <span class="font-mono text-neutral-400 text-sm">
                {{ resultCount() }}/{{ totalCount() }}
              </span>
            } @else {
              <app-kbd className="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                ⌘ K
              </app-kbd>
            }
          </span>
        </div>
      </div>
    </div>
  `,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  readonly value = input("");
  readonly resultCount = input<number | undefined>(undefined);
  readonly totalCount = input<number | undefined>(undefined);
  readonly valueChange = output<string>();

  readonly searchInputRef =
    viewChild<ElementRef<HTMLInputElement>>("searchInput");

  readonly showResultCount = computed(() => {
    const v = this.value();
    return (
      v.length > 0 &&
      this.resultCount() !== undefined &&
      this.totalCount() !== undefined
    );
  });

  private readonly keydownHandler = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      this.searchInputRef()?.nativeElement.focus();
    }
    if (event.key === "Escape") {
      this.valueChange.emit("");
      this.searchInputRef()?.nativeElement.blur();
    }
  };

  ngOnInit() {
    window.addEventListener("keydown", this.keydownHandler);
  }

  ngOnDestroy() {
    window.removeEventListener("keydown", this.keydownHandler);
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
