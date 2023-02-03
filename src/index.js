import { createClient, Provider, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
