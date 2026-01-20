import nextra from 'nextra'

const withNextra = nextra({
  theme: './theme',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',        // static export for Pagefind
  images: { unoptimized: true }
}

export default withNextra(config)
