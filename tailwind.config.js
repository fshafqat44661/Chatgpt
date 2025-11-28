/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        backgroundtwo: "var(--backgroundtwo)",
        backgroundthree: "var(--backgroundthree)",
        backgroundfour: "var(--backgroundfour)",
        backgroundfive: "var(--backgroundfive)",
        backgroundsix: "var(--backgroundsix)",
        text: "var(--text)",
        texttwo: "var(--texttwo)",
        texthover: "var(--texthover)",
        border: "var(--border)"
      },
    },
  },
  plugins: [],
}
