const {shareAll} = require('@angular-architects/module-federation/webpack');
let ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
  output: {
    uniqueName: "angular",
    publicPath: "auto",
  },
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        ...shareAll({singleton: true, strictVersion: true, requiredVersion: 'auto'}),
      },
    })
  ]
};
