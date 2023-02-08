/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "inner-md": "inset 0 2px 4px 2px rgb(0 0 0 / 0.25)",
      },
      dropShadow: {
        sm: ["0 0.5px 0.5px rgb(0 0 0 / 0.3)"],
        md: ["0 0.6px 0.8px rgb(0 0 0 / 0.5)"],
        lg: ["0 1px 1px rgb(0 0 0 / 0.4)"],
      },
      fontSize: {
        xxs: [".625rem", { lineHeight: "0.875rem", letterSpacing: "-0.02rem" }],
      },
      animation: {
        "placeholder-loading":
          "placeholder-loading 2s cubic-bezier(0.4, 0, 0.6, 1) infinite backwards",
        "spin-reverse": "spin-reverse 1s linear infinite backwards",
        dot: "dot 1000ms ease-in-out infinite backwards",
        "dot-1": "dot 1000ms ease-out infinite backwards",
        "dot-2": "dot 1000ms ease-out 200ms infinite backwards",
        "dot-3": "dot 1000ms ease-out 400ms infinite backwards",
      },
      keyframes: {
        dot: {
          "0%, 100%": { transform: "scale(50%)" },
          "30%": { transform: "scale(140%)" },
          "80%": { transform: "scale(60%)" },
        },
        "spin-reverse": {
          from: {
            transform: "rotate(360deg)",
          },
          to: {
            transform: "rotate(0deg)",
          },
        },
        "placeholder-loading": {
          "0%, 100%": {
            opacity: 0.5,
            transform: "scale(100%)",
          },
          "50%": {
            opacity: 1,
            transform: "scale(105%)",
          },
        },
      },
      // Allow things like min-w-24
      minWidth: ({ theme }) => ({
        ...theme("spacing"),
      }),
      // Allow things like max-w-24
      maxWidth: ({ theme }) => ({
        ...theme("spacing"),
      }),
    },
  },
  plugins: [],
};
