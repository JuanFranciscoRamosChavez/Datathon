// postcss.config.js (EL CORREGIDO)
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- ¡Así debe quedar!
    autoprefixer: {},
  },
};