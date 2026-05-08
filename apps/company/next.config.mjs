/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@platform/config"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
