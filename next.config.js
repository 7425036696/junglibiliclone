/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.quicksell.co', 'wbrarrlvvmvkxxzreaii.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true, // ❗ TypeScript errors will be ignored during build
  },
};

module.exports = nextConfig;
