const mercurius = require('mercurius');
const fastify = require('fastify');
const cors = require('@fastify/cors');

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`;

const resolvers = {
  Query: {
    add: async (_, { x, y }) => x + y,
  },
};

const app = fastify({
  logger: true,
});

app.register(cors, { origin: true });
app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true,
});

app.listen({ port: 3002 }, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
