// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desactiva errores de ESLint en el build de Next.js:
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Si tienes otras opciones de Next, agrégalas aquí…
  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;