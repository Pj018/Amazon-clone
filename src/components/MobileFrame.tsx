import React from 'react';

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-[#EAEDED] dark:bg-[#12161b] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-x-hidden">
      {children}
    </div>
  );
};
