# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install --legacy-peer-deps

# 5. Copy source code
COPY . .

RUN npx prisma generate
COPY prisma ./prisma/

# 6. Build the project (if using TypeScript)
RUN npm run build

# 7. Expose backend port
EXPOSE 3001

# 8. Start the app
CMD ["npm", "run", "start:prod"]
