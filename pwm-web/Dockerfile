# Sử dụng Node.js 18
FROM node:20

# Set thư mục làm việc
WORKDIR /app

# Copy package.json trước
COPY package*.json ./

# Cài dependencies
RUN npm install --legacy-peer-deps

# Copy toàn bộ code
COPY . .

# Mở port Vite (5173)
EXPOSE 5173

# Chạy Vite dev server kèm NODE_OPTIONS
CMD ["sh", "-c", "NODE_OPTIONS=--openssl-legacy-provider npm run dev -- --host 0.0.0.0"]
