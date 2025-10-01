module.exports = {
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react-refresh'],
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {

    },
};