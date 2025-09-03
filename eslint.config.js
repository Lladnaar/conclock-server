import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js, stylistic },
        extends: ["js/recommended"],
    },
    {
        files: ["client/**/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
        rules: {
            indent: ["warn", 4],
            "brace-style": ["warn", "stroustrup", { allowSingleLine: true }],
            "quote-props": ["warn", "as-needed"],
            semi: ["warn", "always"],
            quotes: ["warn", "double"],
            "comma-dangle": ["warn", "always-multiline"],
        },
    },
]);
