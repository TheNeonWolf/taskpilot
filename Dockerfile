FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

# Build-time environment variables for Next.js static page collection
ENV DOCKER_BUILD=true
ENV JWT_SECRET="ci-dummy-secret-key-12345"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/db"
ENV GEMINI_API_KEY="ci-dummy-key"

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]