module.exports = {
  extends: ['plugin:prettier/recommended', 'prettier', 'next', 'next/core-web-vitals'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    semi: ['error', 'never'],
    'prettier/prettier': [
      1,
      {
        singleQuote: true,
        trailingComma: 'all',
        tabWidth: 2,
        semi: false,
        importOrder: [
          '^react$',
          '^next$',
          '~/components/(.*)$',
          '~/container/(.*)$',
          '~/common/(.*)$',
          '~/utils/(.*)$',
          '^model/(.*)$',
          '^[a-z\\-/]*$',
          '^[./]',
        ],
        importOrderSeparation: true,
        importOrderSortSpecifiers: true,
        printWidth: 100,
        bracketSpacing: true,
        arrowParens: 'always',
        endOfLine: 'lf',
      },
    ],
  },
}