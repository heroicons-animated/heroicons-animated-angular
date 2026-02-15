import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxSonnerToaster, HeaderComponent, RouterOutlet],
  template: `
    <ngx-sonner-toaster position="top-center" />

    <div class="root relative bg-background antialiased">
      <app-header />
      <router-outlet />
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }
  `,
})
export class AppComponent {}
