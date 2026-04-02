/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#0e1322',
        'surface-container-low': '#161b2b',
        'surface-container-high': '#25293a',
        'surface-container-highest': '#2f3445',
        'surface-bright': '#343949',
        'surface-lowest': '#090e1c',
        'primary': '#b4c5ff',
        'primary-container': '#2563eb',
        'secondary': '#c6c6c6',
        'outline-variant': '#434655'
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Manrope', 'sans-serif']
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #b4c5ff 0%, #2563eb 100%)',
      },
      boxShadow: {
        'glow': '0 12px 40px rgba(222, 225, 247, 0.04)',
      }
    },
  },
  plugins: [],
}
