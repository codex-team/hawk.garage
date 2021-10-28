# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install --prod

COPY . .

RUN yarn build

# production stage
FROM node:lts-alpine

RUN yarn global add http-server spa-http-server

COPY --from=build-stage /app/dist /

EXPOSE 8080

CMD ["http-server", "--push-state", "-c-0"]
