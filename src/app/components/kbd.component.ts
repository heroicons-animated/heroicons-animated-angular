import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kbd
      [class]="
        'pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium ' +
        className()
      "
    >
      <ng-content />
    </kbd>
  `,
})
export class KbdComponent {
  readonly className = input('bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500');
}
