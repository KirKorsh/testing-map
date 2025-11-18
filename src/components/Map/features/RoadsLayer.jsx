import React from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { roadStyle } from '../utils/styles';

const RoadsLayer = ({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: roadStyle,
    onLoad
  });

  return null;
};

export default RoadsLayer;