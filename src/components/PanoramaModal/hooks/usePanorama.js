import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { panoramaImage } from '../../../data';

export const usePanorama = (isOpen) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const sphereRef = useRef(null);
  
  const isDraggingRef = useRef(false);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const animationRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(true);

  const updateScene = useCallback(() => {
    if (sphereRef.current && cameraRef.current) {
      sphereRef.current.rotation.y = rotationRef.current.y;
      sphereRef.current.rotation.x = rotationRef.current.x;
      cameraRef.current.zoom = zoomRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  const animate = useCallback(() => {
    animationRef.current = requestAnimationFrame(animate);
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    lastMousePositionRef.current = { x: e.clientX, y: e.clientY };
    
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
    
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * 0.001;
    zoomRef.current = Math.max(0.5, Math.min(3, zoomRef.current - delta));
    
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  const handleReset = useCallback(() => {
    rotationRef.current = { x: 0, y: 0 };
    zoomRef.current = 1;
    updateScene();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [updateScene]);

  // Инициализация Three.js сцены
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(5, 60, 40);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    setIsLoading(true);
    
    textureLoader.load(
      panoramaImage, // Теперь используем импорт из data/index.js
      (texture) => {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        setIsLoading(false);
        animate();
      },
      undefined,
      (error) => {
        console.error('Ошибка загрузки панорамы:', error);
        setIsLoading(false);
        
        // Fallback текстура
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
        const material = new THREE.MeshBasicMaterial({ map: generatedTexture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        sphereRef.current = sphere;
        animate();
      }
    );

    camera.position.set(0, 0, 0.1);

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

  return {
    canvasRef,
    isLoading,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    handleReset
  };
};