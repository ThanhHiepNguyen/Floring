FROM node:20-alpine AS base

# Prisma trên Alpine cần libc6-compat + openssl
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS deps
COPY package*.json ./
# Dùng package-lock để build ổn định, reproducible
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

FROM base AS prod
ENV NODE_ENV=production

# Giữ node_modules để có sẵn prisma CLI cho lệnh "db push" lúc chạy
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8000

# Railway sẽ gọi service sau khi container "listen" OK.
# "db push" chạy trước để schema sẵn sàng.
CMD ["sh", "-c", "npx prisma db push && node dist/src/main"]