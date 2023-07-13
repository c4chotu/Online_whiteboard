import React, { useState } from 'react';
import Whiteboard from './Whiteboard';
import { useBackgroundImage } from './Background'; // Import the Background component
import './Home.css';
import ProfilePage from './ProfilePage';
import { FaUser } from 'react-icons/fa';
import photo from './IMG_20230531_011514 (1).jpeg';

const Home = ({userdata,onLogout}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 400 });
  const [showProfile, setShowProfile] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const increaseCanvasSize = () => {
    setCanvasSize((prevSize) => ({
      width: prevSize.width + 100,
      height: prevSize.height + 100,
    }));
  };

  const decreaseCanvasSize = () => {
    if (canvasSize.width > 100 && canvasSize.height > 100) {
      setCanvasSize((prevSize) => ({
        width: prevSize.width - 100,
        height: prevSize.height - 100,
      }));
    }
  };

  // Call the setBackgroundImage function with the desired category
  useBackgroundImage('nature');
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className={`container ${fullscreen ? 'fullscreen' : ''}`}>
     <div className="header">
        <h1>Online Whiteboard</h1>
      <div className="profile-icon" onClick={toggleProfile}>
      <img src={photo} alt="Profile Icon" />
      
        </div>
        {showProfile && <ProfilePage logout={onLogout} userdata={userdata} />}
      </div>
      <div className="content">
        <Whiteboard
          canvasSize={canvasSize}
          increaseCanvasSize={increaseCanvasSize}
          decreaseCanvasSize={decreaseCanvasSize}
        />
      </div>
    </div>
  );
};

export default Home;
