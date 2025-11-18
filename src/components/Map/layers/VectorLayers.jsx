import React, { useEffect, useRef, useCallback } from 'react';
import RoadsLayer from '../features/RoadsLayer';
import CrossroadsLayer from '../features/CrossroadsLayer';
import SemaphoresLayer from '../features/SemaphoresLayer';
import useLayersLoad from '../hooks/useLayersLoad';
import { getCombinedExtent, isValidExtent, calculateExtentFromData } from '../utils/helpers';
import { createEventHandlers } from '../utils/interactions'; // Именованный импорт

const VectorLayers = ({ map, lineData, roadCrosData, semaphoresData, onHover, onClick, onDoubleClick }) => {
  const sourcesRef = useRef([]);
  const { onLayerLoad, allLayersLoaded } = useLayersLoad(3);

  const handleLayerLoad = useCallback((source) => {
    if (!sourcesRef.current.includes(source)) {
      sourcesRef.current.push(source);
      onLayerLoad();
    }
  }, [onLayerLoad]);

  // Инициализация обработчиков событий
  useEffect(() => {
    if (!map) return;

    const eventHandlers = createEventHandlers(onHover, onClick, onDoubleClick);

    // Добавляем обработчики на карту
    map.on('pointermove', eventHandlers.handlePointerMove);
    map.on('click', eventHandlers.handleClick);

    // Очистка при размонтировании
    return () => {
      map.un('pointermove', eventHandlers.handlePointerMove);
      map.un('click', eventHandlers.handleClick);
      eventHandlers.clearHover();
    };
  }, [map, onHover, onClick, onDoubleClick]);

  // Единый эффект для фита карты после загрузки всех слоев
  useEffect(() => {
    if (!map || !allLayersLoaded) return;

    const timer = setTimeout(() => {
      try {
        let combinedExtent = getCombinedExtent(sourcesRef.current);
        
        if (!combinedExtent || !isValidExtent(combinedExtent)) {
          combinedExtent = calculateExtentFromData(lineData, roadCrosData, semaphoresData);
        }
        
        if (combinedExtent && isValidExtent(combinedExtent)) {
          map.getView().fit(combinedExtent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 18
          });
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