# Stage 1: build
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and Prisma files
COPY . .
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Set Node memory limit to prevent OOM
ENV NODE_OPTIONS="--max_old_space_size=1024"

# Build project (TypeScript)
RUN npm run build

# Download wait-for-it.sh and make it executable
RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Stage 2: production
FROM node:22

WORKDIR /usr/src/app

# Copy only needed files from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/wait-for-it.sh ./

# Expose backend port
EXPOSE 3001

# Start backend after MySQL is ready, run migrations, seed, then start
CMD ["sh", "-c", "./wait-for-it.sh db:3306 -- npx prisma migrate deploy && npx prisma db seed && npm run start:prod"]
