// shapes.js

import React, { useRef, useState } from 'react';
import { FaSquare, FaCircle } from 'react-icons/fa';
import {FiTriangle}  from 'react-icons/fi';

export const drawRectangle = (context, startX, startY, width, height) => {
    context.fillRect(startX, startY, width, height);
  };
  
  export const drawCircle = (context, centerX, centerY, radius) => {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.fill();
  };
  
  export const drawTriangle = (context, x1, y1, x2, y2, x3, y3) => {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.closePath();
    context.fill();
  };

export const Rectangle = ({ onShapeSelected }) => {
  const shapeRef = useRef(null);

  const handleShapeClick = () => {
    onShapeSelected('rectangle');
  };

  return (
    <div>
      <FaSquare ref={shapeRef} />
      <span>Rectangle</span>
      <button onClick={handleShapeClick}>Select</button>
    </div>
  );
};

export const Circle = ({ onShapeSelected }) => {
  const shapeRef = useRef(null);

  const handleShapeClick = () => {
    onShapeSelected('circle');
  };

  return (
    <div>
      <FaCircle ref={shapeRef} />
      <span>Circle</span>
      <button onClick={handleShapeClick}>Select</button>
    </div>
  );
};

export const Triangle = ({ onShapeSelected }) => {
  const shapeRef = useRef(null);

  const handleShapeClick = () => {
    onShapeSelected('triangle');
  };

  return (
    <div>
      <FiTriangle ref={shapeRef} />
      <span>Triangle</span>
      <button onClick={handleShapeClick}>Select</button>
    </div>
  );
};
