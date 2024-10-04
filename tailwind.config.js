/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
      'custom-black': '#000000',
      'custom-white': '#ffffff',
      'custom-green': '#00c058',
      'custom-blue': '#009ec0',
      'custom-light-gray': '#e3e3e3',
      'custom-gray': '#949494',
      'custom-dark-gray': '#515151'
    }
  },
  },
  plugins: [],
}
