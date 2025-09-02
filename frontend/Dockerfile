# frontend/Dockerfile
FROM node:22-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# reduce memory issues during build
ENV NODE_OPTIONS="--max_old_space_size=1024"

RUN npm run build

# production image
FROM node:22-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
# include node_modules and build from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./next.config.js

ENV PATH /usr/src/app/node_modules/.bin:$PATH
EXPOSE 3000
CMD ["npm", "run", "start"]
