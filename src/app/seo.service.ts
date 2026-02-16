import { REQUEST } from "@analogjs/router/tokens";
import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { ICON_MANIFEST } from "./icon-manifest";
import { LINK, SITE } from "./site.constants";

interface IconMeta {
  name: string;
  keywords: string[];
}

@Injectable({ providedIn: "root" })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly request = inject(REQUEST, { optional: true });
  private readonly title = inject(Title);

  setGlobalStructuredData() {
    const siteUrl = this.getOrigin();
    const dateModified = new Date().toISOString().split("T")[0];

    this.setJsonLd("website-schema", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: siteUrl,
      description: SITE.description.long,
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });

    this.setJsonLd("library-schema", {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: SITE.name,
      description: SITE.description.long,
      url: siteUrl,
      codeRepository: LINK.github,
      programmingLanguage: ["TypeScript", "Angular", "JavaScript"],
      runtimePlatform: "Node.js",
      license: LINK.license,
      author: {
        "@type": "Person",
        name: SITE.author.name,
        url: LINK.twitter,
      },
      maintainer: {
        "@type": "Person",
        name: SITE.author.name,
        url: LINK.twitter,
      },
      keywords: SITE.keywords.join(", "),
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      isAccessibleForFree: true,
      dateModified,
      numberOfItems: ICON_MANIFEST.length,
    });

    this.setJsonLd("organization-schema", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: siteUrl,
      logo: `${siteUrl}${SITE.ogImagePath}`,
      sameAs: [LINK.github, LINK.twitter],
      founder: {
        "@type": "Person",
        name: SITE.author.name,
        url: LINK.twitter,
      },
    });

    this.setJsonLd("faq-schema", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is ${SITE.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${SITE.name} is a free, open-source library of beautifully crafted animated Angular icons built with CSS animations and based on Heroicons.`,
          },
        },
        {
          "@type": "Question",
          name: `How do I install ${SITE.name} icons?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can install the package with your preferred package manager and import icons directly in your Angular components.",
          },
        },
        {
          "@type": "Question",
          name: `Is ${SITE.name} free to use?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Yes. ${SITE.name} is open-source under the MIT license and can be used for personal and commercial projects.`,
          },
        },
        {
          "@type": "Question",
          name: `What technologies are used in ${SITE.name}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${SITE.name} icons are Angular components written in TypeScript. Animations are powered by CSS, and the icons are based on Heroicons.`,
          },
        },
      ],
    });
  }

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
        "css animation icon",
        `${icon.name} animation`,
        `${icon.name} angular`,
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
      codeRepository: LINK.github,
      programmingLanguage: ["TypeScript", "Angular"],
      license: LINK.license,
      isPartOf: {
        "@type": "SoftwareSourceCode",
        name: SITE.name,
        url: siteUrl,
      },
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

    const host = this.request?.headers.host;
    if (host) {
      const forwardedProto = this.request?.headers["x-forwarded-proto"];
      const protocolHeader = Array.isArray(forwardedProto)
        ? (forwardedProto[0] ?? "http")
        : (forwardedProto ?? "http");
      const protocol = protocolHeader.split(",")[0]?.trim() || "http";
      return `${protocol}://${host}`;
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
