module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        "airbnb",
        "airbnb/hooks",
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"],
        tsconfigRootDir: __dirname,
    },
    plugins: ["react-refresh"],
    rules: {
        "react-refresh/only-export-components": [
            "warn",
            {allowConstantExport: true},
        ],
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": ["warn", {extensions: [".tsx"]}],
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": ["error", {devDependencies: true}],
        "react/jsx-no-bind": "off",
        "react/no-array-index-key": "off",
        "react/prop-types": "off",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                "": "never",
                "js": "never",
                "jsx": "never",
                "ts": "never",
                "tsx": "never",
            },
        ],
        "import/no-absolute-path": "off",
    },
};
