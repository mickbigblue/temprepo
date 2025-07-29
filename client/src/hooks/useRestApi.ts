import queryString from 'query-string';
import { IdRecord } from '../interfaces/IdRecord';
import INoIdRecord from '../interfaces/INoIdRecord';
import { useCallback } from 'react';

export enum HTTP_METHOD {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface FetchParams<T> {
  endpoint: string;
  method: HTTP_METHOD;
  octet?: boolean;
  body?: T;
  ignoreResponseBody?: boolean;
  queryParams?: Record<string, any>;
}

const buildHeaders = (octet: boolean = false): Headers => {
  const headers = new Headers();
  headers.set('Accept', octet ? 'application/zip' : 'application/json');
  headers.set(
    'Content-Type',
    octet ? 'application/zip' : 'application/json;charset=UTF-8'
  );

  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_PFM_KEY) {
    headers.set('user-info', `"${process.env.REACT_APP_USER_INFO}"`);
    headers.set('pfm-key', process.env.REACT_APP_PFM_KEY);
  }

  return headers;
};

const fetchApi = async <T>({
  endpoint,
  method,
  octet = false,
  body,
  ignoreResponseBody = false,
  queryParams,
}: FetchParams<T>): Promise<{
  statusCode: number;
  data?: any;
  url: string;
}> => {
  const queryStringParams = queryParams
    ? `?${queryString.stringify(queryParams)}`
    : '';
  try {
    const headers = buildHeaders(octet);
    const response = await fetch(endpoint + queryStringParams, {
      method: method,
      headers: headers,
      body:
        method !== HTTP_METHOD.GET && body ? JSON.stringify(body) : undefined,
      mode: 'cors',
    });

    let data;
    if (!ignoreResponseBody) {
      if (response.status === 403) {
        throw new Error(
          'Forbidden: You do not have permission to access this resource.'
        );
      }
      if (method === HTTP_METHOD.DELETE && response.status === 200) {
        data = undefined; // No response body expected for successful DELETE requests
      } else {
        data = await response.json();
      }
    }

    return {
      statusCode: response.status,
      data,
      url: endpoint + queryStringParams,
    };
  } catch (error: any) {
    console.error('REST Call failed', error);
    if (error instanceof Error) {
      throw new Error(`Failed to make a REST call. Error: ${error.message}`);
    } else {
      throw new Error('Failed to make a REST call. Unknown error occurred.');
    }
  }
};

export const useRestApi = () => {
  const get = useCallback(
    <T extends IdRecord | INoIdRecord>(
      endpoint: string,
      ignoreResponseBody: boolean = false,
      queryParams?: Record<string, any>
    ) =>
      fetchApi<T>({
        endpoint,
        method: HTTP_METHOD.GET,
        ignoreResponseBody,
        queryParams,
      }),
    []
  );

  const getOctet = useCallback(
    (
      endpoint: string,
      ignoreResponseBody: boolean,
      queryParams?: Record<string, any>
    ) =>
      fetchApi({
        endpoint,
        method: HTTP_METHOD.GET,
        octet: true,
        ignoreResponseBody,
        queryParams,
      }),
    []
  );

  const put = useCallback(
    <T extends IdRecord>(
      endpoint: string,
      body: T,
      ignoreResponseBody: boolean = false
    ) =>
      fetchApi<T>({
        endpoint,
        method: HTTP_METHOD.PUT,
        body,
        ignoreResponseBody,
      }),
    []
  );

  const post = useCallback(
    <T extends IdRecord | INoIdRecord>(
      endpoint: string,
      body: T,
      ignoreResponseBody: boolean = false
    ) =>
      fetchApi<T>({
        endpoint,
        method: HTTP_METHOD.POST,
        body,
        ignoreResponseBody,
      }),
    []
  );

  const deleteRequest = useCallback(
    (endpoint: string, ignoreResponseBody: boolean = false) =>
      fetchApi({
        endpoint,
        method: HTTP_METHOD.DELETE,
        ignoreResponseBody,
      }),
    []
  );

  return { get, getOctet, put, post, deleteRequest };
};
