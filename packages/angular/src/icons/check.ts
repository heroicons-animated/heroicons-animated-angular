import {
  Component,
  ChangeDetectionStrategy,
  input,
  signal,
  computed,
  viewChild,
  ElementRef,
  effect,
  inject,
  DestroyRef,
} from '@angular/core';

@Component({
  selector: 'hi-check',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.aria-label]': "'check'",
    role: 'img',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    [attr.width]="size()"
    [attr.height]="size()"
    viewBox="0 0 24 24"
    fill="none"
    [attr.stroke]="color()"
    [attr.stroke-width]="strokeWidth()"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="icon-svg"
  >
    <path #pathElement d="m4.5 12.75 6 6 9-13.5" />
  </svg>`,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .icon-svg {
        transform-box: fill-box;
        transform-origin: center;
      }

      .icon-svg path {
        transform-box: fill-box;
        transform-origin: center;
      }
    `,
  ],
})
export class CheckIcon {
  readonly color = input('currentColor');
  readonly size = input(28);
  readonly strokeWidth = input(1.5);
  readonly animate = input(false);

  protected isHovered = signal(false);
  protected shouldAnimate = computed(() => this.animate() || this.isHovered());

  protected readonly pathElement = viewChild<ElementRef<SVGPathElement>>('pathElement');

  private pathAnimation: Animation | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.shouldAnimate()) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    });
    this.destroyRef.onDestroy(() => this.stopAnimation());
  }

  private startAnimation() {
    if (this.pathElement()?.nativeElement) {
      const len = this.pathElement()!.nativeElement.getTotalLength();
      this.pathElement()!.nativeElement.style.strokeDasharray = `${len}`;
      this.pathElement()!.nativeElement.style.strokeDashoffset = `${len}`;
      this.pathElement()!.nativeElement.style.opacity = '0';
      this.pathElement()!.nativeElement.style.transform = 'scale(0.5)';
      this.pathElement()!.nativeElement.style.transformOrigin = 'center';

      this.pathAnimation = this.pathElement()!.nativeElement.animate(
        [
          {
            strokeDashoffset: len,
            opacity: 0,
            transform: 'scale(0.5)',
          },
          {
            strokeDashoffset: 0,
            opacity: 1,
            transform: 'scale(1)',
          },
        ],
        {
          duration: 400,
          easing: 'ease-out',
          fill: 'forwards',
        },
      );
    }
  }

  private stopAnimation() {
    if (this.pathAnimation) {
      this.pathAnimation.cancel();
      this.pathAnimation = null;
    }

    if (this.pathElement()?.nativeElement) {
      this.pathElement()!.nativeElement.style.strokeDasharray = '';
      this.pathElement()!.nativeElement.style.strokeDashoffset = '';
      this.pathElement()!.nativeElement.style.opacity = '';
      this.pathElement()!.nativeElement.style.transform = '';
    }
  }
  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
