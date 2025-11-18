import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapComponent.css';
import VectorLayers from './layers/VectorLayers';
import Tooltip from '../Tooltip/Tooltip';
import { formatCoordinatesForTooltip } from './utils/interactions'; // Именованный импорт

// Импортируем данные
import { lineData, roadCrosData, semaphoresData } from '../../data/index.js';

const MapComponent = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: [0, 0] });
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Обработчик наведения мыши
  const handleHover = useCallback((hoverInfo) => {
    if (!hoverInfo) {
      setTooltip({ visible: false, content: '', position: [0, 0] });
      return;
    }

    const content = formatCoordinatesForTooltip(hoverInfo.coordinates);
    setTooltip({
      visible: true,
      content,
      position: hoverInfo.pixel
    });
  }, []);

  // Обработчик клика
  const handleClick = useCallback((feature) => {
    setSelectedFeature(feature);
    console.log('Selected feature:', feature?.getProperties());
  }, []);

  // Обработчик двойного клика
  const handleDoubleClick = useCallback((feature) => {
    console.log('Double click on feature:', feature?.getProperties());
    // Здесь будет открытие панорамы
  }, []);

  useEffect(() => {
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
          onHover={handleHover}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
        />
      )}
      
      <Tooltip 
        position={tooltip.position}
        content={tooltip.content}
        visible={tooltip.visible}
      />
    </div>
  );
};

export default MapComponent;