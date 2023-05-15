/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('../image/background.jpg')",
      }
    },
  },
  plugins: [],
}
