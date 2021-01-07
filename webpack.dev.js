const path = require('path');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'docs'),
    library: 'app',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
    ],
  },
  resolve: {
    fallback: {
      "path": false,
      "util": false,
      "fs": false,
    }
  }
};