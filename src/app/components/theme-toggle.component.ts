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
      class="inline-flex items-center justify-center rounded-md p-2 text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
      [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (isDark()) {
        <hi-moon [size]="20" [animate]="animating()" />
      } @else {
        <hi-sun [size]="20" [animate]="animating()" />
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  isDark = signal(false);
  animating = signal(false);

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
    this.animating.set(true);
    setTimeout(() => this.animating.set(false), 600);
  }
}
