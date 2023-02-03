# Issue

GraphQL subscriptions are not terminated correctly when there is gateway in the chain. Works fine when client connects directly to a backend service.

## Steps:

1. run `npm i` to install dependencies
2. run `npm run start:service` to start a test service providing GraphQL schema - **port 3002**
3. run `npm run start:gateway` to start gateway service that federates our service - **port 3001**
4. run `npm start` to start frontend - **port 3000**

You can switch connecting to gateway or service directly by adjusting `BACKEND_PORT` constant in [src/index.js](src/index.js)

Note: also provided `start:<service>:dev` command to run nodemon for easier development.

## To reproduce:

- click multiple times on the button to increment state which is used as a variable for graphql subscription
- `service.js` should log from subscribe callback with provided arguments
- to better see the issue, add logging to `node_modules/mercurius/lib/subscription-connection.js` in `handleGQLComplete` function on line 336, for example `console.log('=== handleGQLComplete for id: ', id)`
- notice how when directly connected to the service a subscribe callback is called with correct arguments and the previous subscription is always terminated in the `handleGQLComplete` function
