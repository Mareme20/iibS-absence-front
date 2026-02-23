# Étape 1 : Build de l'application
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build --configuration=production

# Étape 2 : Serveur Nginx pour servir le contenu statique
FROM nginx:alpine
COPY --from=build /app/dist/iibs-absence-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
