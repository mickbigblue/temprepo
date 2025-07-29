import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useDataManagement } from '../hooks/useDataManagement';
import { useFetchAdditionalData } from '../hooks/useFetchAdditionalData';
import { EntityType, SubEntityType } from '../types';
import DataManager from './DataManager';

interface DataProviderProps {
  entityType: EntityType;
  subEntityType?: SubEntityType;
  parentId?: number;
  onDataLoaded?: (rowId: number) => void;
  onParentRefresh?: () => void;
}

const DataProvider: React.FC<DataProviderProps> = ({
  entityType,
  subEntityType,
  parentId,
  onDataLoaded,
  onParentRefresh,
}) => {
  const resolvedEntity = subEntityType || entityType;

  const { data, fetchData, isLoading, createData, updateData, deleteData } =
    useDataManagement(resolvedEntity);

  const config = useConfig(resolvedEntity);
  const additionalEndpoint = config.additionalDataUrl;

  const {
    additionalData,
    isLoading: isAdditionalLoading,
    fetchAdditionalData,
  } = useFetchAdditionalData(additionalEndpoint);

  const [showLoading, setShowLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    fetchData(parentId);

    if (additionalEndpoint) {
      fetchAdditionalData();
    }

    setShowLoading(true);
  }, [fetchData, parentId, additionalEndpoint, fetchAdditionalData]);

  // If data is loaded for a child table, we call the scroll function
  useEffect(() => {
    if (!isLoading && parentId) {
      setTimeout(() => {
        onDataLoaded?.(parentId);
      }, 1000);
    }
  }, [isLoading, parentId, onDataLoaded]);

  // Two possible cases:
  // A:
  // If we are in a child table, we have a callback to the parent's onRefresh function, called: onParentRefresh.
  // In this case we call fetchData for the child and then refresh the parent.
  // B:
  // If we are in a parent table, we call fetchData without parentId and onParentRefresh does not exist.
  const onRefresh = useCallback(() => {
    setShowLoading(false);
    fetchData(parentId);
    onParentRefresh?.();
  }, [fetchData, parentId, onParentRefresh]);

  return (
    <DataManager
      entityType={subEntityType || entityType}
      data={data}
      additionalData={additionalData}
      parentId={parentId}
      isLoading={showLoading && (isLoading || isAdditionalLoading)}
      onAdd={(item) => createData(item, parentId)}
      onUpdate={(item) => updateData(item, parentId)}
      onDelete={(item) => deleteData(item, parentId)}
      onRefresh={onRefresh}
      onParentRefresh={onParentRefresh}
    />
  );
};

export default React.memo(DataProvider);
