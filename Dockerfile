# ---- Build stage: Vite production build ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
ARG VITE_API_BASE_URL
ARG VITE_SITE_URL="http://localhost:3000"
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
RUN test -n "$VITE_API_BASE_URL" && npm run build

# ---- Runtime stage: nginx serves the SPA and proxies /api ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
