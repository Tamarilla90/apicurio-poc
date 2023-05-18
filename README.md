
## Description

Event Specification and Schema Registry with Apicurio

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Troubleshooting

### Build the registry client library

Seems that the Apicurio client needs to be built, so you may 
experience a `Cannot find module ‘apicurio-registry-client’` 
error while starting the application `with npm run start`

You can solve it by executing this next commands: 

```
    cd node_modules/apicurio-registry-client/
    npm i && npm run build
```

