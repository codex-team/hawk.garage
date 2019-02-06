# hawk.so
Hawk 2.0 web client

# Before deploying
1. Run `yarn install`.
2. Copy `.env.sample` to `.env` and fill environmental variables with your data.
3. Run `docker-compose up` to setup mongoDB.
4. Run tests:
```bash
cd backend
yarn test
```
If not all tests passed, your config contains errors.

# Build frontend
```bash
cd frontend
yarn build
```

# Run server
```
cd backend
yarn start
```
