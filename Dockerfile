# -------------------------------------------------------
# 1. Etapa de construcción ("builder")
# -------------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos sólo el package.json (y lockfile, si tuvieras) para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiamos todo el código fuente y ejecutamos el build de Next.js
COPY . .
RUN npm run build

# -------------------------------------------------------
# 2. Etapa de producción ("runner")
# -------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

# Fijamos NODE_ENV en producción
ENV NODE_ENV=production
# Indicamos el puerto que va a usar Next
ENV PORT=7860

# Copiamos package.json (y lockfile) para poder reinstalar solo dependencias de producción
COPY --from=builder /app/package*.json ./
# Instalamos únicamente las dependencias necesarias en producción
RUN npm install --production

# Copiamos la carpeta de build (.next), la carpeta public (assets estáticos) 
# y demás archivos de configuración que Next necesita en runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Exponemos el puerto para Hugging Face (mismo que pusimos en README.md)
EXPOSE 7860

# Arrancamos la app con "next start"
CMD ["npm", "run", "start"]
