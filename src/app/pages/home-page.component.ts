import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
} from "@angular/core";
import { CliBlockComponent } from "../components/cli-block.component";
import { CommentBlockComponent } from "../components/comment-block.component";
import { IconsListComponent } from "../components/icons-list.component";
import { SeoService } from "../seo.service";
import { LINK } from "../site.constants";

@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [CliBlockComponent, CommentBlockComponent, IconsListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="view-container flex flex-col items-center justify-center border-neutral-200 px-0 pt-[60px] xl:border-x dark:border-neutral-800"
      id="hero"
    >
      <h1 class="px-4 text-center font-sans text-[32px] min-[640px]:text-[42px]">
        Beautifully animated heroicons for Angular<span class="text-primary">^</span>
      </h1>
      <p class="mt-5 max-w-[582px] px-4 text-center font-mono text-secondary text-sm">
        an open-source (<a
          class="underline underline-offset-3 transition-colors duration-100 focus-within:outline-offset-0 hover:decoration-primary focus-visible:outline-1 focus-visible:outline-primary"
          [href]="link.license"
          rel="noopener noreferrer"
          tabindex="0"
          target="_blank"
        >
          MIT License
        </a>) collection of smooth animated <br />
        316 icons for your projects. feel free to use them, share your feedback, and let's make
        this library awesome together!
      </p>
      <p class="mt-4 font-mono text-secondary text-xs min-[640px]:text-sm">
        Crafted with
        <a
          class="bg-[#E5E5E5] px-2 py-0.5 text-primary focus-within:outline-offset-1 focus-visible:outline-1 focus-visible:outline-primary dark:bg-[#262626]"
          [href]="link.cssAnimations"
          rel="noopener noreferrer"
          tabindex="0"
          target="_blank"
        >
          CSS Animations
        </a>
        &amp;
        <a
          class="bg-[#E5E5E5] px-2 py-0.5 text-primary focus-within:outline-offset-1 focus-visible:outline-1 focus-visible:outline-primary dark:bg-[#262626]"
          [href]="link.heroicons"
          rel="noopener noreferrer"
          tabindex="0"
          target="_blank"
        >
          Heroicons
        </a>
      </p>
      <app-cli-block />
      <app-comment-block />
    </section>

    <section id="icons">
      <app-icons-list />
    </section>
  `,
})
export class HomePageComponent implements OnInit {
  readonly link = LINK;
  private readonly seo = inject(SeoService);

  ngOnInit() {
    this.seo.setHomeMeta();
  }
}
