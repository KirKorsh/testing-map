import React from 'react';
import './Tooltip.css';

const Tooltip = ({ position, content, visible }) => {
  if (!visible || !content) return null;

  return (
    <div 
      className="tooltip"
      style={{
        left: position[0],
        top: position[1]
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip;