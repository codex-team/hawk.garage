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

## Storybook

Storybook is a components explorer. It is used to explore components UI and behaviour and to develop them in isolation.

To add story, create a folder for component in [src/storybook/stories](src/storybook/stories). In a folder create `.ts` [file for story](https://www.learnstorybook.com/intro-to-storybook/vue/en/simple-component/) and `.mdx` [file for story docs](https://github.com/storybookjs/storybook/tree/master/addons/docs).

To run storybook, use `yarn storybook` command

## Useful command
1. `yarn lint:js` - runs eslint to check files with `.js` and `.vue` extensions.
2. `yarn lint:css` - runs stylelint to check files with `.css` and `.vue` extensions.
2. `yarn lint` - runs both eslint and stylelint.
3. `yarn svg` - runs svg sprite generator.

## Load GraphQL schema for development

After updating Hawk GraphQL API scheme you should pull
its schema (see [file](./schema.graphql)) for code highlighting and typechecking in queries.
There are set of scripts that can help you:

1. `yarn get-schema` — loads schema from production server
2. `yarn get-schema:stage` — loads schema from stage server
3. `yarn get-schema:local` — loads schema from your local server (http://localhost:4000/graphql by default)
4. `yarn get-graphql-schema server_url > schema.graphql`, where `server_url` is the path to GraphQL server whose schema ypu want to download
