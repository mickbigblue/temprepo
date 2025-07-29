import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import Cookies from 'js-cookie';

interface SeparatorContextProps {
  separator: string;
  setSeparator: (value: string) => void;
}

const SeparatorContext = createContext<SeparatorContextProps | undefined>(
  undefined
);

export const useSeparatorContext = (): SeparatorContextProps => {
  const context = useContext(SeparatorContext);
  if (context === undefined) {
    throw new Error('useSeparator must be used within a SeparatorProvider');
  }
  return context;
};

export const SeparatorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  const getInitialSeparator = () => {
    const savedSeparator = Cookies.get('csvSeparator');
    return savedSeparator ?? i18n.language.toLowerCase().startsWith('de')
      ? ';'
      : ',';
  };

  const [separator, setSeparatorState] = useState<string>(getInitialSeparator);

  const setSeparator = (newSeparator: string) => {
    setSeparatorState(newSeparator);
    Cookies.set('csvSeparator', newSeparator, { expires: 365 });
  };

  return (
    <SeparatorContext.Provider value={{ separator, setSeparator }}>
      {children}
    </SeparatorContext.Provider>
  );
};

export default SeparatorProvider;
