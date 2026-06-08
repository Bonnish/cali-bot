# Etapa 1: Construcción (Build)
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine

# Copiar configuración de Nginx para Single Page Applications
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados de React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
