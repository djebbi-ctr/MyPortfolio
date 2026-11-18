import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/asset";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl + (process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${base}/sitemap.xml` };
}
