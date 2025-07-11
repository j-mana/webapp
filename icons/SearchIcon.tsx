import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

interface SearchIconProps extends Omit<BaseIconProps, 'children' | 'viewBox'> {
  size?: number;
  stroke?: string;
  className?: string;
}

const SearchIcon: React.FC<SearchIconProps> = ({ 
  size = 14,
  stroke = "currentColor",
  className 
}) => {
  return (
    <BaseIcon size={size} className={className} viewBox="0 0 14 14">
      <path 
        d="M12.25 12.25L9.7125 9.7125M11.0833 6.41667C11.0833 8.994 8.994 11.0833 6.41667 11.0833C3.83934 11.0833 1.75 8.994 1.75 6.41667C1.75 3.83934 3.83934 1.75 6.41667 1.75C8.994 1.75 11.0833 3.83934 11.0833 6.41667Z" 
        stroke={stroke} 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </BaseIcon>
  );
};

export default SearchIcon; 