const mercurius = require('mercurius');
const { mercuriusFederationPlugin } = require('@mercuriusjs/federation')
const fastify = require('fastify');
const cors = require('@fastify/cors');

const { withFilter } = mercurius;

const schema = `
  type Notification {
    id: ID!
    message: String
  }
  type Query {
    add(x: Int, y: Int): Int
  }
  type Mutation {
    addNotification(id: ID!): Notification
  }
  type Subscription {
    notificationAdded(id: ID!): Notification
  }
`;

const resolvers = {
  Mutation: {
    addNotification: async (root, args, { pubsub }) => {
      const notification = {
        id: args.id,
        message: 'some message',
      };
      await pubsub.publish({
        topic: 'NOTIFICATION_ADDED',
        payload: { notificationAdded: notification },
      });
      return notification;
    },
  },
  Subscription: {
    notificationAdded: {
      subscribe: withFilter(
        (root, args, { pubsub }) => {
          console.log('=== subscribe', args);
          return pubsub.subscribe('NOTIFICATION_ADDED');
        },
        (payload, args) => {
          console.log('=== filter', args, payload);
          return true;
        }
      ),
    },
  },
};

const app = fastify({ logger: true, disableRequestLogging: true });

app.register(cors, { origin: true });
app.register(mercuriusFederationPlugin, {
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
