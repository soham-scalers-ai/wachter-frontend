import React, { useState } from "react";
import { userService } from '../components/userService';
import { useNavigate } from "react-router-dom";


export const LoginComponent = (props) => {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const navi = useNavigate()
  

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!(user && pwd)) {
            return;
        }
        userService.login(user, pwd)
        .then(
            userObj => {
                navi("/controls")
            },
        );
    }

    userService.logout();

    return (
        <div className="auth-form-container">
            <form className="login-form" onSubmit={handleSubmit} >
                <input value={user} onChange={(e) => setUser(e.target.value)} type="username" placeholder="Username" id="username" name="username" />
                <input value={pwd} onChange={(e) => setPwd(e.target.value)} type="password" placeholder="Password" id="password" name="password" />
                <br></br>
                <button type="submit">LOGIN</button>
            </form>
        </div>
    )
}