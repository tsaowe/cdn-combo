FROM node:latest

# Create app directory
WORKDIR /app/cdn-combo

# copy
COPY . /app/cdn-combo

# Install dependencies
RUN yarn install

# Build the app
RUN npm run build

# Expose port 4000
EXPOSE 4000

# Start the app, node /app/cdn-combo/server/server-index.js
CMD [ "npm", "start" ]
