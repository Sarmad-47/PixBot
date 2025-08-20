import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // For handling images from Cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
