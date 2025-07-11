import React from 'react';
import BaseIcon, { BaseIconProps } from './BaseIcon';

const UserIcon: React.FC<Omit<BaseIconProps, 'children'>> = (props) => {
  return (
    <BaseIcon viewBox="0 0 14 14" size={14} {...props}>
      <path 
        d="M3.10117 11.3391C3.45603 10.503 4.28454 9.91667 5.25 9.91667H8.75C9.71546 9.91667 10.544 10.503 10.8988 11.3391M9.33333 5.54167C9.33333 6.83034 8.28866 7.87501 7 7.87501C5.71133 7.87501 4.66666 6.83034 4.66666 5.54167C4.66666 4.25301 5.71133 3.20834 7 3.20834C8.28866 3.20834 9.33333 4.25301 9.33333 5.54167ZM12.8333 7.00001C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77834 12.8333 1.16666 10.2217 1.16666 7.00001C1.16666 3.77834 3.77834 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77834 12.8333 7.00001Z" 
        stroke={props.stroke || "#3D3D3D"} 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
};

export default UserIcon; 