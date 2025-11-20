import React, { memo } from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { semaphoreStyle } from '../utils/styles';

const SemaphoresLayer = memo(({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: semaphoreStyle,
    onLoad
  });

  return null;
});

SemaphoresLayer.displayName = 'SemaphoresLayer';
export default SemaphoresLayer;