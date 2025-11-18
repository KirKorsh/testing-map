import { useState, useEffect, useCallback } from 'react';

const useLayersLoad = (layerCount) => {
  const [loadedLayers, setLoadedLayers] = useState(0);
  const [allLayersLoaded, setAllLayersLoaded] = useState(false);

  const onLayerLoad = useCallback(() => {
    setLoadedLayers(prev => {
      const newCount = prev + 1;
      console.log(`Layer loaded: ${newCount}/${layerCount}`);
      return newCount;
    });
  }, [layerCount]);

  useEffect(() => {
    if (loadedLayers >= layerCount && !allLayersLoaded) {
      console.log('All layers loaded!');
      setAllLayersLoaded(true);
    }
  }, [loadedLayers, layerCount, allLayersLoaded]);

  const reset = useCallback(() => {
    setLoadedLayers(0);
    setAllLayersLoaded(false);
  }, []);

  return { onLayerLoad, allLayersLoaded, loadedLayers, reset };
};

export default useLayersLoad;