FROM node:latest

# Create app directory
WORKDIR /app/cdn-combo

# copy
COPY . /app/cdn-combo

# cd
WORKDIR /app/cdn-combo

# Install dependencies
RUN yarn install

# Build the app
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the app
CMD ["bash", "-c", "node server/server-index.js &"]
