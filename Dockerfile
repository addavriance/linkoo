FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY linkoo_shared ./linkoo_shared

RUN cd linkoo_shared && npm install && npm run build

RUN npm pkg set dependencies."@local/linkoo_shared"="file:./linkoo_shared"

RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
