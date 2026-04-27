# Контекст сборки — корень репозитория (см. docker-compose*: context: .).
# Флаги стран лежат в ../assets относительно frontend; в образе они монтируются как /assets.
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
COPY assets /assets
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/nginx/default.cloud.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
