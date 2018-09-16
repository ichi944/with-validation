module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: ["./src/app.js"],
  output: {
    filename: "app.js",
    path: __dirname + "/public/js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  }
};
