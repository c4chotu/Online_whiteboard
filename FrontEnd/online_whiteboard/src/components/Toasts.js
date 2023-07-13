import React from 'react';
import './Toast.css';

function Toast(props) {
  const { type, message, description } = props;

  let iconClass;
  switch (type) {
    case 'success':
      iconClass = 'fas fa-check-circle';
      break;
    case 'error':
      iconClass = 'fas fa-times-circle';
      break;
    case 'info':
      iconClass = 'fas fa-info-circle';
      break;
    case 'warning':
      iconClass = 'fas fa-exclamation-circle';
      break;
    default:
      iconClass = 'fas fa-info-circle';
      break;
  }

  return (
    <div className={`toast ${type}`}>
      <div className="outer-container">
        <i className={iconClass}></i>
      </div>
      <div className="inner-container">
        <p>{message}</p>
        <p>{description}</p>
      </div>
      <button>&times;</button>
    </div>
  );
}

function Toasts() {
  return (
    <div className="wrapper">
      <Toast type="success" message="Success" description="Your changes saved successfully" />
      <Toast type="error" message="Error" description="Error has occurred while saving changes." />
      <Toast type="info" message="Info" description="New settings available on your account." />
      <Toast type="warning" message="Warning" description="Username you have entered is invalid." />
    </div>
  );
}

export default Toasts;
