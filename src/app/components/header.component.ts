import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeToggleComponent } from './theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-50 h-(--header-height) border-b border-foreground/10 bg-background/80 backdrop-blur-sm"
    >
      <div class="view-container flex h-full items-center justify-between">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2 text-foreground no-underline">
          <svg
            class="h-7 w-7 text-primary"
            viewBox="0 0 156 166"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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
          <span class="text-lg font-normal tracking-tight">heroicons-animated</span>
          <span
            class="ml-1 inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground/60"
          >
            for Angular
          </span>
        </a>

        <!-- Right actions -->
        <div class="flex items-center gap-2">
          <a
            href="https://github.com/heroicons-animated/heroicons-animated-angular"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-background px-3 py-1.5 text-sm text-foreground/70 no-underline transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span class="hidden sm:inline text-xs">Star on GitHub</span>
          </a>

          <app-theme-toggle />
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
