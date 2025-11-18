import React from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { semaphoreStyle } from '../utils/styles';

const SemaphoresLayer = ({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: semaphoreStyle,
    onLoad
  });

  return null;
};

export default SemaphoresLayer;