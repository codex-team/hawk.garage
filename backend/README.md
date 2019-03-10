# Hawk.so express-backend

## Project setup

```
yarn install
```

### Run server

```
yarn start
```

## Logging

You can use [pino](https://github.com/pinojs/pino) logger in your routes or middlewares, it is defined in `express.Request` like `req.log`.

Example:

```js
app.get("/", async (req, res) => {
  req.log.info("sent hello world");
  res.send("hello world");
});
```

More information and advanced usage [here](./modules/logger/README.md)
