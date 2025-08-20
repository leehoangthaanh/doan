# Sử dụng Node.js 18
FROM node:18

# Set thư mục làm việc
WORKDIR /app

# Copy package.json trước để cache dependencies
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở port 8088
EXPOSE 8088

# Chạy ở chế độ dev
CMD ["npm", "run", "dev"]
