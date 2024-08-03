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
        // 100: 매우 연한 배경색이나 hover 효과, 500: 기본 버튼 색상, 주요 요소 강조색, 700: 버튼의 hover 상태나 더 강한 강조
        primary: {
          100: "#E6F0FF",
          500: "#3B82F6",
          700: "#1D4ED8",
        },
        // secondary: 보조 색상, 텍스트나 배경
        // 100: 매우 연한 배경색이나 구분선, 500: 부제목이나 덜 중요한 텍스트, 700: 주요 텍스트 색상
        secondary: {
          100: "#F3F4F6",
          500: "#6B7280",
          700: "#374151",
        },
        // accent: 특별히 강조하고 싶은 요소에 사용
        // 500: 성공 메시지 등 긍정적인 상태, 700: accent-500의 hover 상태나 더 강한 강조
        accent: {
          500: "#10B981",
          700: "#047857",
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
