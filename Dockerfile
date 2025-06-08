FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install server dependencies
WORKDIR /app/backend
RUN npm install

# Install client dependencies and build
WORKDIR /app/client
RUN npm install && npm run build

# If using a Node server:
WORKDIR /app
CMD ["node", "backend/server.js"]
