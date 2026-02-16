import { provideFileRouter, requestContextInterceptor } from "@analogjs/router";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import {
  type ApplicationConfig,
  provideZoneChangeDetection,
} from "@angular/core";
import {
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from "@angular/router";
import { provideHeroiconsAnimated } from "@heroicons-animated/angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHeroiconsAnimated({}),
    provideFileRouter(
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
  ],
};
