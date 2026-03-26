FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# --- BƯỚC QUAN TRỌNG NHẤT ---
# Tạo Prisma Client dựa trên file schema.prisma của bạn
RUN npx prisma generate

# Sau khi có Prisma Client mới tiến hành Build NestJS
RUN npm run build

EXPOSE 3000

# Lệnh khởi động: Đảm bảo DB được đồng bộ trước khi chạy app
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]