import React, { memo } from 'react';
import useVectorLayer from '../hooks/useVectorLayer';
import { crossroadStyle } from '../utils/styles';

const CrossroadsLayer = memo(({ map, data, onLoad }) => {
  useVectorLayer({
    map,
    data,
    style: crossroadStyle,
    onLoad
  });

  return null;
});

CrossroadsLayer.displayName = 'CrossroadsLayer';
export default CrossroadsLayer;