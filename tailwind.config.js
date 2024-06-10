import daisyui from "daisyui";

 /**
  * @type {import('tailwindcss').Config}
  */
const config = {
    content: [
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    daisyui: {
        themes: ["night"]
    },
    plugins: [daisyui]
};

export default config;