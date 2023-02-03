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

To better see the issue, add logging to `node_modules/mercurius/lib/subscription-connection.js` in `handleGQLComplete` function on line 336, for example `console.log('=== handleGQLComplete for id: ', id)` and restart both service and gateway.

1. When you start the app the client is configured to connect through the gateway

- click multiple times on the increment button to increment ID which is used as a variable for graphql subscription
- `service.js` should log from subscribe callback with new ID each time you clicked
- observe gateway logs to see that each time ID was incremented, `handleGQLComplete` was called
- observe service logs to see that `handleGQLComplete` was not called once
- now click 'Add notification' button to see the filter handler invoked X times you incremented the ID, but according to gateway subscriptions with old variables were closed?
- now shutdown gateway and observe service logs to see that `handleGQLComplete` was additionally logged X times the ID was incremented, but these should have been closed during the incrementing when gateway closed them?

2. Now switch `BACKEND_PORT` as per instructions so the client connects directly to service and restart `service`

- first step is the same, increment ID multiple times
- observe service logs to see subscribe callback called each time you clicked
- you will also see each time ID was incremented, previous subscription was closed
- if you click 'Add notification' you will see filter callback invoked only once as previous subscriptions were closed

## Conclusion

It seems that gateway doesnt close subscriptions to(/in?) federated services even though they were closed by gateway itself.
