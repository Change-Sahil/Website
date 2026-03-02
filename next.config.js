// next.config.js
const withNextIntl = require("next-intl/plugin")("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // .com -> englische Startseite auf .de
      {
        source: "/",
        has: [{ type: "host", value: "change-werkstatt-sahil.com" }],
        destination: "https://change-werkstatt-sahil.de/en",
        permanent: true, // 308
      },
      // optional: www.com -> englische Startseite auf .de
      {
        source: "/",
        has: [{ type: "host", value: "www.change-werkstatt-sahil.com" }],
        destination: "https://change-werkstatt-sahil.de/en",
        permanent: true, // 308
      },
      // optional: alle Unterpfade auf .com ebenfalls nach .de spiegeln (empfohlen)
      {
        source: "/:path*",
        has: [{ type: "host", value: "change-werkstatt-sahil.com" }],
        destination: "https://change-werkstatt-sahil.de/en/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.change-werkstatt-sahil.com" }],
        destination: "https://change-werkstatt-sahil.de/en/:path*",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);