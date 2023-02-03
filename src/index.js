import { createClient, Provider, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const BACKEND_PORT = 3001;
// switch to this to connect directly to the service
// const BACKEND_PORT = 3002;

const wsClient = createWSClient({
  url: `ws://localhost:${BACKEND_PORT}/graphql`,
});

const client = createClient({
  url: `http://localhost:${BACKEND_PORT}/graphql`,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </React.StrictMode>
);
