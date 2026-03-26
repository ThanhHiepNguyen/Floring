FROM node:20-alpine
WORKDIR /app

COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ mã nguồn
COPY . .

# --- BƯỚC QUAN TRỌNG NHẤT CÒN THIẾU ---
# Tạo ra Prisma Client để NestJS có thể build được
RUN npx prisma generate

# Sau khi đã có types, mới tiến hành build app
RUN npm run build

EXPOSE 8000

# Lệnh khởi động (đã bao gồm tự động push schema lên DB)
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]