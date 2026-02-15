import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { SITE } from "./site.constants";

interface IconMeta {
  name: string;
  keywords: string[];
}

@Injectable({ providedIn: "root" })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setHomeMeta() {
    const siteUrl = this.getOrigin();
    const title = `${SITE.name} | Free Animated Heroicons for Angular`;
    const description = SITE.description.short;
    const canonical = siteUrl;
    const ogImage = `${siteUrl}${SITE.ogImagePath}`;

    this.title.setTitle(title);
    this.setCanonical(canonical);
    this.setDescription(description);
    this.setKeywords(SITE.keywords.join(", "));
    this.setRobots("index,follow");
    this.setOpenGraph({
      url: canonical,
      title,
      description,
      image: ogImage,
      imageAlt: `${SITE.name} - Animated Heroicons Library for Angular`,
    });
    this.setTwitter({
      title,
      description,
      image: ogImage,
      imageAlt: `${SITE.name} - Animated Heroicons Library for Angular`,
    });
    this.setThemeColor("#f5f5f5");
    this.setJsonLd("website-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: canonical,
      description: SITE.description.long,
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${canonical}?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });
    this.removeJsonLd("icon-schema");
    this.removeJsonLd("breadcrumb-schema");
  }

  setIconMeta(icon: IconMeta) {
    const siteUrl = this.getOrigin();
    const pascalName = icon.name
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    const title = `${pascalName} Icon - Animated Icon for Angular`;
    const description =
      icon.keywords.length > 0
        ? `Free animated ${icon.name} icon for Angular. Smooth animations, copy-paste ready. Keywords: ${icon.keywords.slice(0, 5).join(", ")}.`
        : `Free animated ${icon.name} icon for Angular. Smooth animations, copy-paste ready.`;
    const canonical = `${siteUrl}/icons/${icon.name}`;
    const ogImage = `${siteUrl}${SITE.ogImagePath}`;

    this.title.setTitle(title);
    this.setCanonical(canonical);
    this.setDescription(description);
    this.setKeywords(
      [
        ...icon.keywords,
        "animated icon",
        "angular icon",
        `${icon.name} animation`,
      ].join(", ")
    );
    this.setRobots("index,follow");
    this.setOpenGraph({
      url: canonical,
      title,
      description,
      image: ogImage,
      imageAlt: `${pascalName} icon preview`,
    });
    this.setTwitter({
      title,
      description,
      image: ogImage,
      imageAlt: `${pascalName} icon preview`,
    });
    this.setThemeColor("#f5f5f5");
    this.setJsonLd("icon-schema", {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: pascalName,
      description: `Animated ${icon.name} icon component for Angular`,
      codeRepository:
        "https://github.com/heroicons-animated/heroicons-animated-angular",
      programmingLanguage: ["TypeScript", "Angular"],
      keywords: icon.keywords.join(", "),
    });
    this.setJsonLd("breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Icons",
          item: `${siteUrl}/icons`,
        },
        { "@type": "ListItem", position: 3, name: pascalName, item: canonical },
      ],
    });
  }

  setNotFoundMeta() {
    const siteUrl = this.getOrigin();
    this.title.setTitle(`Icon Not Found | ${SITE.name}`);
    this.setCanonical(`${siteUrl}/icons`);
    this.setDescription("The requested icon could not be found.");
    this.setRobots("noindex,nofollow");
    this.setThemeColor("#f5f5f5");
    this.removeJsonLd("icon-schema");
    this.removeJsonLd("breadcrumb-schema");
  }

  private getOrigin() {
    if (typeof window !== "undefined" && window.location.origin) {
      return window.location.origin;
    }
    return SITE.fallbackUrl;
  }

  private setCanonical(url: string) {
    let link = this.document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!link) {
      link = this.document.createElement("link");
      link.setAttribute("rel", "canonical");
      this.document.head.appendChild(link);
    }
    link.setAttribute("href", url);
  }

  private setDescription(content: string) {
    this.meta.updateTag({ name: "description", content });
  }

  private setKeywords(content: string) {
    this.meta.updateTag({ name: "keywords", content });
  }

  private setRobots(content: string) {
    this.meta.updateTag({ name: "robots", content });
  }

  private setThemeColor(content: string) {
    this.meta.updateTag({ name: "theme-color", content });
  }

  private setOpenGraph(data: {
    url: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }) {
    this.meta.updateTag({ property: "og:type", content: "website" });
    this.meta.updateTag({ property: "og:site_name", content: SITE.name });
    this.meta.updateTag({ property: "og:url", content: data.url });
    this.meta.updateTag({ property: "og:title", content: data.title });
    this.meta.updateTag({
      property: "og:description",
      content: data.description,
    });
    this.meta.updateTag({ property: "og:image", content: data.image });
    this.meta.updateTag({ property: "og:image:alt", content: data.imageAlt });
  }

  private setTwitter(data: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }) {
    this.meta.updateTag({
      name: "twitter:card",
      content: "summary_large_image",
    });
    this.meta.updateTag({ name: "twitter:site", content: SITE.author.twitter });
    this.meta.updateTag({ name: "twitter:title", content: data.title });
    this.meta.updateTag({
      name: "twitter:description",
      content: data.description,
    });
    this.meta.updateTag({ name: "twitter:image", content: data.image });
    this.meta.updateTag({ name: "twitter:image:alt", content: data.imageAlt });
  }

  private setJsonLd(id: string, schema: Record<string, unknown>) {
    const scriptId = `json-ld-${id}`;
    let script = this.document.getElementById(
      scriptId
    ) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  private removeJsonLd(id: string) {
    const script = this.document.getElementById(`json-ld-${id}`);
    if (script) {
      script.remove();
    }
  }
}
