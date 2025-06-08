# Use Bun as the base image
FROM oven/bun:1.0

# Create working directory
WORKDIR /app

# Copy package files first for better caching
COPY backend/package.json ./backend/
COPY client/package.json ./client/

# Install dependencies
RUN cd backend && bun install
RUN cd client && bun install

# Copy the rest of the files
COPY backend/ ./backend/
COPY client/ ./client/

# Build the frontend
RUN cd client && bun run build

# Expose your app port
EXPOSE 3000

# Start your app
CMD ["bun", "backend/server.js"]
