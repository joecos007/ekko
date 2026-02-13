import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // allowedDevOrigins is not supported in experimental for this version, disabling for now or moving if types allow. 
    // Actually, if it's not in types, I might need to cast or ignore, or just remove if it breaks build. 
    // But user asked for it. 
    // Let's try to remove it from experimental and see if it works as top level, 
    // but since I can't check types easily without running tsc, I'll rely on the error message.
    // The error said it's NOT in experimental.
    // Let's try commenting it out for a second to fix build, OR just suppress it if I can't find the right place.
    // Better yet, I'll comment it out with a note, or try checking if it's valid top level.
    // Given the user prompt specifically asked to fix it and showed it top level, I will try top level.
  },

  allowedDevOrigins: ['192.168.1.158', 'localhost'],
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
};

export default nextConfig;
