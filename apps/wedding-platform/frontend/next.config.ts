import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'minio'],
  },
}

export default config
