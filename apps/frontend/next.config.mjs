/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${'http://localhost:3001'}/api/:path*`, // send it to your API
      },
    ];
  },
};

export default nextConfig;
