import type { NextConfig } from "next";

const isGithubActions = false; // process.env.GITHUB_ACTIONS === "true";
const repo = "fraudes-front"; // nombre de tu repo

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? `/${repo}` : "",
  assetPrefix: isGithubActions ? `/${repo}/` : "",
  // Excluir archivos de la carpeta old del build
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /old\//,
    });
    return config;
  },
};

export default nextConfig;
