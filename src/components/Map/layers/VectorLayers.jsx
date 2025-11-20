import React, { useCallback, memo, useRef, useEffect } from 'react';
import RoadsLayer from '../features/RoadsLayer';
import CrossroadsLayer from '../features/CrossroadsLayer';
import SemaphoresLayer from '../features/SemaphoresLayer';
import { useMapEvents } from '../hooks/useMapEvents';
import { useMapExtent } from '../hooks/useMapExtent';
import useLayersLoad from '../hooks/useLayersLoad';

const VectorLayers = memo(({ 
  map, 
  lineData, 
  roadCrosData, 
  semaphoresData, 
  onHover, 
  onClick, 
  onDoubleClick 
}) => {
  const { onLayerLoad, allLayersLoaded } = useLayersLoad(3);
  const loadedSourcesRef = useRef(new Set()); 
  
  // Мемоизируем обработчики событий
  const memoizedOnHover = useCallback(onHover, []);
  const memoizedOnClick = useCallback(onClick, []);
  const memoizedOnDoubleClick = useCallback(onDoubleClick, []);
  
  useMapEvents(map, { 
    onHover: memoizedOnHover, 
    onClick: memoizedOnClick, 
    onDoubleClick: memoizedOnDoubleClick 
  });
  
  const { sourcesRef } = useMapExtent(
    map, 
    [lineData, roadCrosData, semaphoresData], 
    allLayersLoaded
  );

  const handleLayerLoad = useCallback((source) => {
    // Проверяем, что этот источник еще не был загружен
    if (!loadedSourcesRef.current.has(source)) {
      loadedSourcesRef.current.add(source);
      
      if (!sourcesRef.current.includes(source)) {
        sourcesRef.current.push(source);
      }
      
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
});

VectorLayers.displayName = 'VectorLayers';
export default VectorLayers;