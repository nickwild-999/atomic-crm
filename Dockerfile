# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Build args (baked into the static bundle at build time)
ARG VITE_SUPABASE_URL
ARG VITE_SB_PUBLISHABLE_KEY
ARG VITE_ATTACHMENTS_BUCKET=attachments
ARG VITE_INBOUND_EMAIL
ARG VITE_IS_DEMO=false

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SB_PUBLISHABLE_KEY=$VITE_SB_PUBLISHABLE_KEY
ENV VITE_ATTACHMENTS_BUCKET=$VITE_ATTACHMENTS_BUCKET
ENV VITE_INBOUND_EMAIL=$VITE_INBOUND_EMAIL
ENV VITE_IS_DEMO=$VITE_IS_DEMO

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
