import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import Api from './Api';

const RegisterPage = ({ onRegisterSuccess }) => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const data={
      firstname,
      lastname,
      email,
      password
    }

    try{
      const response=Api.registerUser(data);
      alert("user register sucessfully")
      console.log(response);
      onRegisterSuccess();
      navigate('/Login');
    }catch(error){
      console.log(error);
      alert("user not registered");
    }
   


  };

  return (
    <div className="register-container">
      <div className="card">
        <h2 id="regg">Register</h2>
        <form className="register-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={handleFirstNameChange}
            className="register-input"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={handleLastNameChange}
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="register-input"
          />
          <button type="submit" onClick={handleRegister} className="register-button">
            Register
          </button>
        </form>
        <div className="register-links">
          <h4>Already have a Account?</h4><Link to="/Login"><h2 id="login1">Login</h2></Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
