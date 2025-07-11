import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

interface ChevronDownIconProps extends Omit<BaseIconProps, 'children' | 'viewBox'> {
  size?: number;
  fill?: string;
  className?: string;
}

const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ 
  size = 12,
  fill = "currentColor",
  className 
}) => {
  return (
    <BaseIcon size={size} className={className} viewBox="0 0 6 5">
      <path 
        d="M6.00005 0.877225C6.00005 0.704439 5.78509 0.597031 5.45699 0.597031L0.53933 0.594696C0.211233 0.594696 4.57764e-05 0.702104 4.57764e-05 0.87489C4.57764e-05 0.968287 0.0679275 1.04534 0.143352 1.14341L2.49659 4.14382C2.65498 4.3423 2.79829 4.40533 2.99816 4.40533C3.19803 4.40533 3.34511 4.3423 3.5035 4.14382L5.85296 1.14341C5.93218 1.04768 6.00005 0.970622 6.00005 0.877225Z" 
        fill={fill}
      />
    </BaseIcon>
  );
};

export default ChevronDownIcon; 