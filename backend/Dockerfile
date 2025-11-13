FROM oven/bun:1.1.30 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.1.30 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1.1.30 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["bun", "dist/main.js"]

