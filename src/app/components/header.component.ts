import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AngularLogoComponent } from './angular-logo.component';
import { GithubStarsButtonComponent } from './github-stars-button.component';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent, GithubStarsButtonComponent, AngularLogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="h-(--header-height) border-neutral-200 xl:border-b dark:border-neutral-800">
      <div
        class="view-container flex h-full w-full justify-between gap-4 border-neutral-200 xl:border-x dark:border-neutral-800"
      >
        <a
          aria-label="Heroicons Animated - Home"
          class="mr-auto flex items-center gap-2 font-sans text-base focus-within:outline-offset-4 focus-visible:outline-1 focus-visible:outline-primary max-[524px]:translate-y-[-2px] min-[395px]:text-xl"
          href="/"
          tabindex="0"
        >
          <svg
            aria-hidden="true"
            class="w-6 text-primary min-[395px]:w-8"
            data-type="default"
            fill="none"
            viewBox="0 0 156 166"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="m78.091 0 5.967 5.676c15.038 14.306 35.323 23.067 57.663 23.067.356 0 .711-.002 1.065-.006l6.363-.08 1.988 6.072a102.026 102.026 0 0 1 5.045 31.782c0 47.391-32.269 87.19-75.928 98.477l-2.163.559-2.163-.559C32.27 153.701 0 113.902 0 66.511c0-11.085 1.769-21.772 5.045-31.782l1.988-6.072 6.363.08c.354.004.71.006 1.065.006 22.34 0 42.625-8.761 57.664-23.067L78.09 0Z"
              fill="currentColor"
              fill-rule="evenodd"
            />
            <circle cx="58" cy="78" fill="white" r="14" />
            <circle cx="98" cy="78" fill="white" r="14" />
            <circle cx="61" cy="82" fill="black" r="5.5" />
            <circle cx="95" cy="82" fill="black" r="5.5" />
          </svg>
          <span class="relative inline-flex flex-col">
            <span>heroicons-animated</span>
            <span
              class="absolute -bottom-[14px] right-0 flex items-center gap-1 font-mono text-[10px] text-secondary"
            >
              - for
              <svg-angular [size]="{ width: 14, height: 14 }" />
            </span>
          </span>
        </a>

        <div class="ml-auto flex w-full flex-1 flex-wrap-reverse items-center justify-end gap-2">
          <a
            aria-label="Sponsor Project"
            class="group flex size-9 items-center justify-center gap-1 rounded-[10px] bg-white font-sans text-[#3F3F47] text-sm underline-offset-4 focus-within:outline-offset-2 hover:underline focus-visible:outline-1 focus-visible:outline-primary sm:size-auto sm:bg-transparent sm:pr-1 dark:bg-white/10 dark:text-[#FAFAFA] sm:dark:bg-transparent"
            href="https://github.com/sponsors/Aniket-508"
            tabindex="0"
            target="_blank"
            rel="noopener noreferrer"
            (mouseenter)="isSponsorIconAnimating.set(true)"
            (mouseleave)="isSponsorIconAnimating.set(false)"
            (focus)="isSponsorIconAnimating.set(true)"
            (blur)="isSponsorIconAnimating.set(false)"
          >
            <svg
              aria-hidden="true"
              class="icon-svg text-primary"
              [class.heart-animate]="isSponsorIconAnimating()"
              fill="currentColor"
              height="16"
              viewBox="0 0 24 24"
              width="16"
            >
              <path
                d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"
              />
            </svg>
            <span class="hidden sm:inline">Sponsor Project</span>
          </a>

          <app-theme-toggle />
          <app-github-stars-button />
        </div>
      </div>
    </header>
  `,
  styles: `
    .icon-svg {
      transform-box: fill-box;
      transform-origin: center;
      transition: transform 0.3s ease;
    }

    .icon-svg.heart-animate {
      animation: heart-pulse 0.45s ease-in-out 3;
    }

    @keyframes heart-pulse {
      0%,
      100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.08);
      }
    }
  `,
})
export class HeaderComponent {
  readonly isSponsorIconAnimating = signal(false);
}
