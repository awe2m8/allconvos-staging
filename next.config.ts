import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/go",
        destination: process.env.GO_REDIRECT_DESTINATION ?? "https://www.allconvos.ai/",
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'microphone=*, camera=*, autoplay=*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
