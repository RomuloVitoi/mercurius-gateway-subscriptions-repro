const mercurius = require('mercurius');
const fastify = require('fastify');
const cors = require('@fastify/cors');

const app = fastify({
  logger: true,
  disableRequestLogging: true,
});

app.register(cors, { origin: true });
app.register(mercurius, {
  graphiql: true,
  subscription: true,
  gateway: {
    pollingInterval: 10_000,
    services: [
      {
        name: 'test-service',
        url: 'http://localhost:3002/graphql',
        wsUrl: 'ws://localhost:3002/graphql',
        mandatory: true,
      },
    ],
  },
});

app.listen({ port: 3001 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
