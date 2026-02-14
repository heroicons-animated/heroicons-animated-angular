import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-kbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <kbd
      class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-foreground/15 bg-foreground/5 px-1.5 font-mono text-[10px] font-medium text-foreground/50"
    >
      <ng-content />
    </kbd>
  `,
})
export class KbdComponent {}
