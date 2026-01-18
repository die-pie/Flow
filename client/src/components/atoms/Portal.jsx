import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector("#overlays");
    if (!ref.current) {
        // Fallback: Create it if it doesn't exist
        const div = document.createElement('div');
        div.id = 'overlays';
        document.body.appendChild(div);
        ref.current = div;
    }
    setMounted(true);
  }, []);

  return (mounted && ref.current) ? createPortal(children, ref.current) : null;
};

export default Portal;
