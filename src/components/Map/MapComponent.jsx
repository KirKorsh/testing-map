import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapComponent.css';
import VectorLayers from './layers/VectorLayers';

// Импортируем данные
import { lineData, roadCrosData, semaphoresData } from '../../data/index.js';

const MapComponent = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log('Data loaded:', {
      lineFeatures: lineData?.features?.length,
      roadCrossFeatures: roadCrosData?.features?.length,
      semaphoresFeatures: semaphoresData?.features?.length
    });

    // Инициализация карты
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

    setMap(initialMap);

    return () => initialMap.setTarget(null);
  }, []);

  return (
    <div ref={mapRef} className="map-component">
      {map && (
        <VectorLayers 
          map={map}
          lineData={lineData}
          roadCrosData={roadCrosData}
          semaphoresData={semaphoresData}
        />
      )}
    </div>
  );
};

export default MapComponent;