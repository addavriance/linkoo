# Базовый образ Node.js
FROM node:20-alpine AS base

# Установка зависимостей
FROM base AS deps
WORKDIR /app

# Копируем package файлы
COPY package*.json ./

RUN ls -la package*.json

# Устанавливаем зависимости
RUN npm ci

# Сборка приложения
FROM base AS builder
WORKDIR /app

# Копируем зависимости
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Собираем production build
RUN npm run build

# Production образ с Nginx
FROM nginx:alpine AS runner

# Копируем кастомную nginx конфигурацию
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

# Открываем порт
EXPOSE 80

# Nginx запускается автоматически
CMD ["nginx", "-g", "daemon off;"]
