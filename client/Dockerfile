FROM node:20.12-alpine AS builder
WORKDIR /app
COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci
COPY . .
ARG VITE_API_ORIGIN
ARG VITE_API_PATH
WORKDIR /app/client
RUN npm run build

FROM nginx:1.25.3-alpine3.18
RUN rm /usr/share/nginx/html/* -rf
COPY --from=builder /app/client/dist /usr/share/nginx/html
ENV NGINX_ENVSUBST_OUTPUT_DIR '/etc/nginx/conf.d'
COPY client/nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx.
CMD ["nginx", "-g", "daemon off;"]