import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          deepTeal: "#1E566C",
          darkSteelTeal: "#367589",
          mutedBlueTeal: "#5795A7",
          softBlue: "#89B8CA",
          steelBlue: "#1F7DAD",
          deepNavy: "#1C478B",
          darkSidebar: "#173C4B",
          darkSidebarHover: "#1E4B5E",
          darkSidebarActive: "#143340",
        },
        bg: {
          main: "#F4F7F9",
          surface: "#FFFFFF",
          card: "#FFFFFF",
          muted: "#EBF1F5",
          highlight: "#E3EEF3",
        },
        text: {
          primary: "#172B35",
          secondary: "#5D707B",
          muted: "#889CA6",
          inverted: "#F4F7F9",
        },
        border: {
          light: "#D9E3E8",
          subtle: "#E4ECEF",
          strong: "#BDCDD5",
        },
        status: {
          success: "#2E7D5B",
          successBg: "#EBF5F0",
          successBorder: "#B7DEC9",
          warning: "#C07D2B",
          warningBg: "#FEF7EC",
          warningBorder: "#F3DCB7",
          critical: "#B84A39",
          criticalBg: "#FDEEEB",
          criticalBorder: "#F4BEB6",
          info: "#1F7DAD",
          infoBg: "#EEF7FC",
          infoBorder: "#BCE0F3",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        subtle: "0 1px 3px rgba(23, 43, 53, 0.05), 0 1px 2px rgba(23, 43, 53, 0.04)",
        card: "0 2px 6px -1px rgba(23, 43, 53, 0.06), 0 1px 4px -1px rgba(23, 43, 53, 0.04)",
        dropdown: "0 6px 16px -2px rgba(23, 43, 53, 0.12), 0 2px 6px -1px rgba(23, 43, 53, 0.06)",
        modal: "0 12px 32px -4px rgba(23, 43, 53, 0.20), 0 4px 12px -2px rgba(23, 43, 53, 0.10)",
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
