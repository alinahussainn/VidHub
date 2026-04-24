import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  // next.config.js

  images :{
    remotePatterns: [
      
      {
        protocol: "https",
        hostname: "utfs.io",
        },
    ],
  },

};

export default nextConfig;
