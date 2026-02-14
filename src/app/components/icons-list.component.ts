import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import Fuse from 'fuse.js';
import { ICON_MANIFEST, type IconManifest } from '../icon-manifest';
import { SearchInputComponent } from './search-input.component';
import { IconCardComponent } from './icon-card.component';

@Component({
  selector: 'app-icons-list',
  standalone: true,
  imports: [SearchInputComponent, IconCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view-container py-4">
      <app-search-input
        [value]="query()"
        [resultCount]="filteredIcons().length"
        [totalCount]="totalCount"
        (valueChange)="query.set($event)"
      />
    </div>

    <div class="view-container pb-16">
      @if (filteredIcons().length === 0) {
        <div class="py-20 text-center text-sm text-foreground/40">No icons found</div>
      } @else {
        <div
          class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          @for (icon of filteredIcons(); track icon.name) {
            <app-icon-card [name]="icon.name" />
          }
        </div>
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
}
