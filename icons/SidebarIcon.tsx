import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

interface SidebarIconProps extends Omit<BaseIconProps, 'children' | 'viewBox'> {
  size?: number;
  fill?: string;
  className?: string;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ size, className, stroke, fill }) => {
  return (
    <BaseIcon size={size} className={className} viewBox="0 0 14 14">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.33333 10.6667L3.33333 3.33333M4.2 1H9.8C10.9201 1 11.4802 1 11.908 1.21799C12.2843 1.40973 12.5903 1.71569 12.782 2.09202C13 2.51984 13 3.0799 13 4.2V9.8C13 10.9201 13 11.4802 12.782 11.908C12.5903 12.2843 12.2843 12.5903 11.908 12.782C11.4802 13 10.9201 13 9.8 13H4.2C3.07989 13 2.51984 13 2.09202 12.782C1.71569 12.5903 1.40973 12.2843 1.21799 11.908C1 11.4802 1 10.9201 1 9.8V4.2C1 3.07989 1 2.51984 1.21799 2.09202C1.40973 1.71569 1.71569 1.40973 2.09202 1.21799C2.51984 1 3.0799 1 4.2 1Z" stroke={"currentColor"} strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </BaseIcon>
  );
};

export default SidebarIcon;
