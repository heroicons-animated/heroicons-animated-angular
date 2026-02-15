import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import Fuse from 'fuse.js';
import { ICON_MANIFEST, type IconManifest } from '../icon-manifest';
import { SearchInputComponent } from './search-input.component';
import { IconCardComponent } from './icon-card.component';

@Component({
  selector: 'app-icons-list',
  standalone: true,
  imports: [SearchInputComponent, IconCardComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-search-input
      [value]="query()"
      [resultCount]="filteredIcons().length"
      [totalCount]="totalCount"
      (valueChange)="query.set($event)"
    />
    <div
      class="view-container grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 border-neutral-200 pt-2 pb-[60px] xl:border-x dark:border-neutral-800"
    >
      @if (filteredIcons().length === 0) {
        <div class="col-span-full pt-10 text-center text-neutral-500 text-sm">No icons found</div>
      } @else {
        @for (icon of filteredIcons(); track icon.name) {
          <a
            class="rounded-[16px] focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
            [routerLink]="['/icons', icon.name]"
          >
            <app-icon-card
              [name]="icon.name"
              cardClassName="transition-shadow hover:shadow-sm"
            />
          </a>
        }
      }
    </div>
  `,
})
export class IconsListComponent {
  readonly totalCount = ICON_MANIFEST.length;
  readonly query = signal('');

  private readonly fuse = new Fuse<IconManifest>(ICON_MANIFEST, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'keywords', weight: 2 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
    findAllMatches: true,
    isCaseSensitive: false,
    minMatchCharLength: 2,
  });

  readonly filteredIcons = computed(() => {
    const q = this.query().trim();
    if (!q) return ICON_MANIFEST;
    return this.fuse.search(q).map((result) => result.item);
  });

  constructor() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      this.query.set(params.get('search') ?? '');
    }

    effect(() => {
      if (typeof window === 'undefined') {
        return;
      }

      const value = this.query().trim();
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('search', value);
      } else {
        url.searchParams.delete('search');
      }

      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    });
  }
}
