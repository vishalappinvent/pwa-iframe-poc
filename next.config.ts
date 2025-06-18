import withPWA from "next-pwa";
// @ts-ignore
import runtimeCaching from "next-pwa/cache";

const config = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  publicExcludes: ['!robots.txt']
})({
  reactStrictMode: true,
});

export default config;
