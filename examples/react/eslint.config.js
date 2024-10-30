import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals';
import tseslint from 'typescript-eslint'

import globalConfig from '../../eslint.config.js'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [...globalConfig],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: { react: { version: '18.3' } },
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
    },
  },
)
