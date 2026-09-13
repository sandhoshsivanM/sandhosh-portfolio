// eslint-config-next 16 ships a native flat config. Routing it through
// FlatCompat (as the generated config did) throws "Converting circular
// structure to JSON" before any file is linted.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];

export default eslintConfig;
