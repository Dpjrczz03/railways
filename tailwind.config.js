/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec3237', // Accent color
        primaryHover: '#ff5a5f', // Accent hover
        background: {
          DEFAULT: '#121212', // Primary background
          secondary: '#1e1e1e', // Secondary background
          tertiary: '#252525', // Tertiary background
        },
        text: {
          primary: '#f5f5f5', // Primary text
          secondary: '#c7c7c7', // Secondary text
          muted: '#8a8a8a', // Placeholder or muted text
        },
        border: {
          primary: '#474747', // Primary border color
          highlight: '#ec3237', // Highlighted border color
        },
        button: {
          disabled: '#6e6e6e', // Disabled button state
        },
      },
    },
  },
  plugins: [],
};
