/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['jsdom', '@exodus/bytes', 'html-encoding-sniffer', 'isomorphic-dompurify'],
};

export default nextConfig;
