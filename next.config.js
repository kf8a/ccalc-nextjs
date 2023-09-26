/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is required to get images from the local file system,
  // but needs to be disabled for vercel deployment
  // output: "export",
  // images: {
  //   loader: "custom",
  //   loaderFile: "./local-loader.ts",
  // },
};

module.exports = nextConfig;
