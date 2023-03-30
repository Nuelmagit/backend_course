## Tested on.
    Ubuntu
    Nodejs v14

Before runninng any command please make sure you install packages first.

```sh
npm install
```

## Init database.

In the project folder run

```sh
#This will initialize user and account
DB_CONECTION="mongo-connection-string" npx babel-node scripts/init-account-state.js
#This will initialize operation types
DB_CONECTION="mongo-connection-string" npx babel-node scripts/init-operation-types.js
```

## Deploy.

For deploying in AWS run

```sh
npm run deploy
```