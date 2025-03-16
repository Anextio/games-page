/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Disable image optimization since GitHub Pages doesn't support it
  images: { unoptimized: true },
  // Ensure GitHub Pages doesn't use Jekyll
  trailingSlash: true,
}

module.exports = nextConfig 