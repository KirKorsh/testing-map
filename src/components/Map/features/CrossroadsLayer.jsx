import React from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { crossroadStyle } from '../utils/styles';

const CrossroadsLayer = ({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: crossroadStyle,
    onLoad
  });

  return null;
};

export default CrossroadsLayer;