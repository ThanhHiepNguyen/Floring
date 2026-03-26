FROM node:20-alpine
# BẮT BUỘC: Cài thêm openssl và libc6-compat để Prisma chạy được trên Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./
# Dùng npm install để tránh lỗi kén phiên bản trên container
RUN npm install

COPY . .

# Tạo Prisma Client (Bước này sẽ hết lỗi 'Unexpected token E' nhờ có openssl ở trên)
RUN npx prisma generate

RUN npm run build

EXPOSE 8000

# Đẩy schema lên database của Railway và khởi chạy app
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]