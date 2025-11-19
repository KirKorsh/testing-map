import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';
import './MapComponent.css';
import VectorLayers from './layers/VectorLayers';
import Tooltip from '../Tooltip/Tooltip';
import PropertiesPanel from '../PropertiesPanel/PropertiesPanel';
import PanoramaModal from '../PanoramaModal/PanoramaModal';
import { formatCoordinatesForTooltip } from './utils/interactions';
import { lineData, roadCrosData, semaphoresData } from '../../data/index.js';

const MapComponent = () => {
  const mapRef = useRef();
  const [map, setMap] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: [0, 0] });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [panoramaFeature, setPanoramaFeature] = useState(null);
  const [isPanoramaOpen, setIsPanoramaOpen] = useState(false);

  // Обработчики событий
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

  const handleClick = useCallback((feature) => {
    setSelectedFeature(feature);
    console.log('Selected feature:', feature?.getProperties());
  }, []);

  const handleDoubleClick = useCallback((feature) => {
    console.log('Double click on feature:', feature?.getProperties());
    setPanoramaFeature(feature);
    setIsPanoramaOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const handleClosePanorama = useCallback(() => {
    setIsPanoramaOpen(false);
    setPanoramaFeature(null);
  }, []);

  // Инициализация карты
  useEffect(() => {
    const center = fromLonLat([38.97, 45.03]);

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: center,
        zoom: 13
      })
    });

    setMap(initialMap);

    return () => initialMap.setTarget(null);
  }, []);

  return (
    <div className="map-container">
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

      <PropertiesPanel 
        feature={selectedFeature}
        onClose={handleClosePanel}
      />

      <PanoramaModal 
        isOpen={isPanoramaOpen}
        onClose={handleClosePanorama}
        feature={panoramaFeature}
      />
    </div>
  );
};

export default MapComponent;