# Use Bun base image
FROM oven/bun:1.0

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/ ./backend/

# Install backend dependencies
RUN cd backend && bun install

# Copy prebuilt frontend
COPY client/dist ./client/dist

# Serve with your backend
CMD ["bun", "backend/server.js"]
