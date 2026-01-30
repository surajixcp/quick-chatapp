import React from 'react';

const PageContainer = ({ children, className = '' }) => {
    return (
        <div
            className={`relative w-full h-dvh overflow-hidden pb-safe ${className}`}
            style={{ height: '100dvh' }}
        >
            {children}
        </div>
    );
};

export default PageContainer;
