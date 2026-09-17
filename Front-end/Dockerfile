# Frontend Dockerfile - Multi-stage build
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (ignore scripts for security)
RUN npm ci --ignore-scripts

# Copy source code
# Note: .dockerignore ensures sensitive files (.env, node_modules, etc.) are excluded
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./

# Build the application
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install gettext for envsubst (environment variable substitution)
RUN apk add --no-cache gettext

# Create non-root user
RUN addgroup -g 1001 -S nginx-user && \
    adduser -S nginx-user -u 1001 -G nginx-user

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template (will be processed at runtime)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Create entrypoint script to substitute environment variables and start nginx
# Note: Script runs as root to process template, then switches to nginx-user for nginx
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'set -e' >> /docker-entrypoint.sh && \
    echo '# Substitute environment variables in nginx template' >> /docker-entrypoint.sh && \
    echo 'envsubst '"'"'$$BACKEND_HOST $$BACKEND_PORT'"'"' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo '# Fix ownership of generated config file' >> /docker-entrypoint.sh && \
    echo 'chown nginx-user:nginx-user /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo '# Create log files with proper permissions' >> /docker-entrypoint.sh && \
    echo 'touch /var/log/nginx/access.log /var/log/nginx/error.log' >> /docker-entrypoint.sh && \
    echo 'chown nginx-user:nginx-user /var/log/nginx/access.log /var/log/nginx/error.log' >> /docker-entrypoint.sh && \
    echo 'chmod 644 /var/log/nginx/access.log /var/log/nginx/error.log' >> /docker-entrypoint.sh && \
    echo '# Start nginx as nginx-user' >> /docker-entrypoint.sh && \
    echo 'exec su-exec nginx-user nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Install su-exec for switching users (lightweight alternative to sudo)
RUN apk add --no-cache su-exec

# Change ownership of nginx directories to non-root user
RUN chown -R nginx-user:nginx-user /usr/share/nginx/html && \
    chown -R nginx-user:nginx-user /var/cache/nginx && \
    chown -R nginx-user:nginx-user /var/log/nginx && \
    chown -R nginx-user:nginx-user /etc/nginx/conf.d && \
    chown -R nginx-user:nginx-user /etc/nginx/templates && \
    touch /var/run/nginx.pid && \
    chown -R nginx-user:nginx-user /var/run/nginx.pid

# Keep as root for entrypoint script (switches to nginx-user inside script)
# USER nginx-user

# Expose port 8080 (non-root users cannot bind to ports < 1024)
EXPOSE 8080

# Set default environment variables (can be overridden in docker-compose)
ENV BACKEND_HOST=backend
ENV BACKEND_PORT=3001

# Start nginx with entrypoint script
CMD ["/docker-entrypoint.sh"]

