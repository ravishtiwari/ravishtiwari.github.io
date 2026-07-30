# Build the Eleventy site.
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# Serve the generated static site.
FROM nginx:1.27-alpine

COPY --from=build /app/_site /usr/share/nginx/html

EXPOSE 80
