require('es6-promise').polyfill();
var path = require('path');
var webpack = require('webpack');
var join = path.join.bind(path, __dirname);
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
module.exports = {
    devServer: {
        noInfo: true,
        hot: true,
        inline: true,
        contentBase: join('public'),
        publicPath: '/',
        port: 8084
    },
    devtool: '#inline-source-map',
    entry: {
        app: './public/app.jsx'
    },
	output:{
        path:join('.build'),
        filename: 'app.[hash].js'
    },
	target:"web",
    stats: {
        colors: true,
        reasons: true
    },
    module: {
        loaders: [
            {
                test: /\.js(x)?$/,
                exclude:/node_modules\/(?!(component-playground|subschema-test-support))/,
                loader: 'babel'
            },
            {test: /\.(png|jpe?g|mpe?g|gif)$/, loader: 'url-loader?limit=100000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.css$/,
                // loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loaders: ['style','css','less']
            },
            {
                test:/\.json$/,
                loader:'json'
            }
        ]
    },

    postcss: [
        require('autoprefixer'),
        require('postcss-color-rebeccapurple')
    ],
    resolve: {
        extensions:['','.jsx','.js'],
        alias: {
            'subschema': join('src/index.jsx'),
            'Subschema': join('src'),
            'subschema-styles':join('src/styles'),
            'component-playground':join('node_modules/component-playground/src'),
            'babel-core/browser':join('babel-standalone'),
            'babel/polyfill':join('src/null.js')
        }
    },

    plugins: [
        new webpack.ProvidePlugin({
            CodeMirror: "codemirror",
            "window.CodeMirror": "codemirror"
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        function () {
            this.plugin("done", function (stats) {
                stats = stats.toJson();
                console.error(JSON.stringify({
                    assetsByChunkName: stats.assetsByChunkName
                }));
            });
        }
    ]

};

