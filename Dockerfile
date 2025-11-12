# build stage
FROM node:22-alpine as build-stage

WORKDIR /app

# Enable corepack for yarn version management
RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn config set nodeLinker node-modules && yarn install

COPY . .

RUN yarn run build

# production stage
FROM node:22-alpine

WORKDIR /app

# Enable corepack for yarn version management
RUN corepack enable

RUN yarn global add http-server spa-http-server

COPY --from=build-stage /app/dist ./

EXPOSE 8080

CMD ["http-server", "--push-state", "-c-0"]
