import path from 'path';
import { Configuration } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import cssnano from 'cssnano';
import dotenv from 'dotenv';

dotenv.config();

const IS_DEV = process.env['IS_DEV'];
const plugins = [new WebpackManifestPlugin({})];

// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
// plugins.push(new BundleAnalyzerPlugin());

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const targets = IS_DEV ? { chrome: '79', firefox: '72' } : '> 0.25%, not dead';

const config: Configuration = {
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'inline-source-map' : false,
    entry: {
        main: './src/client/client',
        worker: './src/client/serviceworker',
    },
    output: {
        path: path.join(__dirname, 'dist', 'statics'),
        filename: `[name]-bundle.js`,
        chunkFilename: '[name]-[chunkhash]-bundle.js',
        publicPath: '/statics/',
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    optimization: {
        minimize: !IS_DEV,
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    priority: 10,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, nodeModulesPath],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/env', { modules: false, targets }],
                            '@babel/react',
                            '@babel/typescript',
                        ],
                        plugins: [
                            '@babel/proposal-numeric-separator',
                            '@babel/plugin-transform-runtime',
                            [
                                '@babel/plugin-proposal-decorators',
                                { legacy: true },
                            ],
                            ['@babel/plugin-proposal-class-properties'],
                            '@babel/plugin-proposal-object-rest-spread',
                        ],
                    },
                },
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localsConvention: 'camelCase',
                            sourceMap: IS_DEV,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: IS_DEV,
                            plugins: IS_DEV ? [cssnano()] : [],
                        },
                    },
                ],
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
                use: 'url-loader?limit=10000',
            },
        ],
    },
    plugins,
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
};

export default config;
