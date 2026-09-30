import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto: existe um package-lock.json solto no diretorio pai
  // (D:\OtochLabs\Sites) que o Turbopack tentava adotar como raiz.
  turbopack: { root: path.resolve(import.meta.dirname) },

};

export default nextConfig;
