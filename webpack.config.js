//@ts-check

"use strict";

const path = require("path");

/**@type {import("webpack").Configuration}*/
const config =
{
    target: "node",

    entry: "./src/extension.ts",
    output: {
        // the bundle is stored in the "dist" folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
        path: path.resolve(__dirname, "out"),
        filename: "extension.js",
        libraryTarget: "commonjs2",
        devtoolModuleFilenameTemplate: "../[resource-path]"
    },
    devtool: "source-map",
    externals: {
        // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed
        // https://webpack.js.org/configuration/externals/
        vscode: "commonjs vscode"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    }
};
module.exports = config;
