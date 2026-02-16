import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: false,
  workboxOptions: {
    skipWaiting: true,
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /\.(?:mp3|wav|ogg)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-audio-assets',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
          rangeRequests: true,
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-image-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // allowedDevOrigins: ['192.168.1.158', 'localhost'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tajbdewemhjktflozork.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  turbopack: {},
};

export default withPWA(nextConfig);
// export default nextConfig;
