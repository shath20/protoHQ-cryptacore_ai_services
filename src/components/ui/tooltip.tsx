import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updatePosition = () => {
      if (ref.current && tooltipRef.current && visible) {
        const rect = ref.current.getBoundingClientRect();
        tooltipRef.current.style.top = `${rect.bottom + 5}px`;
        tooltipRef.current.style.left = `${rect.left + rect.width / 2}px`;
        tooltipRef.current.style.transform = 'translateX(-50%)';
      }
    };
    
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [visible]);
  
  return (
    <div className="relative inline-block">
      <div
        ref={ref}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap"
        >
          {content}
        </div>
      )}
    </div>
  );
}