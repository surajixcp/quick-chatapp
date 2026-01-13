import React from 'react';

const PageContainer = ({ children, className = '' }) => {
    return (
        <div
            className={`relative w-full h-dvh overflow-hidden pb-safe ${className}`}
            style={{ height: '100dvh', paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}
        >
            {children}
        </div>
    );
};

export default PageContainer;
