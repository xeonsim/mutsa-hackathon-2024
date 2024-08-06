/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // primary: 주요 강조색
        primary: {
          50: "#F0F7FF",
          100: "#E6F0FF",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        purple: {
          100: "#D4CFEB",
          300: "#9F94D8",
          500: "#6554BB",
          700: "#4A3D8C",
        },
        // secondary: 보조 색상, 텍스트나 배경
        secondary: {
          100: "#F3F4F6",
          300: "#D1D5DB",
          500: "#6B7280",
          700: "#374151",
        },
        // accent: 특별히 강조하고 싶은 요소에 사용 - 초록 계열
        accent: {
          300: "#6EE7B7",
          500: "#10B981",
          700: "#047857",
        },
        // danger: 중요, 경고, 오류 - 붉은 계열
        danger: {
          100: "#FEE2E2",
          300: "#FCA5A5",
          500: "#EF4444",
          700: "#B91C1C",
        },
        login: {
          300: "#98BFF2",
        },
      },
      spacing: {
        // layout: 주요 레이아웃 요소들 사이의 간격을 일관되게 유지하기 위해 사용 (1.5rem = 24px)
        layout: "1.5rem",
      },
      borderRadius: {
        // layout: 모서리를 둥글게 처리할 때 일관된 크기를 유지하기 위해 사용 (0.5rem = 8px)
        layout: "0.5rem",
      },
    },
  },
  plugins: [],
};
