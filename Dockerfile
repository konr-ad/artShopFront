# Use official node image as the base image
FROM node:lts as build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json files from your host to your current location.
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the remaining source code from the host to the container
COPY . .

# Build the Angular app in production mode and output the files in dist directory
RUN ng build --configuration=production

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output from the 'build' stage to replace the default nginx contents
COPY --from=build app/dist/paintings-app /usr/share/nginx/html

# Overwrite the default nginx configuration file with our custom file
COPY nginx.conf /etc/nginx/nginx.conf

# Inform Docker that the container listens on the specified network ports at runtime.
EXPOSE 80

# Command to run when starting the container
CMD ["nginx", "-g", "daemon off;"]
