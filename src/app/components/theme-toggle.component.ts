import { Component, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { SunIcon, MoonIcon } from '@heroicons-animated/angular';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [SunIcon, MoonIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      (click)="toggle()"
      (mouseenter)="isIconHovered.set(true)"
      (mouseleave)="isIconHovered.set(false)"
      class="flex size-9 cursor-pointer items-center justify-center rounded-[10px] bg-white focus-within:outline-offset-2 focus-visible:outline-1 focus-visible:outline-primary dark:bg-white/10"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
      [attr.aria-pressed]="isDark()"
      type="button"
    >
      <span class="flex items-center justify-center">
        @if (isDark()) {
          <hi-moon aria-hidden="true" [size]="16" [animate]="isIconHovered()" />
        } @else {
          <hi-sun aria-hidden="true" [size]="16" [animate]="isIconHovered()" />
        }
      </span>
    </button>
  `,
})
export class ThemeToggleComponent {
  isDark = signal(false);
  isIconHovered = signal(false);

  constructor() {
    // Initialize from localStorage or system preference
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored === 'dark') {
      this.isDark.set(true);
    } else if (stored === 'light') {
      this.isDark.set(false);
    } else if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.isDark.set(true);
    }

    effect(() => {
      const dark = this.isDark();
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', dark);
      }
    });
  }

  toggle() {
    this.isDark.update((v) => !v);
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }
}
