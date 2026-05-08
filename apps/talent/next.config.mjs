/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@platform/config"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
