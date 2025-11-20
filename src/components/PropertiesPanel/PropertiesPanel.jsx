import React, { memo } from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = memo(({ feature, onClose }) => {
  if (!feature) return null;

  const properties = feature.getProperties();
  const geometryType = feature.getGeometry().getType();

  // замена служебных свойств geometry и style
  const { geometry, style, ...displayProperties } = properties;

  // Определяет тип объекта на основе геометрии и свойств
  const getObjectType = () => {
    if (geometryType === 'LineString') return 'Дорога';
    if (geometryType === 'Polygon') return 'Перекрёсток';
    if (geometryType === 'Point') {
      // Для точек проверяем свойства
      if (displayProperties.vertical_order !== undefined || 
          displayProperties.roadid?.includes('r298p0')) {
        return 'Светофор';
      }
      return 'Точка';
    }
    return geometryType;
  };

  const objectType = getObjectType();

  return (
    <div className="properties-panel">
      <div className="properties-panel-header">
        <h3>Свойства объекта</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="properties-panel-content">
        <div className="property-group">
          <h4>Тип объекта</h4>
          <div className="property-item">
            <span className="property-label">Тип:</span>
            <span className="property-value">{objectType}</span>
          </div>
        </div>

        <div className="property-group">
          <h4>Свойства</h4>
          {Object.keys(displayProperties).length > 0 ? (
            Object.entries(displayProperties).map(([key, value]) => (
              <div key={key} className="property-item">
                <span className="property-label">{key}:</span>
                <span className="property-value">
                  {value !== null && value !== undefined ? value.toString() : '—'}
                </span>
              </div>
            ))
          ) : (
            <div className="property-item">
              <span className="property-value">Нет свойств</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PropertiesPanel.displayName = 'PropertiesPanel';
export default PropertiesPanel;