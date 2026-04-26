FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public && npx prisma generate && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY package.json package-lock.json* ./
RUN PRISMA_VERSION=$(node -e "const l=require('./package-lock.json'); console.log(l.packages['node_modules/prisma'].version)") \
    && npm install --no-audit --no-fund prisma@$PRISMA_VERSION
EXPOSE 3000
CMD ["sh", "-c", "./node_modules/.bin/prisma db push && node server.js"]
