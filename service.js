const mercurius = require('mercurius');
const fastify = require('fastify');
const cors = require('@fastify/cors');

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
  type Subscription {
    test(id: ID!): ID
  }
`;

const resolvers = {
  Subscription: {
    test: {
      subscribe: (root, args, { pubsub }) => {
        console.log('=== subscribe', args);
        return pubsub.subscribe('TEST_TOPIC');
      },
    },
  },
};

const app = fastify({
  logger: true,
  disableRequestLogging: true,
});

app.register(cors, { origin: true });
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
  subscription: true,
  federationMetadata: true,
});

app.listen({ port: 3002 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
