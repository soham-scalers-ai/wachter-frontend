const config = {apiUrl: 'http://localhost:8080'}
const base64 = require('base-64')

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: {'Authorization': 'Basic ' + base64.encode(username + ":" + password)},
    };
    
    return fetch(`${config.apiUrl}/api/login`, requestOptions)
        .then(response => {
            if (response.ok) {
                localStorage.setItem('login-creds', JSON.stringify({username, password}));
            } else {
                logout();
                window.location.reload(true);
            }
        });
}

function logout() {
    localStorage.removeItem('login-creds');
}

export const userService = {
    login,
    logout
};