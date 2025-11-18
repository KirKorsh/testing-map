import { Style, Stroke, Fill, Circle } from 'ol/style';

// Стили для подсветки при наведении
export const hoverStyle = {
  line: new Style({
    stroke: new Stroke({
      color: 'cyan',
      width: 5
    })
  }),
  
  polygon: new Style({
    stroke: new Stroke({
      color: 'cyan',
      width: 3
    }),
    fill: new Fill({
      color: 'rgba(0, 255, 255, 0.1)'
    })
  }),
  
  point: new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({
        color: 'cyan'
      }),
      stroke: new Stroke({
        color: 'white',
        width: 2
      })
    })
  })
};

// Функция для создания обработчиков событий
export const createEventHandlers = (onHover, onClick, onDoubleClick) => {
  let hoveredFeature = null;
  let clickTimeout = null;

  const handlePointerMove = (event) => {
    const feature = event.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    // Убираем подсветку с предыдущего объекта
    if (hoveredFeature && hoveredFeature !== feature) {
      hoveredFeature.setStyle(null);
      hoveredFeature = null;
      if (onHover) onHover(null);
    }
    
    // Подсвечиваем новый объект
    if (feature && feature !== hoveredFeature) {
      applyHoverStyle(feature);
      hoveredFeature = feature;
      
      // Получаем координаты для тултипа
      const geometry = feature.getGeometry();
      let coordinates = null;
      
      switch (geometry.getType()) {
        case 'Point':
          coordinates = geometry.getCoordinates();
          break;
        case 'LineString':
          // Для линии берем ближайшую точку к курсору
          coordinates = event.coordinate;
          break;
        case 'Polygon':
          // Для полигона берем внутреннюю точку
          coordinates = geometry.getInteriorPoint().getCoordinates();
          break;
        default:
          coordinates = event.coordinate;
      }
      
      if (onHover) onHover({
        feature,
        coordinates,
        pixel: event.pixel
      });
    }
  };

  const handleClick = (event) => {
    const feature = event.map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    if (feature) {
      // Проверяем двойной клик
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        if (onDoubleClick) onDoubleClick(feature);
      } else {
        clickTimeout = setTimeout(() => {
          clickTimeout = null;
          if (onClick) onClick(feature);
        }, 250);
      }
    } else {
      // Клик вне объекта - скрываем свойства
      if (onClick) onClick(null);
    }
  };

  const applyHoverStyle = (feature) => {
    const geometryType = feature.getGeometry().getType();
    let style = null;
    
    switch (geometryType) {
      case 'LineString':
        style = hoverStyle.line;
        break;
      case 'Polygon':
        style = hoverStyle.polygon;
        break;
      case 'Point':
        style = hoverStyle.point;
        break;
      default:
        style = hoverStyle.point;
    }
    
    feature.setStyle(style);
  };

  const clearHover = () => {
    if (hoveredFeature) {
      hoveredFeature.setStyle(null);
      hoveredFeature = null;
    }
    if (onHover) onHover(null);
  };

  return {
    handlePointerMove,
    handleClick,
    clearHover
  };
};

// Форматирование координат для тултипа
export const formatCoordinatesForTooltip = (coordinates, projection = 'EPSG:3857') => {
  if (!coordinates) return '';
  
  const [x, y] = coordinates;
  return `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}`;
};