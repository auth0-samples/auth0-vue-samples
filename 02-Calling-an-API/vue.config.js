const webpack = require("webpack");

module.exports = {
  devServer: {
    port: 3000,
    proxy: "http://localhost:3001"
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jquery: "jquery",
        "window.jQuery": "jquery",
        jQuery: "jquery"
      })
    ]
  }
};
