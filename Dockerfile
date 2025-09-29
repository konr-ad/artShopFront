# Stage 1: build Angular
FROM node:lts AS build
WORKDIR /app
RUN npm install -g @angular/cli

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
# produkcyjny build (zmień nazwę projektu, jeśli inna niż 'paintings-app')
RUN ng build --configuration=production

# Stage 2: NGINX
FROM nginx:latest

# Skopiuj ZAWARTOŚĆ katalogu 'browser' do katalogu serwowanego przez nginx
COPY --from=build /app/dist/paintings-app/browser/ /usr/share/nginx/html/

# Template konfigu: używamy zmiennych środowiskowych
# UWAGA: zmień zawartość src/assets/config/config.json jak niżej w sekcji 2)
COPY src/assets/config/config.json /usr/share/nginx/html/assets/config/config.json.template

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Start: podstaw ENV w template i odpal Nginx
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/config/config.json.template > /usr/share/nginx/html/assets/config/config.json && exec nginx -g 'daemon off;'"]

EXPOSE 80
