const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.s?css$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: __dirname + "/src/assets/index.html"
    })
  ]
};
