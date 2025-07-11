import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

interface ChevronRightIconProps extends Omit<BaseIconProps, 'children' | 'viewBox'> {
  size?: number;
  fill?: string;
  className?: string;
}

const ChevronRightIcon: React.FC<ChevronRightIconProps> = ({ 
  size = 10,
  fill = "currentColor",
  className 
}) => {
  return (
    <BaseIcon size={size} className={className} viewBox="0 0 10 10">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.45537 2.20541C3.61809 2.04269 3.8819 2.04269 4.04462 2.20541L6.54462 4.70541C6.70734 4.86813 6.70734 5.13195 6.54462 5.29467L4.04462 7.79467C3.8819 7.95739 3.61809 7.95739 3.45537 7.79467C3.29265 7.63195 3.29265 7.36813 3.45537 7.20541L5.66074 5.00004L3.45537 2.79467C3.29265 2.63195 3.29265 2.36813 3.45537 2.20541Z" fill={fill}/>
    </BaseIcon>
  )
}

export default ChevronRightIcon;