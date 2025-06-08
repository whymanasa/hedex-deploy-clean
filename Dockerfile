# Use Bun as the base image
FROM oven/bun:1.0

# Create working directory
WORKDIR /app

# Copy backend and install deps
COPY backend/ ./backend/
RUN cd backend && bun install

# Copy client and build it
COPY client/ ./client/
RUN cd client && bun install && bun run build

# Expose your app port (adjust if different)
EXPOSE 3000

# Start your app
CMD ["bun", "backend/server.js"]
