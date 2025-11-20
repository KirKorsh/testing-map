import React, { useEffect } from 'react';
import { usePanorama } from './hooks/usePanorama';
import './PanoramaModal.css';

const PanoramaModal = ({ isOpen, onClose, feature }) => {
  const {
    canvasRef,
    isLoading,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleReset
  } = usePanorama(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const container = canvasRef.current?.parentElement;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isOpen, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, canvasRef]);

  if (!isOpen) return null;

  return (
    <div className="panorama-modal-overlay">
      <div className="panorama-modal">
        <div className="panorama-modal-header">
          <h3>Панорама объекта</h3>
          <div className="panorama-controls">
            <button 
              className="control-button reset-button"
              onClick={handleReset}
              title="Сбросить вид"
            >
              ↻
            </button>
            <button 
              className="control-button close-button"
              onClick={onClose}
              title="Закрыть"
            >
              x
            </button>
          </div>
        </div>

        <div className="panorama-info">
          {feature && (
            <div className="feature-info">
              <strong>Объект:</strong> {feature.getGeometry().getType()}
              {feature.get('name') && ` - ${feature.get('name')}`}
              {feature.get('roadid') && ` (${feature.get('roadid')})`}
            </div>
          )}
          <div className="panorama-instructions">
            Перетаскивайте для вращения, колесо мыши для приближения/отдаления
            {isLoading && ' (Загрузка панорамы...)'}
          </div>
        </div>

        <div className="panorama-container">
          <canvas ref={canvasRef} className="panorama-canvas" />
          {isLoading && (
            <div className="panorama-loading">
              <div className="loading-spinner"></div>
              <p>Загрузка панорамы...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanoramaModal;