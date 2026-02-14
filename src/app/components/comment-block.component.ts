import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons-animated/angular';

@Component({
  selector: 'app-comment-block',
  standalone: true,
  imports: [ArrowTopRightOnSquareIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="view-container py-6">
      <div class="rounded-xl border border-foreground/10 bg-background p-6">
        <!-- Quote text -->
        <p class="font-mono text-sm leading-relaxed text-foreground/60">
          these icons were heavily inspired from the work of
          <a
            href="https://github.com/pqoqubbw/icons"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            lucide-animated by dmytro
          </a>
          and what i learned from the
          <a
            href="https://animations.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            animations.dev
          </a>
          course.
        </p>

        <!-- Author row -->
        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary"
            >
              AP
            </div>
            <a
              href="https://x.com/alaymanguy"
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-xs text-foreground/50 hover:text-foreground/70 no-underline"
            >
              <span class="font-medium text-foreground/70">aniket</span>, creator of
              heroicons-animated
            </a>
          </div>

          <!-- Take the course button -->
          <a
            href="https://animations.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 px-3 py-1.5 text-xs text-foreground/60 no-underline transition-colors hover:bg-foreground/5 hover:text-foreground"
            (mouseenter)="isArrowHovered.set(true)"
            (mouseleave)="isArrowHovered.set(false)"
          >
            Take the course
            <hi-arrow-top-right-on-square [size]="14" [animate]="isArrowHovered()" />
          </a>
        </div>
      </div>
    </div>
  `,
})
export class CommentBlockComponent {
  isArrowHovered = signal(false);
}
