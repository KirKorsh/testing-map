import React, { useEffect, useRef, useCallback } from 'react';
import RoadsLayer from '../features/RoadsLayer';
import CrossroadsLayer from '../features/CrossroadsLayer';
import SemaphoresLayer from '../features/SemaphoresLayer';
import useLayersLoad from '../hooks/useLayersLoad';
import { getCombinedExtent, isValidExtent, calculateExtentFromData } from '../utils/helpers';

const VectorLayers = ({ map, lineData, roadCrosData, semaphoresData }) => {
  const sourcesRef = useRef([]);
  const { onLayerLoad, allLayersLoaded } = useLayersLoad(3);

  const handleLayerLoad = useCallback((source) => {
    sourcesRef.current.push(source);
    onLayerLoad();
  }, [onLayerLoad]);

  // Приближение карты после загрузки всех слоев
  useEffect(() => {
    if (!map || !allLayersLoaded) return;

    const timer = setTimeout(() => {
      try {
        let combinedExtent = getCombinedExtent(sourcesRef.current);
        
        console.log('All layers loaded, fitting to extent:', combinedExtent);
        console.log('Sources count:', sourcesRef.current.length);
        
        // Если не удалось получить extent из источников, вычисляем из исходных данных
        if (!combinedExtent || !isValidExtent(combinedExtent)) {
          console.log('Trying to calculate extent from raw data...');
          combinedExtent = calculateExtentFromData(lineData, roadCrosData, semaphoresData);
        }
        
        if (combinedExtent && isValidExtent(combinedExtent)) {
          console.log('Fitting to valid extent:', combinedExtent);
          map.getView().fit(combinedExtent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 18
          });
        } else {
          console.error('Cannot fit map: no valid extent found from any method');
        }
      } catch (error) {
        console.error('Error fitting map view:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [map, allLayersLoaded, lineData, roadCrosData, semaphoresData]);

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