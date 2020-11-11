import logo from './logo.svg';
import './App.css';
import GraphUI from "./components/GraphUI";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <GraphUI />

      </header>
    </div>
  );
}

export default App;
