// Toolbar.js

import React from 'react';
import { Rectangle, Circle, Triangle } from './Shapes';

const Toolbar = ({ onSelectShape }) => {
  const handleShapeSelected = (shapeType) => {
    onSelectShape(shapeType);
  };

  return (
    <div className="toolbar">
      <h3>Shapes</h3>
      <div className="shape-list">
        <Rectangle onShapeSelected={handleShapeSelected} />
        <Circle onShapeSelected={handleShapeSelected} />
        <Triangle onShapeSelected={handleShapeSelected} />
      </div>
    </div>
  );
};

export default Toolbar;
