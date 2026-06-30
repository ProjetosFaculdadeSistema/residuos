/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin')
  ],
  daisyui: {
    themes: [
      {
        eco: {
          "primary":          "#2E7D32",
          "primary-content":  "#ffffff",
          "secondary":        "#66BB6A",
          "secondary-content":"#1a2e1a",
          "accent":           "#558B2F",
          "accent-content":   "#ffffff",
          "neutral":          "#374151",
          "neutral-content":  "#f3f4f6",
          "base-100":         "#f8faf8",
          "base-200":         "#eef4ee",
          "base-300":         "#d4e9d4",
          "base-content":     "#1a2e1a",
          "info":             "#0ea5e9",
          "info-content":     "#ffffff",
          "success":          "#16a34a",
          "success-content":  "#ffffff",
          "warning":          "#d97706",
          "warning-content":  "#ffffff",
          "error":            "#dc2626",
          "error-content":    "#ffffff",
        }
      }
    ]
  }
}
