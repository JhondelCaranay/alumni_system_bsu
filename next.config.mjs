import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com", "cloudflare-ipfs.com"],
  },
};

// module.exports = nextConfig;
export default nextConfig;
