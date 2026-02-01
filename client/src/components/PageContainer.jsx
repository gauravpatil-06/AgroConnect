import React from 'react';

/**
 * Standardized Page Container for AgroConnect
 * Small Devices (Mobile): 12px padding
 * Medium & Large Devices (Tablets/Desktops): 20px padding
 * Max-Width: 1440px
 * Centered: mx-auto
 */
const PageContainer = ({ children, className = "", ...props }) => {
  return (
    <div 
      className={`max-w-[1440px] mx-auto px-[12px] md:px-[20px] w-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
