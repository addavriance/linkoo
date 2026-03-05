FROM node:20-alpine AS base

FROM base AS deps

WORKDIR /linkoo_shared
COPY linkoo_shared /linkoo_shared
RUN npm install
RUN npm run build

WORKDIR /app
COPY package*.json ./

RUN npm install /linkoo_shared

RUN npm ci

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
