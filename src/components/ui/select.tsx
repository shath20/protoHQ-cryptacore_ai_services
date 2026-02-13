import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect: (value: string) => void;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            value, 
            onValueChange, 
            open, 
            setOpen,
            onSelect: (val: string) => {
              onValueChange(val);
              setOpen(false);
            }
          } as any);
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ children, className = '', ...props }: SelectTriggerProps & { open?: boolean; setOpen?: (open: boolean) => void }) {
  const { open, setOpen } = props as any;
  
  return (
    <button
      type="button"
      onClick={() => setOpen?.(!open)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectContent({ children, open, onClose }: SelectContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);
  
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white text-gray-950 shadow-md"
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, onSelect }: SelectItemProps) {
  return (
    <div
      className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder, value }: { placeholder?: string; value?: string }) {
  return <span>{value || placeholder}</span>;
}