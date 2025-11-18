import React, { useEffect, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { semaphoreStyle } from '../utils/styles';

const SemaphoresLayer = ({ map, data, onLoad }) => {
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    if (!map || !data) return;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
      })
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: semaphoreStyle
    });

    map.addLayer(vectorLayer);
    setLayer(vectorLayer);

    // Немедленное уведомление о загрузке слоя
    if (onLoad) {
      onLoad(vectorSource);
    }

    return () => {
      if (map && vectorLayer) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, data, onLoad]);

  return null;
};

export default SemaphoresLayer;