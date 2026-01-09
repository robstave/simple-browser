FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared types first
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src

# Copy frontend package files
COPY frontend/package*.json ./frontend/

WORKDIR /app/frontend

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ .

# Build for production
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
