const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  entry: './src/js/app.ts',
  output: {
    path: __dirname+'/dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: "style-loader!css-loader"},
      { test: /\.tsx?$/, loader: 'ts-loader'}
      // {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query:{presets: ['es2015']}}
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: [
   new UglifyJsPlugin()
 ]
}
