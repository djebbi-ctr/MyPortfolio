import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/asset";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return [{ url: `${base}/`, lastModified: new Date() }];
}
