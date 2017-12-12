const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const config = {
    entry: ['./src/js/Router.js', './src/css/style.scss'],
    output: {
        filename: './src/dist/bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './src/dist/[name].bundle.css',
            allChunks: true
        })
    ],
    devServer: {
        contentBase: './src/dist'
    }
};

module.exports = config;