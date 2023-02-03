import { useState } from 'react';
import { useSubscription } from 'urql';

const TestSubscription = `
  subscription MySubscription($id:ID!) {
    test(id:$id)
  }
`;

function App() {
  const [id, setId] = useState(0);

  useSubscription({
    query: TestSubscription,
    variables: { id },
  });

  return (
    <div className="App">
      <button onClick={() => setId((oldId) => ++oldId)}>Increment id to: {id + 1}</button>
    </div>
  );
}

export default App;
