import { defineEventHandler, setHeader } from "h3";
import { ICON_MANIFEST } from "../../app/icon-manifest";
import { SITE } from "../../app/site.constants";

const ICON_CHANGE_FREQUENCY = "monthly";
const ICON_PRIORITY = "0.7";

const STATIC_PAGES = [
  { path: "", changeFrequency: "weekly", priority: "1.0" },
] as const;

const toAbsoluteUrl = (path: string): string => {
  return path ? `${SITE.url}${path}` : SITE.url;
};

const escapeXml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const createUrlNode = (
  loc: string,
  lastModified: string,
  changeFrequency: string,
  priority: string
): string => {
  return [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    `    <lastmod>${lastModified}</lastmod>`,
    `    <changefreq>${changeFrequency}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
};

export default defineEventHandler((event) => {
  const lastModified = new Date().toISOString();

  const staticEntries = STATIC_PAGES.map((page) =>
    createUrlNode(
      toAbsoluteUrl(page.path),
      lastModified,
      page.changeFrequency,
      page.priority
    )
  );

  const iconEntries = ICON_MANIFEST.map((icon) =>
    createUrlNode(
      `${SITE.url}/icons/${icon.name}`,
      lastModified,
      ICON_CHANGE_FREQUENCY,
      ICON_PRIORITY
    )
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...iconEntries,
    "</urlset>",
  ].join("\n");

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=0, s-maxage=3600");

  return xml;
});
