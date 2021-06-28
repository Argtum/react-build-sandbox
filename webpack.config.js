const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const miniCssExtractPlugin = require(`mini-css-extract-plugin`)

module.exports = (env, argv) => {
    console.log(argv)

    const {mode = "development"} = argv;
    const isProd = mode === "production";

    const getStyleLoaders = () => {
        return [
            isProd ? miniCssExtractPlugin.loader: `style-loader`,
            `css-loader`
        ]
    }

    const getPlugins = () => {
        const plugins = [
            new HtmlWebpackPlugin({
                title: `Build Sandbox`,
                buildTime: new Date().toString(),
                template: `public/index.html`
            })
        ];

        if (isProd) {
            plugins.push(new miniCssExtractPlugin({
                filename: `main-[hash:8].css`
            }))
        }

        return plugins;
    }

    return {
        mode: isProd ? "production" : "development",
        output: {
            filename: isProd ? `main-[hash:8].js` : undefined
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: `babel-loader`
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    use: [
                        {
                            loader: `file-loader`,
                            options: {
                                outputPath: `images`,
                                name: `[name]-[sha1:hash:7].[ext]`
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2)$/,
                    use: [
                        {
                            loader: `file-loader`,
                            options: {
                                outputPath: `fonts`,
                                name: `[name].[ext]`
                            }
                        }
                    ]
                },
                {
                    test: /\.(css)$/,
                    use: getStyleLoaders()
                },
                {
                    test: /\.(s[ca]ss)$/,
                    use: [...getStyleLoaders(), 'sass-loader']
                }
            ]
        },
        plugins: getPlugins(),
        devServer: {
            open: true
        }
    }
};
