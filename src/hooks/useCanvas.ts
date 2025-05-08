import { useCallback, useRef, useState } from 'react';
import { useUI } from '../context/UIContext';

export interface Position {
  x: number;
  y: number;
}

interface UseCanvasOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomSpeed?: number;
}

export const useCanvas = (options: UseCanvasOptions = {}) => {
  const {
    minZoom = 0.1,
    maxZoom = 5,
    zoomSpeed = 0.1,
  } = options;

  const { canvasZoom, setCanvasZoom, canvasPosition, setCanvasPosition } = useUI();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  const lastPosition = useRef<Position>({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const handleZoom = useCallback((deltaY: number, point: Position) => {
    // Calculate new zoom level
    const zoomDelta = deltaY > 0 ? -zoomSpeed : zoomSpeed;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, canvasZoom + zoomDelta));
    
    if (newZoom !== canvasZoom) {
      // Calculate new position to zoom towards mouse position
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (canvasRect) {
        const mouseX = point.x - canvasRect.left;
        const mouseY = point.y - canvasRect.top;
        
        const canvasCenterX = canvasRect.width / 2;
        const canvasCenterY = canvasRect.height / 2;
        
        const dx = (mouseX - canvasCenterX) / canvasZoom;
        const dy = (mouseY - canvasCenterY) / canvasZoom;
        
        const zoomFactor = newZoom / canvasZoom;
        
        const newX = canvasPosition.x - dx * (zoomFactor - 1);
        const newY = canvasPosition.y - dy * (zoomFactor - 1);
        
        setCanvasZoom(newZoom);
        setCanvasPosition({ x: newX, y: newY });
      }
    }
  }, [canvasZoom, canvasPosition, minZoom, maxZoom, zoomSpeed, setCanvasZoom, setCanvasPosition]);

  const startDrag = useCallback((x: number, y: number) => {
    isDragging.current = true;
    lastPosition.current = { x, y };
  }, []);

  const drag = useCallback((x: number, y: number) => {
    if (isDragging.current) {
      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      
      setCanvasPosition({
        x: canvasPosition.x + dx / canvasZoom,
        y: canvasPosition.y + dy / canvasZoom,
      });
      
      lastPosition.current = { x, y };
    }
  }, [canvasPosition, canvasZoom, setCanvasPosition]);

  const endDrag = useCallback(() => {
    isDragging.current = false;
  }, []);

  const resetView = useCallback(() => {
    setCanvasZoom(1);
    setCanvasPosition({ x: 0, y: 0 });
  }, [setCanvasZoom, setCanvasPosition]);

  const centerOn = useCallback((elementPosition: Position) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCanvasPosition({
        x: -elementPosition.x + rect.width / (2 * canvasZoom),
        y: -elementPosition.y + rect.height / (2 * canvasZoom),
      });
    }
  }, [canvasZoom, setCanvasPosition]);

  return {
    canvasRef,
    canvasZoom,
    canvasPosition,
    handleZoom,
    startDrag,
    drag,
    endDrag,
    resetView,
    centerOn,
    hoveredElement,
    setHoveredElement,
    selectedElement,
    setSelectedElement,
  };
};