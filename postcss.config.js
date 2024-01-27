/* eslint-disable no-undef */
// postcss.config.js
module.exports = {
  plugins: {
    // config location, defaullt is tailwind.config.js,here must indicate the file name
    tailwindcss: { config: './tailwind.config.ts' },
    autoprefixer: {},
    cssnano: {},
    // nest css
    'tailwindcss/nesting': 'postcss-nesting',
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
    // optimizing for production, compres css
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
