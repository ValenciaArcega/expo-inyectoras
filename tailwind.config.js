/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        p10: '#f6fbff',
        p50: '#e7f5ff', // lowest
        p100: '#d0ebff',
        p200: '#a5d8ff',
        p300: '#74c0fc',
        p400: '#4dabf7',
        p500: '#339af0', // base
        p600: '#228be6',
        p700: '#1c7ed6',
        p800: '#1971c2',
        p900: '#1864ab', // darkest
        p950: '#14538a',
        p960: '#114673',
        p970: '#0e385c',
        p980: '#0a2a45',
        p990: '#030e17',

        green100: "#D9FDD3",
        green500: "#22c55e",
        green900: "#103529",

        a0: '#fff',
        a10: '#f2f2f7',
        a50: '#e9ecef',
        a100: '#dee2e6',
        a200: '#ced4da',
        a300: '#adb5bd',
        a400: '#868e96',
        a500: '#777',
        a600: '#666',
        a700: '#555',
        a800: '#495057',
        a900: '#343a40',
        a910: '#212529',
        a920: '#202224',
        a930: '#1D1F21',
        a940: '#191B1C',
        a960: '#181818',
        a950: '#121212',
        a970: '#0a0a0a',
        a1: '#000',
      },
    },
  },
  plugins: [],
};