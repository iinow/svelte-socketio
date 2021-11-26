module.exports = {
  purge: {
    content: ['./index.html', './src/**/*.{svelte, js, ts}'],
    enabled: true,
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
}
