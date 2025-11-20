import { useEffect, useState, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

// Кэш для уже созданных слоев
const layerCache = new Map();

const useVectorLayer = ({ 
  map, 
  data, 
  style, 
  onLoad, 
  dataProjection = 'EPSG:4326', 
  featureProjection = 'EPSG:3857' 
}) => {
  const [layer, setLayer] = useState(null);
  const [source, setSource] = useState(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!map || !data || hasLoadedRef.current) return;

    const cacheKey = JSON.stringify({
      dataLength: data?.features?.length,
      dataProjection,
      featureProjection
    });

    let vectorLayer, vectorSource;

    // Проверяем кэш
    if (layerCache.has(cacheKey)) {
      const cached = layerCache.get(cacheKey);
      vectorLayer = cached.layer;
      vectorSource = cached.source;
      map.addLayer(vectorLayer);
    } else {
      // Создаем новый слой
      vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(data, {
          featureProjection,
          dataProjection
        })
      });

      vectorLayer = new VectorLayer({
        source: vectorSource,
        style
      });

      map.addLayer(vectorLayer);
      // Сохраняем в кэш
      layerCache.set(cacheKey, { layer: vectorLayer, source: vectorSource });
    }

    setLayer(vectorLayer);
    setSource(vectorSource);
    hasLoadedRef.current = true;

    if (onLoad) {
      onLoad(vectorSource);
    }

    return () => {
      // Не удаляем слой при демонтировании, только при полной размонтировке
    };
  }, [map, data, style, onLoad, dataProjection, featureProjection]);

  return { layer, source };
};

export default useVectorLayer;