import { useEffect, useMemo, useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { IdRecord } from '../interfaces/IdRecord';
import { getTransformer, getUntransformer } from '../transformers';
import { EntityConfigType, EntityType } from '../types';
import GridManager from './common/GridManager';

interface DataManagerProps<T extends IdRecord> {
  data: { [key: string]: T[] };
  additionalData: any;
  parentId?: number;
  isLoading: boolean;
  entityType: EntityType;
  onAdd: (
    item: T
  ) => Promise<{ statusCode: number; data?: any; url: string } | undefined>;
  onUpdate: (item: T) => void;
  onDelete: (item: T) => void;
  onRefresh?: () => void;
  onParentRefresh?: () => void;
}

const DataManager = <T extends IdRecord>({
  data,
  additionalData,
  parentId,
  isLoading,
  entityType,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
  onParentRefresh,
}: DataManagerProps<T>) => {
  const config: EntityConfigType = useConfig(entityType);
  const [rows, setRows] = useState<T[]>([]);
  const columns = config.columns;
  const transformer = getTransformer<T>(entityType);
  const untransformer = getUntransformer<T>(entityType);

  const combinedData = useMemo(() => {
    if (!isLoading && Object.keys(data).length) {
      return additionalData ? { ...data, additionalData } : { ...data };
    }
    return {};
  }, [isLoading, data, additionalData]);

  useEffect(() => {
    if (transformer && Object.keys(combinedData).length) {
      const transformedData = transformer(combinedData);
      setRows(transformedData);
    }
  }, [combinedData, transformer]);

  const handleAdd = async (addData: T) => {
    const itemToAdd = parentId
      ? untransformer(addData, parentId)
      : untransformer(addData);
    const response = await onAdd(itemToAdd);
    onParentRefresh?.();
    return response;
  };

  const handleUpdate = (editData: T) => {
    const itemToUpdate = untransformer(editData);
    onUpdate(itemToUpdate);
    onParentRefresh?.();
  };

  const handleDelete = (deleteData: T) => {
    onDelete(deleteData);
    onParentRefresh?.();
  };

  return (
    <GridManager
      entityType={entityType}
      parentId={parentId}
      data={rows}
      additionalData={combinedData}
      columns={columns ?? []}
      isLoading={isLoading}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onRefresh={onRefresh}
      showActions={!['filedownload'].includes(entityType)}
    />
  );
};

export default DataManager;
