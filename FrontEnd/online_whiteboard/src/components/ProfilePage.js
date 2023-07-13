import React from 'react';
import profile from './IMG_20230531_011514 (1).jpeg';
const Profile = ({ logout,userdata}) => {
  return (
    <div className="profile">
      <div className="profile-info">
      <img src={profile} alt="Profile Icon" />

        <p></p>
      </div>
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Profile;
