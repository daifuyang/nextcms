/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [
        path.join(__dirname, "styles"), 
        path.join(__dirname, "node_modules")
    ]
  }
};

module.exports = nextConfig;
