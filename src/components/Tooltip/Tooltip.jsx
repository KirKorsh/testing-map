import React, { memo } from 'react';
import './Tooltip.css';

const Tooltip = memo(({ position, content, visible }) => {
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
});

Tooltip.displayName = 'Tooltip';
export default Tooltip;