import type { Routes } from "@angular/router";
import { HomePageComponent } from "./pages/home-page.component";
import { IconPageComponent } from "./pages/icon-page.component";

export const appRoutes: Routes = [
  {
    path: "",
    component: HomePageComponent,
  },
  {
    path: "icons/:slug",
    component: IconPageComponent,
  },
  {
    path: "**",
    redirectTo: "",
  },
];
