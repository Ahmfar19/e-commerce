module.exports = {
    env: {
        node: true,
        commonjs: true,
    },
    extends: [
        'airbnb-base',
        'prettier',
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: [
        'import',
    ],
    globals: {
        '$': true,
        'require': true,
        'process': true,
    },
    rules: {
        'dot-notation': 'off',
        'max-classes-per-file': 'off',
        'no-param-reassign': 'off',
        'no-restricted-syntax': [
            'error',
            {
                'selector': 'ForInStatement',
                'message':
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                'selector': 'ForOfStatement',
                'message':
                    'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
            },
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
        'no-underscore-dangle': 'warn',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                'argsIgnorePattern': '^_',
            },
        ],
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
        'prefer-destructuring': 'off',
        'prefer-template': 'off',
    },
    ignorePatterns: [
        'dist/**',
    ],
};
