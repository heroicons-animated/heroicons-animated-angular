import type { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHeroiconsAnimated } from "@heroicons-animated/angular";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [provideHeroiconsAnimated({}), provideRouter(appRoutes)],
};
