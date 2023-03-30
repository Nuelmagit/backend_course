const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  target: "node",
  devtool: "inline-cheap-module-source-map",
  entry: {
    "adapters/apigateway-entrypoint": "./src/adapters/apigateway-entrypoint.js"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    libraryTarget: "commonjs"
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: { node: "12" },
                  useBuiltIns: "usage",
                  corejs: 3
                }
              ]
            ],
            plugins: ["source-map-support"]
          }
        }
      },
      {
        test: /.node$/,
        use: "node-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        "src/cloud-app-stack.cf.json",
        "src/operations.openapi.yaml"
      ]
    })
  ],
  node: false,
};
