module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
        'plugin:solid/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: [
        '@typescript-eslint',
        'solid',
    ],
    globals: {
        '__static': 'readonly',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.cjs',
                    '.mjs',
                    '.js',
                    '.jsx',
                    '.json',
                    '.ts',
                    '.tsx',
                    '.d.ts',
                ],
            },
        },
    },
    ignorePatterns: [
        'dist/**',
    ],
    rules: {
        // Ideally this should be "warn", but there are a lot of process.env statements that don't use dot notation.
        'dot-notation': 'off',
        // No limit to class definitions per file
        'max-classes-per-file': 'off',
        // Allow assigning params
        'no-param-reassign': 'off',
        // Allow for .. of .. statements
        'no-restricted-syntax': [
            'error',
            {
                'selector': 'ForInStatement',
                'message':
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            // {
            //     "selector": "ForOfStatement",
            //     "message": "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
            // },
            {
                'selector': 'LabeledStatement',
                'message':
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                'selector': 'WithStatement',
                'message':
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        // Change from error to warn
        'no-underscore-dangle': 'warn',
        // Allow unused args starting with _
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                'argsIgnorePattern': '^_',
            },
        ],
        // Allow functions in any order
        '@typescript-eslint/no-use-before-define': [
            'error',
            {
                'functions': false,
                'classes': true,
                'variables': true,
                'allowNamedExports': false,
                'enums': true,
                'typedefs': true,
                'ignoreTypeReferences': true,
            },
        ],
        // What's most aesthetic here will differ from case to case, so disable for now. Default: error
        'prefer-destructuring': 'off',
        // What's most aesthetic here will differ from case to case, so disable for now. Default: error
        'prefer-template': 'off',
    },
};
