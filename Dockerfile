# build stage
FROM node:24-alpine AS build-stage

WORKDIR /app

# Enable corepack for yarn version management
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

RUN yarn run build

# production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8080
