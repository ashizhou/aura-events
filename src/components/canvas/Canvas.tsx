import React, { useCallback, useEffect, useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useEvent } from '../../context/EventContext';
import { EventBlock } from './EventBlock';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Plus, 
  Grid3X3 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { EventType } from '../../types';

export const Canvas: React.FC = () => {
  const {
    canvasRef,
    canvasZoom,
    canvasPosition,
    handleZoom,
    startDrag,
    drag,
    endDrag,
    resetView,
  } = useCanvas({ minZoom: 0.2, maxZoom: 3 });
  
  const { events, createEvent } = useEvent();
  const [showGrid, setShowGrid] = useState(true);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY, { x: e.clientX, y: e.clientY });
    },
    [handleZoom]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) { // Left mouse button
        const target = e.target as HTMLElement;
        const isEventBlock = target.closest('.event-block');
        
        if (!isEventBlock) {
          startDrag(e.clientX, e.clientY);
        }
      }
    },
    [startDrag]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      drag(e.clientX, e.clientY);
    },
    [drag]
  );

  const handleMouseUp = useCallback(() => {
    endDrag();
  }, [endDrag]);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [handleMouseUp]);

  const handleZoomIn = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      handleZoom(-1, { 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      });
    }
  };

  const handleZoomOut = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      handleZoom(1, { 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      });
    }
  };

  const handleCreateEvent = () => {
    // Calculate new position based on current view
    const x = -canvasPosition.x + 200;
    const y = -canvasPosition.y + 200;
    
    createEvent({
      title: 'New Event',
      type: EventType.CUSTOM,
      canvasPosition: {
        x,
        y,
        scale: 1,
      },
    });
  };

  const canvasStyle = {
    transform: `scale(${canvasZoom}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
    transformOrigin: '0 0',
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-50">
      {/* Canvas controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <ZoomIn size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <ZoomOut size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          aria-label="Reset view"
        >
          <RefreshCw size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          className={showGrid ? 'bg-gray-100' : ''}
          aria-label="Toggle grid"
        >
          <Grid3X3 size={16} />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus size={16} />}
          onClick={handleCreateEvent}
        >
          Add Event
        </Button>
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {/* Grid background */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: `${20 * canvasZoom}px ${20 * canvasZoom}px`,
                transform: `scale(${1/canvasZoom})`,
                transformOrigin: '0 0',
              }}
            />
          </div>
        )}
        
        {/* Canvas content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={canvasStyle}
        >
          <div className="relative w-full h-full pointer-events-auto">
            {events.map((event) => (
              <EventBlock 
                key={event.id}
                event={event}
                onDragStart={(e) => {
                  // Prevent canvas drag when dragging an event block
                  e.stopPropagation();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};