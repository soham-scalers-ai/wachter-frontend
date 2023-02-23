


  import './Login.css';
  import logo from "../wachter.png"
  import { LoginComponent } from './LoginComponent';
  
  export function LoginPage() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <LoginComponent />
      </div>
    );
  }