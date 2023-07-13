// Background.js
import { useState, useEffect } from 'react';

export const useBackgroundImage = (category) => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    fetchRandomImage(category);
  }, [category]);

  const fetchRandomImage = async (category) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?client_id=Lva94nfvk2DM7IVe7nYE1zFUYFX4iee9jviZJQ26mVA&query=${category}`
      );
      const data = await response.json();
      const imageUrl = data.urls.regular;
      console.log(imageUrl);
      setBackgroundImage(imageUrl);
    } catch (error) {
      console.error('Error fetching random image:', error);
    }
  };

  useEffect(() => {
    if (backgroundImage) {
      document.body.style.backgroundImage = `url(${backgroundImage})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
      document.body.style.backgroundBlendMode = 'overlay';
    }
  }, [backgroundImage]);
};
