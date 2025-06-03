# -------------------------------------------------------
# 1. Etapa de construcción ("builder")
# -------------------------------------------------------
FROM node:18-alpine AS builder
WORKDIR /app

# 1.1 Instala dependencias
COPY package*.json ./
RUN npm install

# 1.2 Copia todo el código y ejecuta el build de Next.js
COPY . .
RUN npm run build

# -------------------------------------------------------
# 2. Etapa de producción ("runner")
# -------------------------------------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Puerto que definimos en README (app_port: 7860)
ENV PORT=7860

# 2.1 Copia solo package.json para reinstalar deps de producción
COPY --from=builder /app/package*.json ./
RUN npm install --production

# 2.2 Copia la carpeta .next (build “ya compilado”) y public (archivos estáticos)
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# (No copiamos next.config.ts, porque .next ya contiene lo que Next necesita)

# Exponemos el puerto 7860
EXPOSE 7860

# 2.3 Arranca la app en modo producción
CMD ["npm", "run", "start"]
