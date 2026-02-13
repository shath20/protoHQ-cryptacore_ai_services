import React from 'react';

interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  children?: React.ReactNode;
}

export function RadioGroup({ value, onValueChange, children }: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            selectedValue: value,
            onChange: onValueChange
          } as any);
        }
        return child;
      })}
    </div>
  );
}

export function RadioGroupItem({ value, id, children, selectedValue, onChange }: RadioGroupItemProps & { selectedValue?: string; onChange?: (value: string) => void }) {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        value={value}
        checked={selectedValue === value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      {children && <label htmlFor={id} className="text-sm font-medium">{children}</label>}
    </div>
  );
}