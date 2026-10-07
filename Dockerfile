# 1. Base Image
FROM node:20-alpine AS builder
WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm ci

# 3. Copy source and build
COPY . .
RUN npx prisma generate
ENV DOCKER_BUILD=true
ENV JWT_SECRET="ci-dummy-secret"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/db"
ENV GEMINI_API_KEY="ci-dummy-key"
RUN npm run build

# 4. Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]