import { defineEventHandler, setHeader } from "h3";
import { SITE } from "../../app/site.constants";

const ROBOTS_LINES = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${SITE.url}/sitemap.xml`,
] as const;

export default defineEventHandler((event) => {
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=0, s-maxage=3600");

  return ROBOTS_LINES.join("\n");
});
