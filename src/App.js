import { useSubscription } from 'urql';

const TestSubscription = `
  subscription MySubscription($id:ID!) {
    test(id:$id)
  }
`;

function App() {
  useSubscription({
    query: TestSubscription,
    variables: {
      id: 1,
    },
  });

  return <div className="App"></div>;
}

export default App;
