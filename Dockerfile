# Stage 1: Build Angular App
FROM node:lts as build
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Angular app in production mode
RUN ng build --configuration=production

# Stage 2: Serve Angular App with NGINX
FROM nginx:latest

# Copy the build output to Nginx
COPY --from=build /app/dist/paintings-app /usr/share/nginx/html

# Copy the config.json template (with placeholder)
COPY src/assets/config/config.json /usr/share/nginx/html/assets/config.json.template

# Copy nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Replace ENV_API_URL in the config.json using envsubst when the container starts
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/assets/config.json.template > /usr/share/nginx/html/assets/config.json && nginx -g 'daemon off;'"]

EXPOSE 80
