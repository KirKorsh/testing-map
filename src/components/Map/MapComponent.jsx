import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapComponent.css';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    // Инициализация карты
    const map = new Map({
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

    // Очистка при размонтировании компонента
    return () => map.setTarget(null);
  }, []);

  return (
    <div ref={mapRef} className="map-component"></div>
  );
};

export default MapComponent;