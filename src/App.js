import { useState } from 'react';
import { useSubscription, useMutation } from 'urql';

const TestSubscription = `
  subscription MySubscription($id:ID!) {
    notificationAdded(id:$id) {
      id
      message
    }
  }
`;

const TestMutation = `
  mutation MyMutation($id: ID!) {
    addNotification(id:$id) {
      id
      message
    }
  }
`;

function App() {
  const [id, setId] = useState(0);

  useSubscription({
    query: TestSubscription,
    variables: { id },
  });

  const [_, triggerSubscriptionPublish] = useMutation(TestMutation);

  return (
    <div className="App">
      <p>ID: {id}</p>
      <button onClick={() => setId((oldId) => ++oldId)}>Click to increment ID</button>
      <button onClick={() => triggerSubscriptionPublish({ id })}>Add notification</button>
    </div>
  );
}

export default App;
