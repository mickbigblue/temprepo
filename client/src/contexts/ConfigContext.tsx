import React, { createContext, useContext, ReactNode } from 'react';
import {
  ParentEntityConfigType,
  EntityType,
  SubEntityConfigType,
  ParentEntityEndpointMapping,
  SubEntityEndpointMapping,
  isParentEntityConfig,
  EntityConfigType,
} from '../types';
import entityConfig from '../config/entityConfig';

type ConfigContextType = {
  [key in keyof ParentEntityEndpointMapping]: ParentEntityConfigType;
} & {
  [key in keyof SubEntityEndpointMapping]: SubEntityConfigType;
};

const ConfigContext = createContext<ConfigContextType | null>(null);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  return (
    <ConfigContext.Provider value={entityConfig as ConfigContextType}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (entityType: EntityType): EntityConfigType => {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error('ConfigContext not found');
  }

  // Directly return if the entityType exists in config (parent entities)
  if (entityType in config) {
    return config[entityType];
  }

  // Handle sub-entities by iterating through parent entities
  for (const key in config) {
    const entityConfig = config[key as keyof ConfigContextType];
    if (
      isParentEntityConfig(entityConfig) &&
      entityConfig.subEntityConfig?.entityType === entityType
    ) {
      return entityConfig.subEntityConfig;
    }
  }

  throw new Error(`Configuration for entity type "${entityType}" not found`);
};
