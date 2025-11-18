import { useEffect, useState } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

const useVectorLayer = ({ map, data, style, onLoad, dataProjection = 'EPSG:4326', featureProjection = 'EPSG:3857' }) => {
  const [layer, setLayer] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (!map || !data) return;

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(data, {
        featureProjection,
        dataProjection
      })
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style
    });

    map.addLayer(vectorLayer);
    setLayer(vectorLayer);
    setSource(vectorSource);

    if (onLoad) {
      onLoad(vectorSource);
    }

    return () => {
      if (map && vectorLayer) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, data, style, onLoad, dataProjection, featureProjection]);

  return { layer, source };
};

export default useVectorLayer;