# Stage 1 - Build
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_DEPLOY_ENV=local
ENV VITE_DEPLOY_ENV=${VITE_DEPLOY_ENV}

RUN npm run build

# Stage 2 - Runtime
FROM nginx:1.29-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
