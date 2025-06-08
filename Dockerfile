# Use Bun as base for backend
FROM oven/bun:1.0 AS base

WORKDIR /app

# Backend install
COPY backend/ ./backend/
RUN cd backend && bun install

# Use Node for frontend build
FROM node:18 AS builder
WORKDIR /app
COPY client/ ./client/
WORKDIR /app/client
RUN npm install
RUN npm run build

# Final runtime image
FROM oven/bun:1.0
WORKDIR /app

# Copy backend
COPY --from=base /app/backend ./backend

# Copy frontend dist only
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 3000
CMD ["bun", "backend/server.js"]
