import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { UrlProvider } from '../services/utils/UrlProvider';
import Privileges from '../data/privileges';
import { useRestApi } from '../hooks/useRestApi';

interface PrivilegesContextProps {
  privileges: Privileges[];
  loading: boolean;
  getPrivileges: () => Promise<void>;
  hasPrivilege: (entityType: string) => boolean;
}

const PrivilegesContext = createContext<PrivilegesContextProps | undefined>(
  undefined
);

export const PrivilegesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { get } = useRestApi();
  const [privileges, setPrivileges] = useState<Privileges[]>([]);
  const [loading, setLoading] = useState(true);

  const getPrivileges = async () => {
    try {
      let privilegeURI = '';
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.REACT_APP_USER_INFO
      ) {
        privilegeURI = UrlProvider.getPrivilegeUrl(
          process.env.REACT_APP_USER_INFO
        );
      } else {
        const user = await get(UrlProvider.getUserNameUrl());
        privilegeURI = UrlProvider.getPrivilegeUrl(user.data.username);
      }
      const response = await get(privilegeURI);
      const privilegeIds: number[] = response.data.privilegeIds;
      const privileges = privilegeIds.map(
        (id) => Privileges[id] as unknown as Privileges
      );
      setPrivileges(privileges);
    } catch (error) {
      console.error(error || 'Privileges could not be loaded');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrivileges();
  }, []);

  const hasPrivilege = (entityType: string) => {
    switch (entityType) {
      case 'audits':
        return privileges.includes('auditcapacities' as unknown as Privileges);
      case 'partialrules':
        return privileges.includes('vehiclerules' as unknown as Privileges);
      case 'quantities':
        return privileges.includes('distributions' as unknown as Privileges);
      default:
        return privileges.includes(entityType as unknown as Privileges);
    }
  };

  return (
    <PrivilegesContext.Provider
      value={{ privileges, loading, getPrivileges, hasPrivilege }}
    >
      {children}
    </PrivilegesContext.Provider>
  );
};

export const usePrivilegesContext = (): PrivilegesContextProps => {
  const context = useContext(PrivilegesContext);
  if (context === undefined) {
    throw new Error('usePrivileges must be used within a PrivilegesProvider');
  }
  return context;
};
