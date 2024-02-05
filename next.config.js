/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    esmExternals: true,
    externalDir: true,
    moduleDirectories: ["node_modules"],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/manage/school',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
