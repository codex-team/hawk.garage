# build stage
FROM node:24-alpine as build-stage

WORKDIR /app

# Enable corepack for yarn version management
RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

COPY . .

RUN yarn run build

# production stage
FROM node:24-alpine

WORKDIR /app

RUN npm install -g http-server spa-http-server

COPY --from=build-stage /app/dist ./

EXPOSE 8080

CMD ["http-server", "--push-state", "-c-0"]
