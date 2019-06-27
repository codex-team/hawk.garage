# hawk.so
Hawk 2.0 web client

# How to run
## Development
1. Create `.env` file (use `.env.sample` for example).
2. Run `yarn install` to install all dependencies.
3. Run `yarn serve` to run dev server.

## Production
1. Create `.env` file (use `.env.sample` for example).
2. Run `yarn install` to install all dependencies.
3. Run `yarn build` to build the app.
4. Run `yarn serve:prod` to run simple production server.

## Docker
1. Build image from `Dockerfile`: `docker image build . -t hawk_garage`
2. Run container: `docker run -it -p 8080:8080 --rm hawk_garage`

# Useful command
1. `yarn lint:js` - runs eslint to check files with `.js` and `.vue` extensions.
2. `yarn lint:css` - runs stylelint to check files with `.css` and `.vue` extensions.
2. `yarn lint` - runs both eslint and stylelint.
3. `yarn svg` - runs svg sprite generator.
