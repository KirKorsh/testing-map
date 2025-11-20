import React, { memo } from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { roadStyle } from '../utils/styles';

const RoadsLayer = memo(({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: roadStyle,
    onLoad
  });

  return null;
});

RoadsLayer.displayName = 'RoadsLayer';
export default RoadsLayer;