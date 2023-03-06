


  import './Login.css';
  import logo from "../images/wachter.png"
  import { LoginComponent } from '../components/LoginComponent';
  
  export function LoginPage() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <LoginComponent />
      </div>
    );
  }