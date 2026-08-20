/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev-only: the app is served through a reverse-proxied preview hostname, so
  // Next needs those origins whitelisted or it blocks the HMR/hydration
  // resources and the page never becomes interactive.
  allowedDevOrigins: [
    'localhost',
    '**.emergentagent.com',
    '**.emergentcf.cloud',
    '**.emergent.host',
  ],
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
