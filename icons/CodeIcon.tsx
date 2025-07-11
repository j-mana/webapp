import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

interface CodeIconProps extends Omit<BaseIconProps, 'children' | 'viewBox'> {
  size?: number;
  stroke?: string;
  className?: string;
}

const CodeIcon: React.FC<CodeIconProps> = ({ 
  size = 14,
  stroke = "currentColor",
  className 
}) => {
  return (
    <BaseIcon size={size} className={className} viewBox="0 0 14 14">
      <path 
        d="M8.16667 9.91667L9.91667 8.16667L8.16667 6.41667M5.83333 4.08333L4.08333 5.83333L5.83333 7.58333M4.55 12.25H9.45C10.4301 12.25 10.9201 12.25 11.2945 12.0593C11.6238 11.8915 11.8915 11.6238 12.0593 11.2945C12.25 10.9201 12.25 10.4301 12.25 9.45V4.55C12.25 3.56991 12.25 3.07986 12.0593 2.70552C11.8915 2.37623 11.6238 2.10852 11.2945 1.94074C10.9201 1.75 10.4301 1.75 9.45 1.75H4.55C3.56991 1.75 3.07986 1.75 2.70552 1.94074C2.37623 2.10852 2.10852 2.37623 1.94074 2.70552C1.75 3.07986 1.75 3.56991 1.75 4.55V9.45C1.75 10.4301 1.75 10.9201 1.94074 11.2945C2.10852 11.6238 2.37623 11.8915 2.70552 12.0593C3.07986 12.25 3.56991 12.25 4.55 12.25Z" 
        stroke={stroke} 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </BaseIcon>
  );
};

export default CodeIcon; 