import { Component } from '@angular/core';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HeaderComponent } from './components/header.component';
import { CliBlockComponent } from './components/cli-block.component';
import { CommentBlockComponent } from './components/comment-block.component';
import { IconsListComponent } from './components/icons-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxSonnerToaster,
    HeaderComponent,
    CliBlockComponent,
    CommentBlockComponent,
    IconsListComponent,
  ],
  template: `
    <!-- Toast provider -->
    <ngx-sonner-toaster position="bottom-right" [richColors]="true" />

    <!-- Header -->
    <app-header />

    <!-- Hero section -->
    <section class="border-b border-foreground/10">
      <div class="view-container flex flex-col items-center py-16 text-center">
        <h1 class="text-4xl font-normal tracking-tight text-foreground sm:text-5xl">
          Beautifully animated heroicons<span class="text-primary">*</span>
        </h1>

        <p class="mt-5 max-w-xl font-mono text-sm leading-relaxed text-foreground/50">
          an open-source (
          <a
            href="https://github.com/heroicons-animated/heroicons-animated-angular/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            class="text-foreground/50 underline underline-offset-2 hover:text-primary"
          >
            MIT License
          </a>
          ) collection of smooth animated
          <span class="font-semibold text-foreground/70">316</span> icons for your projects. feel
          free to use them, share your feedback, and let's make this library awesome together!
        </p>

        <p class="mt-4 font-mono text-sm text-foreground/50">
          Crafted with
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations/Using_CSS_animations"
            target="_blank"
            rel="noopener noreferrer"
            class="mx-0.5 inline-block rounded-md border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-primary no-underline transition-colors hover:bg-foreground/10"
          >
            CSS Animations
          </a>
          &amp;
          <a
            href="https://heroicons.com"
            target="_blank"
            rel="noopener noreferrer"
            class="mx-0.5 inline-block rounded-md border border-foreground/10 bg-foreground/5 px-2 py-0.5 text-primary no-underline transition-colors hover:bg-foreground/10"
          >
            Heroicons
          </a>
        </p>
      </div>
    </section>

    <!-- CLI Block -->
    <section class="border-b border-foreground/10 py-6">
      <app-cli-block />
    </section>

    <!-- Comment Block -->
    <section class="border-b border-foreground/10">
      <app-comment-block />
    </section>

    <!-- Icons List -->
    <section>
      <app-icons-list />
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
