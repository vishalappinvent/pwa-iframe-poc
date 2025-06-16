import withPWA from "next-pwa";
// @ts-ignore
import runtimeCaching from "next-pwa/cache";

const baseConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  runtimeCaching,
})(baseConfig);
