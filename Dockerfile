# === Stage 1: Build frontend with Node ===
FROM node:18 AS builder
WORKDIR /app

# Install frontend dependencies and build
COPY client ./client
WORKDIR /app/client
RUN npm install && npm run build

# === Stage 2: Backend with Bun ===
FROM oven/bun:1.0

# Set working dir
WORKDIR /app

# Copy backend
COPY backend ./backend
WORKDIR /app/backend

# Install backend deps
RUN bun install

# Create public dir
RUN mkdir -p public

# Copy built frontend from builder
COPY --from=builder /app/client/dist ./public

# Expose and start
EXPOSE 3000
CMD ["bun", "server.js"]
