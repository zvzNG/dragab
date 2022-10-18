const fs = require('fs');
const fs_promises = fs.promises;
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveConsolePlugin = require('remove-console-webpack-plugin');

const __MODE__ = process.env.NODE_ENV || 'development';
const __TARGET__ = process.env.BROWSERSLIST_ENV || 'modern';

const isOld = __TARGET__ === 'old';
const isDev = __MODE__ === 'development';
const isWath = __MODE__ === 'watch';

const getFullPath = (filepath) => path.resolve(__dirname, filepath);

const getFilename = (ext) =>
  `frontend_dist/${__TARGET__}/${isDev ? '[name]' : '[name].[contenthash]'}.${ext}`;

const getFolderFiles = (folder, extension, isFolder = false) =>
  fs
    .readdirSync(path.resolve(__dirname, folder))
    // removing junk files
    .filter((item) => item.split('.')[1] === extension)
    .map((item) => ({
      file: item,
      name: item.split('.')[0],
      ext: item.split('.')[1],
    }));

const entryPoints = () => {
  const res = {
    Default: ['./pages/Default.js'], // default if entry wasn't found
  };

  getFolderFiles('./src/scss/promo/', 'scss').forEach(
    (item) =>
      (res[item.name] = ['./pages/Default.js', `./scss/promo/${item.file}`])
  );

  getFolderFiles('./src/pages', 'js').forEach(
    (item) => (res[item.name] = [`./pages/${item.file}`])
  );

  return res;
};

const jsLoaders = () => {
  const getBabelSettings = () => {
    const settings = {};

    if (isOld) {
      settings.useBuiltIns = 'usage';
      settings.corejs = 3;
    }

    return settings;
  };

  const loaders = [
    {
      loader: 'babel-loader',
      query: {
        presets: [['@babel/preset-env', getBabelSettings()]],
        plugins: [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-class-properties',
        ],
      },
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const cssLoaders = () => [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: isDev,
      reloadAll: true,
    },
  },
  'css-loader',
  'sass-loader',
];

const htmlFiles = () => {
  const pages = [];
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  getFolderFiles('./src/assets/pages', 'html').forEach((item) => {
    pages.push(
      new HTMLWebpackPlugin({
        template: `./assets/pages/${item.file}`,
        filename: item.file === 'Homepage.html' ? 'index.html' : item.file,
        chunks: [item.name],
      })
    );
    
    console.log(item);
  });

  return pages;
};

const plugins = () => {
  const plgs = [
    new MiniCssExtractPlugin({
      filename: getFilename('css'),
    }),
    new webpack.DefinePlugin({
      isDev: JSON.stringify(isDev),
      isProd: JSON.stringify(!isDev),
      isOld: JSON.stringify(isOld),
      isModern: JSON.stringify(!isOld),
    }),
  ];

  // if (__MODE__ == 'production')
  //   plgs.push(new RemoveConsolePlugin({ include: ['log'] }));

  if (isWath) {
    plgs.push(...htmlFiles());
  } else {
    //  Генерация файлов для подключения JS-ок и CSS-ок бекенду
    const WebpackAssetsManifest = require('webpack-assets-manifest');
    const my_homies = 'nibbas';

    plgs.push(
      new WebpackAssetsManifest({
        entrypoints: true,
        publicPath: true,
        output: `frontend_dist/${__TARGET__}--manifest.json`,
        entrypointsKey: my_homies,
        transform(assets, manifest) {
          return assets[my_homies];
        },
      })
    );
  }

  if (process.env.analyze) {
    const BundleAnalyzerPlugin =
      require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    plgs.push(new BundleAnalyzerPlugin());
  }
  return plgs;
};

// if (!isOld) {
if (__TARGET__ == 'modern') {
  fs_promises.rm('../frontend_dist/modern', { recursive: true }).then(() => {
    console.log('/frontend_dist/modern removed!');
    fs_promises.mkdir('../frontend_dist/modern');
  });
}

if (__TARGET__ == 'old') {
  fs_promises.rm('../frontend_dist/old', { recursive: true }).then(() => {
    console.log('/frontend_dist/old removed!');
    fs_promises.mkdir('../frontend_dist/old');
  });
}

// }

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: __MODE__,
  entry: entryPoints(),
  output: {
    filename: getFilename('js'),
    chunkFilename: getFilename('js'),
    path: getFullPath('../'),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      '@icons': path.join(__dirname, '../icons'),
    },
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     maxInitialRequests: 2,
  //     minSize: 1000,
  //     cacheGroups: {
  //       vendors: {
  //         reuseExistingChunk: true,
  //       },
  //     },
  //   },
  // },
  // devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3196,
    open: false,
    contentBase: '../frontend_dist/',
  },
  plugins: plugins(),
  module: {
    rules: [
      {
        test: /\.s[a,c]ss$/i,
        use: cssLoaders(),
      },
      {
        test: /\.svg/i,
        use: {
          loader: 'svg-url-loader',
          options: { iesafe: true },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
