import type { Metadata } from "next";

export const SITE_NAME = "influxa";

export const DEFAULT_DESCRIPTION =
  "Run TikTok Shop affiliate programs from one place—discover creators, manage campaigns, samples, and outreach with influxa.";

function resolveMetadataBase(): URL {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://portal.dealhoper.com");
  const withProtocol = raw.startsWith("http") ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol.replace(/\/$/, ""));
  } catch {
    return new URL("https://portal.dealhoper.com");
  }
}

export const rootMetadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
  },
};

export type PageMetadataOptions = {
  title: string;
  description: string;
  noIndex?: boolean;
};

/** Per-route title and description; merges with root title template and OG/Twitter fields. */
export function pageMetadata({
  title,
  description,
  noIndex,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : undefined),
    openGraph: {
      title,
      description,
    },
    twitter: {
      title,
      description,
    },
  };
}
