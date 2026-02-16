import "zone.js/node";
import "@angular/platform-server/init";
import { render } from "@analogjs/router/server";
import { AppComponent } from "./app/app.component";
import { config } from "./app/app.config.server";

if (typeof globalThis.requestAnimationFrame === "undefined") {
  globalThis.requestAnimationFrame = () => 0;
}

if (typeof globalThis.cancelAnimationFrame === "undefined") {
  globalThis.cancelAnimationFrame = () => undefined;
}

export default render(AppComponent, config);
