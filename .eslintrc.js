module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // or 'off' if you want to disable completely
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off'
  }
} 