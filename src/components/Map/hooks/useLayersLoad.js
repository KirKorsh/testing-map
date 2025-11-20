import { useState, useEffect, useCallback } from 'react';

const useLayersLoad = (expectedLayerCount) => {
  const [loadedLayers, setLoadedLayers] = useState(0);
  const [allLayersLoaded, setAllLayersLoaded] = useState(false);

  const onLayerLoad = useCallback(() => {
    setLoadedLayers(prev => {
      const newCount = prev + 1;
      console.log(`Layer loaded: ${newCount}/${expectedLayerCount}`);
      return newCount;
    });
  }, [expectedLayerCount]);

  useEffect(() => {
    if (loadedLayers >= expectedLayerCount && !allLayersLoaded) {
      console.log('All layers loaded!');
      setAllLayersLoaded(true);
    }
  }, [loadedLayers, expectedLayerCount, allLayersLoaded]);

  const reset = useCallback(() => {
    setLoadedLayers(0);
    setAllLayersLoaded(false);
  }, []);

  return { onLayerLoad, allLayersLoaded, loadedLayers, reset };
};

export default useLayersLoad;