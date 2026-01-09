FROM node:20-alpine AS builder

WORKDIR /app

# Copy shared types first
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/
COPY shared/src ./shared/src

# Copy backend package files
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

WORKDIR /app/backend

# Install dependencies
RUN npm ci

# Copy backend source
COPY backend/src ./src

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy shared types
COPY --from=builder /app/shared ./shared

# Copy backend package files
COPY backend/package*.json ./backend/
COPY backend/tsconfig.json ./backend/

WORKDIR /app/backend

# Install production dependencies INCLUDING tsconfig-paths
RUN npm ci --only=production && npm install tsconfig-paths

# Copy built files from builder  
COPY --from=builder /app/backend/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 8765

CMD ["node", "-r", "tsconfig-paths/register", "dist/backend/src/index.js"]
