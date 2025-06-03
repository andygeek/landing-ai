// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desactiva errores de ESLint en el build de Next.js:
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Con esto, Next.js no fallará la compilación en producción
    // aunque existan errores de tipo en tu código.
    ignoreBuildErrors: true,
  },

  // Si tienes otras opciones de Next, agrégalas aquí…
  // reactStrictMode: true,
  // swcMinify: true,
};

export default nextConfig;