import React from 'react';
import './PropertiesPanel.css';

const PropertiesPanel = ({ feature, onClose }) => {
  if (!feature) return null;

  const properties = feature.getProperties();
  const geometryType = feature.getGeometry().getType();

  // Убираем служебные свойства geometry и style
  const { geometry, style, ...displayProperties } = properties;

  return (
    <div className="properties-panel">
      <div className="properties-panel-header">
        <h3>Свойства объекта</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="properties-panel-content">
        <div className="property-group">
          <h4>Геометрия</h4>
          <div className="property-item">
            <span className="property-label">Тип:</span>
            <span className="property-value">{geometryType}</span>
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
};

export default PropertiesPanel;