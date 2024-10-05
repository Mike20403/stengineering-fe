module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint-config-prettier"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs','vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  settings: {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      typescript: {}, // Use the TypeScript resolver,
      alias: {
        map: [
          ['./public', '@/', './src']  // <-- this line
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      node: {
        "paths": [
          "src",
        ],
        "extensions": [
          ".js",
          ".jsx",
          ".ts",
          ".tsx"
        ]
      }
    }
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // Defined this if u don't want to keep unused vars
    // 'no-unused-vars': [
    //   "error",
    //   {
    //     "vars": "all",
    //     "args": "after-used",
    //     "ignoreRestSiblings": true,
    //     "argsIgnorePattern": "^_"
    //   }
    // ],
    // "jsx-a11y/anchor-is-valid": [
    //   "error",
    //   {
    //     "components": ["Link"],
    //     "specialLink": ["hrefLeft", "hrefRight"],
    //     "aspects": ["noHref", "invalidHref", "preferButton"]
    //   }
    // ],
    'react/react-in-jsx-scope': "off"
  },
}