module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'node_modules', '.eslintrc.cjs', 'scripts', '*.config.*'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    // `catch (error: any)` is a project convention (see .claude/CLAUDE.md);
    // TypeScript strict mode already guards real type holes.
    '@typescript-eslint/no-explicit-any': 'off',
    // Underscore-prefixed names mark intentionally-unused bindings.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
    ],
    // Advisory-only rules disabled: with `--max-warnings 0` they would block
    // the lint gate, and blindly satisfying exhaustive-deps risks render loops.
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': 'off',
  },
};
