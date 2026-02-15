import { InjectionToken, type Provider } from "@angular/core";

export const HEROICONS_ANIMATED_CONFIG =
  new InjectionToken<HeroiconsAnimatedOptions>("HEROICONS_ANIMATED_CONFIG", {
    factory: () => ({ color: "currentColor", size: 24, strokeWidth: 1.5 }),
  });

export type HeroiconsAnimatedOptions = Partial<{
  color: string;
  size: number;
  strokeWidth: number;
}>;

export function provideHeroiconsAnimated(
  options: HeroiconsAnimatedOptions
): Provider[] {
  return [{ provide: HEROICONS_ANIMATED_CONFIG, useValue: options }];
}
