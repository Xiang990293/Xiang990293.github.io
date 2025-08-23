const path = require('path');

module.exports = {
    mode: 'development', // 或 'production'
    entry: './src/entry.js', // 你的 React 組件入口
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'react-widget.bundle.js',
        library: {
            name: 'ReactWidget',
            type: 'umd',
            export: 'default',  // 這行確保匯出 default export
        },
        globalObject: 'this',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    }
};
