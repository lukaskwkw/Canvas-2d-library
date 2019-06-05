module.exports = {
  resolve: {
    extensions: ["*", ".ts", ".tsx"]
  },
  // externals: {
  //   react: {
  //     root: "React",
  //     commonjs2: "react",
  //     commonjs: "react",
  //     amd: "react"
  //   },
  //   "react-dom": {
  //     root: "ReactDOM",
  //     commonjs2: "react-dom",
  //     commonjs: "react-dom",
  //     amd: "react-dom"
  //   }
  // },
  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          // {
          //   loader: "babel-loader",
          //   query: {
          //     // presets: ["react", "es2015", "stage-0"],
          //     plugins: [
          //       "transform-react-pug",
          //       "babel-plugin-styled-components",
          //       "@babel/transform-react-jsx"
          //     ]
          //   }
          // },
          {
            loader: "ts-loader"
          }
        ]
      },
      // { test: /\.(tsx?|jsx?)$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  }
};
