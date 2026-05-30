/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.cloudjoi.com' },
      { protocol: 'https', hostname: 'gbdexuevrfozsbrblrub.supabase.co' },
      { protocol: 'https', hostname: 'images.sk-static.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google profile photos
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'enc.asia' },
    ],
  },
}

module.exports = nextConfig
