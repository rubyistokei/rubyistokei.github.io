/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  webpack: (config, { webpack, buildId, isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_PUBLIC_BUILD_ID": JSON.stringify(buildId),
      })
    );
    return config;
  },
};

module.exports = nextConfig;
