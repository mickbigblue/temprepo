import React, { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface PaginationContextProps {
  pageSize: number;
  setPageSize: (size: number) => void;
}

const PaginationContext = createContext<PaginationContextProps | undefined>(
  undefined
);

export const usePaginationContext = (): PaginationContextProps => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};

export const PaginationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialPageSize = () => {
    const savedPageSize = Cookies.get('pageSize');
    return savedPageSize ? Number(savedPageSize) : 25;
  };

  const [pageSize, setPageSizeState] = useState<number>(getInitialPageSize);

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    Cookies.set('pageSize', size.toString(), { expires: 365 });
  };

  return (
    <PaginationContext.Provider value={{ pageSize, setPageSize }}>
      {children}
    </PaginationContext.Provider>
  );
};
