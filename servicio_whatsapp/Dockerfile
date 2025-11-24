# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]