import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { withSentryConfig } from "@sentry/nextjs";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3031";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  output: "standalone",
  // Monorepo : Next doit savoir où est la racine workspace pour tracer les deps
  outputFileTracingRoot: process.env["NEXT_BUILD_FROM_ROOT"]
    ? undefined
    : `${process.cwd()}/../..`,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
    // CSP : strict en prod, plus permissif en dev (Next.js a besoin de eval pour HMR)
    const isProd = process.env.NODE_ENV === "production";
    const apiOrigin =
      process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3031";

    const cspProd = [
      `default-src 'self'`,
      // Next.js inline scripts hashables — on autorise 'unsafe-inline' faute de mieux
      // (Next 15 ne pose pas encore de nonces partout). Acceptable car repo mono-user privé.
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline'`,
      `img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com`,
      `font-src 'self' data:`,
      `connect-src 'self' ${apiOrigin} https://api.anthropic.com https://api.voyageai.com`,
      `frame-src https://www.youtube.com https://www.youtube-nocookie.com`,
      `worker-src 'self' blob:`,
      `media-src 'self' blob:`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`,
    ].join("; ");

    const cspDev = cspProd.replace(
      "upgrade-insecure-requests",
      "", // on retire upgrade-insecure en local pour pas casser http://
    );

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: isProd ? cspProd : cspDev,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },
};

// On wrappe d'abord avec Sentry (dormant si pas de DSN), puis Serwist par-dessus.
// Si Sentry n'est pas configuré (pas de DSN ni d'auth token), withSentryConfig
// retourne la config telle quelle sans toucher au runtime — donc safe pour la PWA.
const withSentry = (config: NextConfig) =>
  withSentryConfig(config, {
    silent: true,
  });

export default withSerwist(withSentry(nextConfig));
