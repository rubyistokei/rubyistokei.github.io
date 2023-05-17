/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      height: {
        'screen': [
          '100vh', '100dvh'
        ]
      },
      minHeight: {
        'screen': [
          '100vh', '100dvh'
        ]
      },
      maxHeight: {
        'screen': [
          '100vh', '100dvh'
        ]
      }
    },
  },
  plugins: [],
}
