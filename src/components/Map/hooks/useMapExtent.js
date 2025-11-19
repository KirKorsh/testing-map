import { useEffect, useRef } from 'react';
import { getCombinedExtent, isValidExtent, calculateExtentFromData } from '../utils/helpers';

export const useMapExtent = (map, sources, data, allLayersLoaded) => {
  const sourcesRef = useRef([]);

  useEffect(() => {
    if (!map || !allLayersLoaded) return;

    const timer = setTimeout(() => {
      try {
        let combinedExtent = getCombinedExtent(sourcesRef.current);
        
        if (!combinedExtent || !isValidExtent(combinedExtent)) {
          combinedExtent = calculateExtentFromData(...data);
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
  }, [map, allLayersLoaded, data]);

  return { sourcesRef };
};