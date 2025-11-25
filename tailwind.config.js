// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,tsx,ts}",
  ],
  theme: {
    extend: {
      // Aquí agregamos la configuración de la fuente
      fontFamily: {
        geneva: ['Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}