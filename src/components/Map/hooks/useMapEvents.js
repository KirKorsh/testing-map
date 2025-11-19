import { useEffect, useCallback } from 'react';
import { createEventHandlers } from '../utils/interactions';

export const useMapEvents = (map, { onHover, onClick, onDoubleClick }) => {
  useEffect(() => {
    if (!map) return;

    const eventHandlers = createEventHandlers(onHover, onClick, onDoubleClick);

    map.on('pointermove', eventHandlers.handlePointerMove);
    map.on('click', eventHandlers.handleClick);

    return () => {
      map.un('pointermove', eventHandlers.handlePointerMove);
      map.un('click', eventHandlers.handleClick);
      eventHandlers.clearHover();
    };
  }, [map, onHover, onClick, onDoubleClick]);
};