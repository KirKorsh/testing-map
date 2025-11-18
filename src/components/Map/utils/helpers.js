import { transform, transformExtent } from 'ol/proj';

// Преобразование координат из EPSG:4326 в EPSG:3857
export const transformCoordinate = (coordinate) => {
  return transform(coordinate, 'EPSG:4326', 'EPSG:3857');
};

// Проверка валидности extent
export const isValidExtent = (extent) => {
  if (!extent || extent.length !== 4) return false;
  
  const [minX, minY, maxX, maxY] = extent;
  
  return [minX, minY, maxX, maxY].every(coord => 
    coord !== Infinity && 
    coord !== -Infinity && 
    !isNaN(coord) &&
    Math.abs(coord) < 20037508.34 * 2
  ) && Math.abs(minX - maxX) > 1 &&
      Math.abs(minY - maxY) > 1;
};

// Получение extent из всех слоев
export const getCombinedExtent = (sources) => {
  let combinedExtent = null;
  
  sources.forEach(source => {
    if (source && source.getExtent) {
      try {
        const extent = source.getExtent();
        console.log('Source extent details:', {
          minX: extent[0],
          minY: extent[1],
          maxX: extent[2],
          maxY: extent[3],
          width: extent[2] - extent[0],
          height: extent[3] - extent[1],
          isValid: isValidExtent(extent)
        });
        
        if (isValidExtent(extent)) {
          combinedExtent = combinedExtent ? 
            combinedExtent.concat(extent) : 
            extent;
        }
      } catch (error) {
        console.warn('Error getting extent from source:', error);
      }
    }
  });
  
  console.log('Final combined extent:', combinedExtent);
  return isValidExtent(combinedExtent) ? combinedExtent : null;
};

// Вычисление extent из исходных данных
export const calculateExtentFromData = (lineData, roadCrosData, semaphoresData) => {
  if (!lineData || !lineData.features || lineData.features.length === 0) {
    return null;
  }

  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  
  const processCoordinates = (coords) => {
    if (Array.isArray(coords[0])) {
      coords.forEach(coord => processCoordinates(coord));
    } else if (coords.length >= 2) {
      const lon = coords[0];
      const lat = coords[1];
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  };

  const processData = (data) => {
    if (!data || !data.features) return;
    
    data.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        processCoordinates(feature.geometry.coordinates);
      }
    });
  };

  processData(lineData);
  processData(roadCrosData);
  processData(semaphoresData);

  if (minLon === Infinity || maxLon === -Infinity || minLat === Infinity || maxLat === -Infinity) {
    return null;
  }

  const extent4326 = [minLon, minLat, maxLon, maxLat];
  const extent3857 = transformExtent(extent4326, 'EPSG:4326', 'EPSG:3857');
  
  console.log('Calculated extent from raw data:', {
    original: extent4326,
    transformed: extent3857
  });
  
  return extent3857;
};