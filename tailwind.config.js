/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}","./src/**/*.{js,jsx,ts,tsx,html}","./src/**/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: '#333333', // Karbon Siyahı
        secondary: '#4d4d4d', // Koyu Gri
        accent: '#ff7f50', // Mercan
        background: '#f0f0f0', // Açık Gri
      },
    },
  },
  plugins: [],
}

