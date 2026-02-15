import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ArrowLeftIcon } from "@heroicons-animated/angular";
import { map } from "rxjs";
import { CliBlockComponent } from "../components/cli-block.component";
import { IconCardComponent } from "../components/icon-card.component";
import type { IconManifest } from "../icon-manifest";
import { ICON_MANIFEST } from "../icon-manifest";
import { SeoService } from "../seo.service";

@Component({
  selector: "app-icon-page",
  standalone: true,
  imports: [RouterLink, ArrowLeftIcon, IconCardComponent, CliBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon(); as currentIcon) {
      <section class="flex min-h-[calc(100vh-var(--header-height))] flex-col">
        <div
          class="view-container flex flex-col items-start border-neutral-200 py-12 xl:border-x xl:pb-4 min-[880px]:pt-[60px] dark:border-neutral-800"
        >
          <a
            class="mb-8 flex items-center gap-2 font-sans text-secondary text-sm transition-colors duration-100 hover:text-primary focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
            routerLink="/"
            (blur)="isBackLinkHovered.set(false)"
            (focus)="isBackLinkHovered.set(true)"
            (mouseenter)="isBackLinkHovered.set(true)"
            (mouseleave)="isBackLinkHovered.set(false)"
          >
            <hi-arrow-left
              [animate]="isBackLinkHovered()"
              aria-hidden="true"
              class="size-4"
              [size]="16"
            />
            Back to all icons
          </a>

          <div class="flex w-full flex-col gap-6 min-[880px]:flex-row min-[880px]:items-center">
            <app-icon-card
              [name]="currentIcon.name"
              [size]="48"
              [actionsAlwaysVisible]="true"
              [showTitle]="false"
              cardClassName="w-full min-[880px]:w-[200px]"
              iconClassName="text-neutral-800 dark:text-neutral-100"
            />

            <div class="flex h-full flex-col gap-1">
              <h1 class="font-sans text-[28px] min-[640px]:text-[36px]">
                {{ pascalName() }}
              </h1>
              <p class="font-mono text-secondary text-sm">
                Animated {{ currentIcon.name.replaceAll('-', ' ') }} icon for Angular
              </p>
              <app-cli-block
                className="mt-7 hidden px-0 min-[880px]:flex"
                [staticIconName]="currentIcon.name"
              />
            </div>
          </div>

          <app-cli-block
            className="mt-8 flex px-0 min-[880px]:hidden"
            [staticIconName]="currentIcon.name"
          />
        </div>

        <div class="view-container border-neutral-200 py-4 xl:border dark:border-neutral-800">
          <h2 class="mb-3 font-sans text-xl">Keywords</h2>
          <div class="flex flex-wrap gap-2">
            @for (keyword of currentIcon.keywords; track keyword) {
              <span
                class="rounded-[12px] bg-neutral-200 px-3 py-1 font-mono text-secondary text-sm dark:bg-[#262626]"
              >
                {{ keyword }}
              </span>
            }
          </div>
        </div>

        @if (similarIcons().length === 0) {
          <div
            class="view-container flex-1 border-neutral-200 pb-[60px] xl:border-x dark:border-neutral-800"
          ></div>
        } @else {
          <div
            class="view-container border-neutral-200 pt-12 pb-[60px] xl:border-x xl:pt-4 dark:border-neutral-800"
          >
            <h2 class="mb-4 font-sans text-xl">Similar Icons</h2>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
              @for (item of similarIcons(); track item.name) {
                <a
                  class="rounded-[16px] focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-2"
                  [routerLink]="['/icons', item.name]"
                >
                  <app-icon-card
                    [name]="item.name"
                    [showActions]="false"
                    cardClassName="pb-[50px] transition-shadow hover:shadow-sm"
                  />
                </a>
              }
            </div>
          </div>
        }
      </section>
    } @else {
      <section class="view-container py-16 text-center">
        <h1 class="font-sans text-2xl">Icon not found</h1>
        <p class="mt-2 font-mono text-secondary text-sm">The requested icon does not exist.</p>
      </section>
    }
  `,
})
export class IconPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly isBackLinkHovered = signal(false);

  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get("slug") ?? "")),
    { initialValue: "" }
  );

  readonly icon = computed<IconManifest | null>(() => {
    const slug = this.slug();
    return ICON_MANIFEST.find((item) => item.name === slug) ?? null;
  });

  readonly pascalName = computed(() => {
    const name = this.icon()?.name ?? "";
    return name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
  });

  readonly similarIcons = computed(() => {
    const currentIcon = this.icon();
    if (!currentIcon) {
      return [];
    }

    const currentKeywords = new Set(currentIcon.keywords);

    return ICON_MANIFEST.filter((item) => item.name !== currentIcon.name)
      .map((item) => ({
        icon: item,
        score: item.keywords.filter((keyword) => currentKeywords.has(keyword))
          .length,
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.icon);
  });

  constructor() {
    effect(() => {
      const currentIcon = this.icon();
      const slug = this.slug();

      if (currentIcon) {
        this.seo.setIconMeta(currentIcon);
      } else if (slug) {
        this.seo.setNotFoundMeta();
      }
    });
  }
}
