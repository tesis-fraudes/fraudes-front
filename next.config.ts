import type { NextConfig } from "next";

const isGithubActions = false; // process.env.GITHUB_ACTIONS === "true";
const repo = "fraudes-front"; // nombre de tu repo

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // Importante para SPA
  basePath: isGithubActions ? `/${repo}` : "",
  assetPrefix: isGithubActions ? `/${repo}/` : "",
  // Excluir archivos de la carpeta old del build
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  // Configuración para SPA
  skipTrailingSlashRedirect: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /old\//,
    });
    return config;
  },
};

export default nextConfig;
