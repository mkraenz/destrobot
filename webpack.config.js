const path = require("path");
const pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
const phaser = path.join(pathToPhaser, "dist/phaser.js");

module.exports = {
    entry: [
        "./src/index.ts",
        "./assets/styles/ui.scss",
        // "./assets/styles/another.css",
    ],
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    devtool: "source-map",
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
            { test: /phaser\.js$/, loader: "expose-loader?Phaser" },
            // {
            //     test: /\.css$/,
            //     include: [path.resolve(__dirname, "assets")],
            //     use: ["style-loader", "css-loader"],
            // },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./"),
        publicPath: "/build/",
        host: "localhost",
        port: 8080,
        open: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            phaser: phaser,
        },
    },
};
