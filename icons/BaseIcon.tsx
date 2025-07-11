import React from 'react';

export interface BaseIconProps {
  size?: number;
  fill?: string;
  stroke?: string;
  className?: string;
  viewBox?: string;
  children: React.ReactNode;
}

const BaseIcon: React.FC<BaseIconProps> = ({ 
  size = 12,
  fill,
  stroke,
  className,
  viewBox = "0 0 12 12",
  children 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={viewBox} 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {children}
    </svg>
  );
};

export default BaseIcon; 