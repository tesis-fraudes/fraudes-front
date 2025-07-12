import type { NextConfig } from "next";

const isGithubActions = false // process.env.GITHUB_ACTIONS === "true";
const repo = "fraudes-front"; // nombre de tu repo

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubActions ? `/${repo}` : "",
  assetPrefix: isGithubActions ? `/${repo}/` : "",
};

export default nextConfig;
