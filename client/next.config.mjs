import mdx from '@next/mdx';
import process from 'process';
const withMDX = mdx();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  experimental: {
    optimizePackageImports: ['react-redux'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withMDX(nextConfig);
