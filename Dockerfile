# Use Bun as the base image
FROM oven/bun:1.0

# Create working directory
WORKDIR /app

# Copy package.json files
COPY backend/package.json ./backend/
COPY client/package.json ./client/

# Install dependencies
RUN cd backend && bun install
RUN cd client && bun install

# Copy source files
COPY backend ./backend
COPY client ./client

# Build frontend
RUN cd client && bun run build

# Create necessary directories
RUN mkdir -p backend/public backend/uploads

# Copy built frontend files to backend public directory
RUN cp -r client/dist/* backend/public/

# Set permissions
RUN chmod -R 755 backend/public

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "backend/server.js"]
