module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  printWidth: 120,
  tabWidth: 2,
  semi: false,
  useTabs: false,
  endOfLine: 'auto',
  singleQuote: true,
  importOrder: ['<THIRD_PARTY_MODULES>', '^@(?!(assets|tests))(.*)$', '^@assets/(.*)$', '^@tests/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
