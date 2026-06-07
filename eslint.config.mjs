import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: ["public/games/**", "src/react-games/**"]
  },
  ...nextVitals,
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];

export default eslintConfig;
