FROM oven/bun:1.0

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN cd backend && bun install && cd ../client && bun install && bun run build

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD ["bun", "backend/server.js"]