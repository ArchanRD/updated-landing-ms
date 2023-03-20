const withTM = require("next-transpile-modules")(["@ms/clients"]);

module.exports = withTM({
  reactStrictMode: true,
  experimental: {
    nextScriptWorkers: true,
  },
  images: {
    domains: [
      "play.google.com",
      "mission-sustainability-images-prod.s3.amazonaws.com",
      "temp-ms-strapi-cms.s3.amazonaws.com"
    ],
  },
  async rewrites() {
    return [
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },
});
