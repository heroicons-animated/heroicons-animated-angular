import { ApplicationConfig } from '@angular/core';
import { provideHeroiconsAnimated } from '@heroicons-animated/angular';

export const appConfig: ApplicationConfig = {
  providers: [provideHeroiconsAnimated({})],
};
