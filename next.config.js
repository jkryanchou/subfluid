const {join} = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
  sassOptions: {
    includePaths: [join(__dirname, 'styles')],
  },
  ...nextConfig
}
