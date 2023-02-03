import { useQuery } from 'urql';

const TestQuery = `
  query {
    add(x:5,y:7)
  }
`;

function App() {
  useQuery({
    query: TestQuery,
  });

  return <div className="App"></div>;
}

export default App;
