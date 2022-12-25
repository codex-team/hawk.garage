# build stage
FROM node:16.19.0-alpine3.17 as build-stage

WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install --prod

COPY . .

RUN yarn build

# production stage
FROM node:16.19.0-alpine3.17

RUN yarn global add http-server spa-http-server

COPY --from=build-stage /app/dist /

EXPOSE 8080

CMD ["http-server", "--push-state", "-c-0"]
