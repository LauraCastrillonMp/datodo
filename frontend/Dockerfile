# Stage 1: build
FROM node:22 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Set public API URL for build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Limit memory to avoid SIGKILL
ENV NODE_OPTIONS="--max_old_space_size=1024"

# Build Next.js app
RUN npm run build

# Stage 2: production
FROM node:22

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --production --legacy-peer-deps
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]
