import { ApplicationConfig } from '@angular/core';
import { provideHeroiconsAnimated } from '@heroicons-animated/angular';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideHeroiconsAnimated({}), provideRouter(appRoutes)],
};
