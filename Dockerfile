FROM cdn-combo-image-cache:latest

# Create app directory
WORKDIR /app

# Copy necessary files
COPY server src package.json README.md yarn.lock vite.config.js nginx.conf /app/

# Install dependencies
# RUN yarn install

# Build the app
RUN npm run build

# Install nginx
RUN apt-get update && apt-get install -y nginx

# Remove default nginx config
RUN rm /etc/nginx/sites-enabled/default

# Add custom nginx config
COPY nginx.conf /etc/nginx/sites-enabled/

# Expose port 80
EXPOSE 80

# Start nginx and the app
CMD ["bash", "-c", "node server/server-index.js & nginx -g 'daemon off;'"]
