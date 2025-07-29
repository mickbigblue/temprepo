import { useState, useCallback } from 'react';
import { CommonUtils } from '../services/utils/CommonUtils';
import { useTranslation } from 'react-i18next';
import { useSnackbarContext } from '../contexts/SnackbarContext';
import { UrlProvider } from '../services/utils/UrlProvider';
import { IdRecord } from '../interfaces/IdRecord';
import { EntityType, OperationType, SubEntityType } from '../types';
import { useRestApi } from './useRestApi';
import { useConfig } from '../contexts/ConfigContext';
import { formatDate } from '../components/common/valueFormatter/formatDate';

interface ResponseObject<T> {
  [key: string]: T[];
}

interface DataManagement<T> {
  data: ResponseObject<T>;
  isLoading: boolean;
  isSubmitting: boolean;
  fetchData: (parentId?: number) => Promise<void>;
  createData: (
    newData: T,
    parentId?: number
  ) => Promise<{ statusCode: number; data?: any; url: string } | undefined>;
  updateData: (updatedData: T, parentId?: number) => Promise<void>;
  deleteData: (toDeleteData: T, parentId?: number) => Promise<void>;
}

export function useDataManagement<T extends IdRecord>(
  entityType: EntityType | SubEntityType
): DataManagement<T> {
  const config = useConfig(entityType);
  const { t } = useTranslation();
  const { openSnackbar } = useSnackbarContext();
  const { get, put, post, deleteRequest } = useRestApi();
  const [data, setData] = useState<ResponseObject<T>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(
    async (parentId?: number) => {
      setIsLoading(true);
      try {
        let url: string;
        if (parentId && config.parentEndpoint) {
          url = UrlProvider.getBasedataEndpointUrl(
            config.parentEndpoint,
            parentId,
            config.endpoint
          );
        } else {
          url = UrlProvider.getBasedataEndpointUrl(config.endpoint);
        }
        // Introduce a delay to let backend process data
        await new Promise((resolve) => setTimeout(resolve, 500));

        const response = await get(url);
        if (response.statusCode === 200) {
          setData(response.data);
        } else {
          console.error('Error on fetching data', response);
          openSnackbar(response.data.messages.join(), 'error');
        }
      } catch (error) {
        console.error('Network error on fetching data', error);
        openSnackbar('Network error on fetching data', 'error');
      } finally {
        setIsLoading(false);
      }
    },
    [config, get, openSnackbar]
  );

  const getNestedProperty = useCallback((object: any, key: string) => {
    const keys = key.split('.');
    return keys.reduce(
      (acc, curr) => (acc && acc[curr] ? acc[curr] : ''),
      object
    );
  }, []);

  const getIdentifier = useCallback(
    (object: T) => {
      const identifier = getNestedProperty(object, config.identifierKey);

      let additionalIdentifier = '';
      if (config.additionalIdentifierKey) {
        if (config.additionalIdentifierKey === 'date') {
          const dateProperty = object.date || object.datum;
          additionalIdentifier = formatDate(new Date(dateProperty));
        } else {
          additionalIdentifier = getNestedProperty(
            object,
            config.additionalIdentifierKey
          );
        }
      }

      return `${identifier} - ${additionalIdentifier}`;
    },
    [config.additionalIdentifierKey, getNestedProperty, config.identifierKey]
  );

  const handleResponse = useCallback(
    (response: any, operation: OperationType, object: T, parentId?: number) => {
      const identifier = getIdentifier(object);
      let msg = `${t(config.i18nKey)} ${identifier} ${t(CommonUtils.capitalize(operation) + 'Success')}`;

      switch (response.statusCode) {
        case 200:
          if (parentId) {
            openSnackbar(msg, 'success', [], () => fetchData(parentId));
          } else {
            openSnackbar(msg, 'success');
          }
          break;
        case 202:
          const warnings = response.data.messages;
          if (parentId) {
            openSnackbar(msg, 'success', warnings, () => fetchData(parentId));
          } else {
            openSnackbar(msg, 'success', warnings);
          }
          break;
        case 204:
          openSnackbar(msg, 'success');
          break;
        case 400:
        case 404:
        case 424:
          msg = response.data.messages[0].message;
          openSnackbar(msg, 'error', [], () => fetchData(parentId));
          break;
        default:
          msg = JSON.stringify(response.data.messages);
          openSnackbar(msg, 'error', [], () => fetchData(parentId));
          break;
      }
    },
    [fetchData, t, config, openSnackbar, getIdentifier]
  );

  const createData = useCallback(
    async (newData: T, parentId?: number) => {
      setIsSubmitting(true);
      try {
        let url: string;
        if (parentId && config.parentEndpoint) {
          url = UrlProvider.getBasedataEndpointUrl(
            config.parentEndpoint,
            parentId,
            config.endpoint
          );
        } else {
          url = UrlProvider.getBasedataEndpointUrl(config.endpoint);
        }
        const response = await put(url, newData);
        handleResponse(response, 'create', newData, parentId);
        return response;
      } catch (error) {
        console.error('Network error on creating data', error);
        openSnackbar('Network error on creating data', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, put, openSnackbar, handleResponse]
  );

  const updateData = useCallback(
    async (updatedData: T, parentId?: number) => {
      setIsSubmitting(true);
      try {
        let url: string;
        if (parentId && config.parentEndpoint) {
          url = UrlProvider.getBasedataEndpointUrl(
            config.parentEndpoint,
            parentId,
            config.endpoint,
            updatedData.id
          );
        } else {
          url = UrlProvider.getBasedataEndpointUrl(
            config.endpoint,
            updatedData.id
          );
        }
        const response = await post(url, updatedData);
        handleResponse(response, 'update', updatedData, parentId);
      } catch (error) {
        console.error('Network error on updating data', error);
        openSnackbar('Network error on updating data', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [post, openSnackbar, handleResponse, config]
  );

  const deleteData = useCallback(
    async (toDeleteData: T, parentId?: number) => {
      setIsSubmitting(true);
      try {
        let url: string;
        if (parentId && config.parentEndpoint) {
          url = UrlProvider.getBasedataEndpointUrl(
            config.parentEndpoint,
            parentId,
            config.endpoint,
            toDeleteData.id
          );
        } else {
          url = UrlProvider.getBasedataEndpointUrl(
            config.endpoint,
            toDeleteData.id
          );
        }

        const response = await deleteRequest(url, true);
        handleResponse(response, 'delete', toDeleteData, parentId);
      } catch (error: any) {
        console.error('Network error on deleting data');
        openSnackbar('Network error on deleting data', 'error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [config, deleteRequest, openSnackbar, handleResponse]
  );

  return {
    data,
    isLoading,
    isSubmitting,
    fetchData,
    createData,
    updateData,
    deleteData,
  };
}
