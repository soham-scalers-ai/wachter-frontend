import './App.css';
import { Login } from './Login'
import logo from "./wachter.png"
import placesimg from "./places.png"

function App() {
  return (
    <div className="App">
      <h2> Diamond Room </h2>
      <div className="wachter-logo">
        <img id="topright" src={logo} className="App-logo" alt="logo" />
      </div>
      <img id="mainphoto" src={placesimg} className="App-logo" alt="logo" />
    </div>
  );
}

export default App;
