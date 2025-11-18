import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import './PanoramaModal.css';

// Импортируем панораму
import panoramaImage from '../../data/panorama.jpg';

const PanoramaModal = ({ isOpen, onClose, feature }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  
  // Используем useRef для значений, которые часто меняются
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const animationRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);

  // Функция для обновления рендеринга
  const updateScene = useCallback(() => {
    if (sphereRef.current && cameraRef.current) {
      sphereRef.current.rotation.y = rotationRef.current.y;
      sphereRef.current.rotation.x = rotationRef.current.x;
      cameraRef.current.zoom = zoomRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  // Анимационный цикл
  const animate = useCallback(() => {
    animationRef.current = requestAnimationFrame(animate);
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    // Инициализация Three.js сцены
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Создание камеры
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;

    // Создание рендерера
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Создание сферы для панорамы
    const geometry = new THREE.SphereGeometry(5, 60, 40); // Уменьшил радиус для лучшего управления
    geometry.scale(-1, 1, 1); // Инвертируем для корректного отображения внутри сферы

    // Создание текстуры из импортированного изображения
    const textureLoader = new THREE.TextureLoader();
    setIsLoading(true);
    
    textureLoader.load(
      panoramaImage,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoading(false);
        
        // Запускаем анимацию после загрузки текстуры
        animate();
      },
      undefined,
      (error) => {
        console.error('Ошибка загрузки панорамы:', error);
        setIsLoading(false);
        
        // Создаем fallback текстуру
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.2, '#4ecdc4');
        gradient.addColorStop(0.4, '#45b7d1');
        gradient.addColorStop(0.6, '#96ceb4');
        gradient.addColorStop(0.8, '#feca57');
        gradient.addColorStop(1, '#ff9ff3');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = 'bold 80px Arial';
        context.textAlign = 'center';
        context.fillText('ПАНОРАМА', canvas.width / 2, canvas.height / 2);
        context.font = '40px Arial';
        context.fillText('Файл не найден', canvas.width / 2, canvas.height / 2 + 100);

        const generatedTexture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
          map: generatedTexture
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        
        // Запускаем анимацию с fallback
        animate();
      }
    );

    // Настройка камеры
    camera.position.set(0, 0, 0.1);

    // Настройка рендерера
    const updateSize = () => {
      const container = canvasRef.current.parentElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    // Очистка
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', updateSize);
      if (renderer) {
        renderer.dispose();
      }
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [isOpen, animate]);

  // Обработчики мыши для вращения
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Блокируем курсор
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const deltaX = e.clientX - lastMousePositionRef.current.x;
    const deltaY = e.clientY - lastMousePositionRef.current.y;

    rotationRef.current = {
      x: Math.max(-Math.PI/2, Math.min(Math.PI/2, rotationRef.current.x + deltaY * 0.01)),
      y: rotationRef.current.y + deltaX * 0.01
    };

    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    
    // Принудительное обновление сцены при движении
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    
    // Восстанавливаем курсор
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  // Обработчик колеса мыши для zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    zoomRef.current = Math.max(0.5, Math.min(3, zoomRef.current - delta));
    
    // Принудительное обновление сцены при зуме
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  // Сброс камеры в исходное положение
  const handleReset = useCallback(() => {
    rotationRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  // Добавляем обработчики событий напрямую к DOM элементам
  useEffect(() => {
    if (!isOpen) return;

    const container = canvasRef.current?.parentElement;
    if (!container) return;

    // Добавляем обработчики с passive: false
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
  }, [isOpen, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

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
              ×
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