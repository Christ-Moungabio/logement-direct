const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Photos des annonces servies par Supabase Storage (bucket public).
    remotePatterns: supabaseUrl
      ? [
          {
            protocol: supabaseUrl.protocol.replace(":", ""),
            hostname: supabaseUrl.hostname,
            port: supabaseUrl.port,
            pathname: "/storage/v1/object/public/listing-photos/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
};

export default nextConfig;
