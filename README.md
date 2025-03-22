## Installation

```bash
# prepare local databases
$ docker-compose -f docker-compose.local-dev.yml up -d
```

```bash
# install dependencies
$ yarn install
```

### Data migration


```bash
# run migration
$ yarn prisma:deploy
```

```bash
# run generate Prisma
$ yarn prisma:g
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test:unit

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:ci
```
