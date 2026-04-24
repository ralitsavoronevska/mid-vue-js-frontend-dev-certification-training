import pluginVue from "eslint-plugin-vue";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import js from "@eslint/js";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"],
  },
  ...pluginVue.configs["flat/essential"],
  js.configs.recommended,
  skipFormatting,
];


