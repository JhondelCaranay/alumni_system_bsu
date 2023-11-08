import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
       "utf-8-validate" : "commonjs utf-8-validate",
       bufferutil:"commonjs bufferutil"
   })
   return config
},
  images: {
    domains: ["avatars.githubusercontent.com", "cloudflare-ipfs.com", "flowbite.com"],
  },
};

// module.exports = nextConfig;
export default nextConfig;
