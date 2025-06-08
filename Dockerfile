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

# Debug: List contents before build
RUN echo "Contents before build:" && ls -la client/

# Build the frontend and verify the build
RUN cd client && bun run build && \
    echo "Contents after build:" && \
    ls -la dist/ && \
    echo "Contents of dist directory:" && \
    find dist -type f

# Create the uploads directory and public directory
RUN mkdir -p backend/uploads && \
    mkdir -p backend/public

# Copy the built frontend to public directory
RUN cp -rv client/dist/* backend/public/ && \
    echo "Contents of public directory:" && \
    ls -la backend/public/ && \
    chmod -R 755 backend/public

# Expose your app port
EXPOSE 3000

# Start your app
CMD ["bun", "backend/server.js"]
