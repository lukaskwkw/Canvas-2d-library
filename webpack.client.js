const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");

const babelLoaderConfig = require("./webpack.babel-loader");

const PRODUCTION_ENV = process.env.NODE_ENV === "production";

const config = {
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          !PRODUCTION_ENV ? "style-loader" : MiniCssExtractPlugin.loader,
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
    path: __dirname + "/public",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./public"
  },
  optimization: {
    minimizer: PRODUCTION_ENV
      ? [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})]
      : []
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};

module.exports = merge(babelLoaderConfig, config);
