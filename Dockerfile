# Base Bun image
FROM oven/bun:1.0

WORKDIR /app

# Backend setup
COPY backend/ ./backend/
RUN cd backend && bun install

# Copy prebuilt frontend output
COPY client/dist ./client/dist

# Expose app port (change if needed)
EXPOSE 3000

# Start command
CMD ["bun", "backend/server.js"]

