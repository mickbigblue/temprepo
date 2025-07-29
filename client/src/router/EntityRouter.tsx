import { EntityType } from '../types';
import DataProvider from '../components/DataProvider';

interface EntityPageProps {
  entityType: EntityType;
}

const EntityPage: React.FC<EntityPageProps> = ({ entityType }) => {
  return <DataProvider entityType={entityType} />;
};

export default EntityPage;
