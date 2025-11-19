import React, { useCallback } from 'react';
import RoadsLayer from '../features/RoadsLayer';
import CrossroadsLayer from '../features/CrossroadsLayer';
import SemaphoresLayer from '../features/SemaphoresLayer';
import { useMapEvents } from '../hooks/useMapEvents';
import { useMapExtent } from '../hooks/useMapExtent';
import useLayersLoad from '../hooks/useLayersLoad';

const VectorLayers = ({ 
  map, 
  lineData, 
  roadCrosData, 
  semaphoresData, 
  onHover, 
  onClick, 
  onDoubleClick 
}) => {
  const { onLayerLoad, allLayersLoaded } = useLayersLoad(3);
  
  // Используем кастомные хуки
  useMapEvents(map, { onHover, onClick, onDoubleClick });
  const { sourcesRef } = useMapExtent(
    map, 
    [lineData, roadCrosData, semaphoresData], 
    allLayersLoaded
  );

  const handleLayerLoad = useCallback((source) => {
    if (!sourcesRef.current.includes(source)) {
      sourcesRef.current.push(source);
      onLayerLoad();
    }
  }, [onLayerLoad, sourcesRef]);

  return (
    <>
      <RoadsLayer 
        map={map} 
        data={lineData} 
        onLoad={handleLayerLoad}
      />
      <CrossroadsLayer 
        map={map} 
        data={roadCrosData} 
        onLoad={handleLayerLoad}
      />
      <SemaphoresLayer 
        map={map} 
        data={semaphoresData} 
        onLoad={handleLayerLoad}
      />
    </>
  );
};

export default VectorLayers;