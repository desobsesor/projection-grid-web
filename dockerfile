# Dockerfile
FROM node:18-alpine as build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 4173

# Comando para ejecutar la aplicación
CMD ["npm", "run", "preview"]