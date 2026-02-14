import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  viewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MagnifyingGlassIcon } from '@heroicons-animated/angular';
import { KbdComponent } from './kbd.component';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [MagnifyingGlassIcon, KbdComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex items-center gap-2 rounded-xl border border-foreground/10 bg-background px-3 h-10 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
    >
      <hi-magnifying-glass class="text-foreground/30 shrink-0" [size]="18" />
      <input
        #searchInput
        type="text"
        placeholder="Search icons..."
        class="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-foreground/30 font-sans"
        [value]="value()"
        (input)="onInput($event)"
        autocomplete="off"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
      />
      @if (showResultCount()) {
        <span class="shrink-0 font-mono text-xs text-foreground/40">
          {{ resultCount() }}/{{ totalCount() }}
        </span>
      } @else {
        <app-kbd>
          <span class="text-[10px]">&#8984;</span>
          <span class="text-[10px]">K</span>
        </app-kbd>
      }
    </div>
  `,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  readonly value = input('');
  readonly resultCount = input<number | undefined>(undefined);
  readonly totalCount = input<number | undefined>(undefined);
  readonly valueChange = output<string>();

  readonly searchInputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly showResultCount = computed(() => {
    const v = this.value();
    return v.length > 0 && this.resultCount() !== undefined && this.totalCount() !== undefined;
  });

  private keydownHandler = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === 'k') {
      event.preventDefault();
      this.searchInputRef()?.nativeElement.focus();
    }
    if (event.key === 'Escape') {
      this.valueChange.emit('');
      this.searchInputRef()?.nativeElement.blur();
    }
  };

  ngOnInit() {
    window.addEventListener('keydown', this.keydownHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.keydownHandler);
  }

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
