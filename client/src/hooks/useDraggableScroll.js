import { useEffect, useRef } from 'react';

/**
 * useDraggableScroll
 * Enables "Drag-to-Scroll" functionality on a container, mimicking mobile touch behavior.
 * @param {React.RefObject} containerRef - Reference to the scrollable DOM element
 */
export const useDraggableScroll = (containerRef) => {
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      // Capture initial state
      startY.current = e.clientY;
      startScrollTop.current = container.scrollTop;
      
      // Visual feedback
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none'; // Prevent text selection
    };

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      
      e.preventDefault(); // Prevent native selection/drag events
      
      // Calculate distance moved
      const currentY = e.clientY;
      const deltaY = currentY - startY.current;
      
      // Update Scroll (Inverted: Drag Down -> Scroll Up)
      container.scrollTop = startScrollTop.current - deltaY;
    };

    const stopDragging = () => {
      if (isDragging.current) {
        isDragging.current = false;
        container.style.cursor = 'grab';
        container.style.removeProperty('user-select');
      }
    };

    // Attach events
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove); // Window allows dragging outside container
    window.addEventListener('mouseup', stopDragging);
    
    // Initial Cursor
    container.style.cursor = 'grab';

    return () => {
      // Cleanup
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      container.style.cursor = '';
    };
  }, [containerRef]);
};
