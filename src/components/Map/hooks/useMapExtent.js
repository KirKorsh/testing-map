import { useEffect, useRef } from 'react';
import { getCombinedExtent, isValidExtent, calculateExtentFromData } from '../utils/helpers';
export const useMapExtent = (map, sources, data, allLayersLoaded) => {
  const sourcesRef = useRef([]);

  useEffect(() => {
    if (!map || !allLayersLoaded) {
      console.log('Map not ready or layers not loaded');
      return;
    }

    console.log('Setting map extent, sources:', sourcesRef.current);

    const timer = setTimeout(() => {
      try {
        let combinedExtent = getCombinedExtent(sourcesRef.current);
        
        console.log('Combined extent from sources:', combinedExtent);
        
        if (!combinedExtent || !isValidExtent(combinedExtent)) {
          console.log('Calculating extent from raw data');
          combinedExtent = calculateExtentFromData(...data);
          console.log('Calculated extent from data:', combinedExtent);
        }
        
        if (combinedExtent && isValidExtent(combinedExtent)) {
          console.log('Fitting map to extent:', combinedExtent);
          map.getView().fit(combinedExtent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 18
          });
        } else {
          console.warn('No valid extent found, using default view');
          // Установите дефолтный вид на координаты из ваших данных
          map.getView().setCenter(fromLonLat([38.97, 45.03]));
          map.getView().setZoom(15);
        }
      } catch (error) {
        console.error('Error fitting map view:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [map, allLayersLoaded, data]);

  return { sourcesRef };
};