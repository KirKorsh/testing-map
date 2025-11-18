import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol/ol.css';
import './MapComponent.css';

// Импортируем данные через относительные пути
import { lineData, roadCrosData, semaphoresData } from '../../data/index.js';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    // Стили для разных типов объектов
    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3
      })
    });

    const roadCrossStyle = new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2
      }),
      fill: new Fill({
        color: 'rgba(255, 0, 0, 0.1)'
      })
    });

    const semaphoreStyle = new Style({
      image: new Circle({
        radius: 6,
        fill: new Fill({
          color: 'green'
        }),
        stroke: new Stroke({
          color: 'white',
          width: 2
        })
      })
    });

    // Создаем источники данных
    const lineSource = new VectorSource({
      features: new GeoJSON().readFeatures(lineData, {
        featureProjection: 'EPSG:3857'
      })
    });

    const roadCrossSource = new VectorSource({
      features: new GeoJSON().readFeatures(roadCrosData, {
        featureProjection: 'EPSG:3857'
      })
    });

    const semaphoresSource = new VectorSource({
      features: new GeoJSON().readFeatures(semaphoresData, {
        featureProjection: 'EPSG:3857'
      })
    });

    // Создаем векторные слои
    const lineLayer = new VectorLayer({
      source: lineSource,
      style: lineStyle
    });

    const roadCrossLayer = new VectorLayer({
      source: roadCrossSource,
      style: roadCrossStyle
    });

    const semaphoresLayer = new VectorLayer({
      source: semaphoresSource,
      style: semaphoreStyle
    });

    // Инициализация карты
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        lineLayer,
        roadCrossLayer,
        semaphoresLayer
      ],
      view: new View({
        center: [4338000, 5620000],
        zoom: 14
      })
    });

    // Автоматическое приближение ко всем данным
    const extent = lineSource.getExtent().concat(
      roadCrossSource.getExtent()
    ).concat(
      semaphoresSource.getExtent()
    );
    
    map.getView().fit(extent, {
      padding: [50, 50, 50, 50],
      duration: 1000
    });

    // Очистка при размонтировании компонента
    return () => map.setTarget(null);
  }, []);

  return (
    <div ref={mapRef} className="map-component"></div>
  );
};

export default MapComponent;