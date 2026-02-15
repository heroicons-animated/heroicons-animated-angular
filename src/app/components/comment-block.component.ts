import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { ArrowTopRightOnSquareIcon } from "@heroicons-animated/angular";

@Component({
  selector: "app-comment-block",
  standalone: true,
  imports: [ArrowTopRightOnSquareIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative my-[40px] flex w-full max-w-[610px] flex-col items-center justify-center pl-4 after:absolute after:left-0 after:h-full after:w-[4px] after:bg-neutral-400/50 max-[655px]:px-4 max-[655px]:after:left-4"
    >
      <blockquote
        class="font-sans text-neutral-700 text-sm leading-[150%] tracking-normal max-[655px]:pl-4 dark:text-neutral-200"
      >
        these icons were heavily inspired from the work of
        <a
          class="inline-block underline underline-offset-3 transition-colors duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
          href="https://lucide-animated.com/"
          rel="noopener external"
          tabindex="0"
          target="_blank"
        >
          lucide-animated by dmytro
        </a>
        and what i learned from the
        <a
          class="inline-block underline underline-offset-3 transition-colors duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
          href="https://animations.dev/"
          rel="noopener external"
          tabindex="0"
          target="_blank"
        >
          animations.dev
        </a>
        course.
      </blockquote>

      <div
        class="mt-4 flex w-full flex-wrap items-center justify-between gap-4 border-neutral-200 border-t pt-4 max-[655px]:pl-4 dark:border-neutral-800"
      >
        <div class="flex items-center gap-2">
          <img
            alt="Aniket Pawar, the author of the heroicons-animated"
            class="size-7 rounded-full object-cover"
            src="https://ik.imagekit.io/2oajjadqkz/profile.jpg?updatedAt=1770631384305"
          />
          <p class="text-[13px] text-neutral-600 tracking-normal dark:text-neutral-400">
            <a
              class="inline-block underline underline-offset-3 transition-colors duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
              href="https://aniketpawar.com/"
              rel="noopener external"
              tabindex="0"
              target="_blank"
            >
              aniket
            </a>, creator of heroicons-animated
          </p>
        </div>
        <a
          class="flex w-fit cursor-pointer items-center justify-center gap-1 rounded-[8px] bg-primary px-[12px] py-[4px] font-sans text-sm text-white transition-colors duration-100 hover:bg-primary/90 focus-visible:outline-1 focus-visible:outline-primary focus-visible:outline-offset-1 max-[445px]:w-full"
          href="https://animations.dev/"
          rel="noopener external"
          tabindex="0"
          target="_blank"
          (mouseenter)="isArrowHovered.set(true)"
          (mouseleave)="isArrowHovered.set(false)"
        >
          Take the course
          <hi-arrow-top-right-on-square [size]="14" [animate]="isArrowHovered()" />
        </a>
      </div>
    </div>
  `,
})
export class CommentBlockComponent {
  readonly isArrowHovered = signal(false);
}
