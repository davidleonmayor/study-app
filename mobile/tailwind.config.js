/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",         // Archivos dentro de la carpeta "app"
    "./components/**/*.{js,jsx,ts,tsx}",  // Archivos dentro de "components"
    "./presentation/**/*.{js,jsx,ts,tsx}" // Archivos dentro de "presentation"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#A3E635",
        primaryDark: "#7AAC28",     
        secondary: "#BEF264",   
        tertiary: "#1F2937",    
        quaternary: "#E5FFB8",  
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
}