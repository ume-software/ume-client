module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    domains: ['www.ume.software'],
  },
}
