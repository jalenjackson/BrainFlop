const { PHASE_PRODUCTION_SERVER } =
  process.env.NODE_ENV === 'development'
    ? {}
    : !process.env.NOW_REGION
    ? require('next/constants')
    : require('next-server/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_PRODUCTION_SERVER) {
    // Config used to run in production.
    return {};
  }

  const sass = require("@zeit/next-sass");
  const images = require("next-images");
  require("dotenv").config();
  const path = require("path");
  const Dotenv = require("dotenv-webpack");
  const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
  const {
    WebpackBundleSizeAnalyzerPlugin
  } = require("webpack-bundle-size-analyzer");
  const withTM = require("next-plugin-transpile-modules");
  const { ANALYZE } = process.env;

  return withBundleAnalyzer(
    images(
      sass(
        withTM({
          analyzeServer: ["server", "both"].includes(
            process.env.BUNDLE_ANALYZE
          ),
          analyzeBrowser: ["browser", "both"].includes(
            process.env.BUNDLE_ANALYZE
          ),
          bundleAnalyzerConfig: {
            server: {
              analyzerMode: "static",
              reportFilename: "../bundles/server.html"
            },
            browser: {
              analyzerMode: "static",
              reportFilename: "./bundles/client.html"
            }
          },
          transpileModules: ["lodash-es", "gsap"],
          webpack: config => {
            config.plugins = config.plugins || [];
            config.plugins = [
              ...config.plugins,
              new Dotenv({
                path: path.join(__dirname, ".env"),
                systemvars: true
              })
            ];
            if (ANALYZE) {
              config.plugins.push(
                new WebpackBundleSizeAnalyzerPlugin("stats.txt")
              );
            }
            config.externals = Array.isArray(config.externals)
              ? config.externals.map(fn =>
                typeof fn === "function"
                  ? (context, request, callback) => {
                    if (request === "lodash-es") {
                      return callback(null, "commonjs lodash");
                    }
                    return fn(context, request, callback);
                  }
                  : fn
              )
              : config.externals;
            return config;
          }
        })
      )
    )
  );
};