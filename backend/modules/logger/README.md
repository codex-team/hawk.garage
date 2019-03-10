## Logging

[Pino](https://github.com/pinojs/pino) is used as logger, it will automatically log all the requests in [ndjson](https://ndjson.org/) format.

Also you can use it in your routes or middlewares, it is defined in `express.Request` like `req.log`.

Example:

```js
app.get("/", async (req, res) => {
  req.log.info("sent hello world");
  res.send("hello world");
});
```

If you want to log out of express scope you can import logger from `./modules/logger.js`

### Development pretty-print

If `NODE_ENV` is set to `development` the logs will appear in formated way like so:

```
[1552064312629] INFO  (6751 on hostname): request completed
    req: {
      "id": 1,
      "method": "GET",
      "url": "/",
      "headers": {
        "host": "127.0.0.1:3000",
        "connection": "keep-alive",
        "cache-control": "max-age=0",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
        "dnt": "1",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "if-none-match": "W/\"5b0-C8qOCSKILpNaZMZKGEV8jqbTZ7s\""
      },
      "remoteAddress": "127.0.0.1",
      "remotePort": 37880
    }
    res: {
      "statusCode": 304,
      "headers": {
        "x-powered-by": "Express",
        "etag": "W/\"5b0-C8qOCSKILpNaZMZKGEV8jqbTZ7s\""
      }
    }
    responseTime: 26
```

### Logging to file

File write is io-bound operation, hence it will slow your server. Prefer piping stdout to file. For example, pipe to file:

```bash
node index.js | tee hawk.log
```

or without printing it (faster)

```bash
node index.js > hawk.log
```

It will also help you to rotate logs, e.g. with [logrotate](http://getpino.io/#/docs/help?id=rotate)

### Processing logs

If you want to process or filter logs, consider doing it in a different process because of the same reason.

Generally, you can grab logs from stdout to use it with your favorite tools (e.g. send to elasticserach/mongo/redis). It's the preferable way.

See more information on processing [here](http://getpino.io/#/docs/ecosystem)
