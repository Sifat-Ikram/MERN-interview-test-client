/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  options: {
    safelist: ["btn"], // Whitelist classes you want to retain
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
