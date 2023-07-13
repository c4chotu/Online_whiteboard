import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Api from './Api';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const data={
      email,
      password
    }

    try{
      const response=Api.loginUser(data);
      onLoginSuccess(response);
      console.alert(response);

     

    }
    catch(error){

    }
  
    

   
  };

  return (
    <div className="login-container">
      <div className="card">
        <h2 id="logg">Login</h2>
        <form className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="login-input"
          />
          <button type="submit" onClick={handleLogin} className="login-button">
            Login
          </button>
        </form>
        <div className="login-links"><h2>Don't Have Account?</h2>
          <Link to="/Register"><h2 id="reg">Register</h2></Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
