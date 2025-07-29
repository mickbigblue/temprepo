function getInstanceId() {
  const pathname = window.location.pathname;
  const regex = new RegExp('^/web/pfm/ui/([\\w]{0,16})\\S*');
  const match = regex.exec(pathname);
  return match ? match[1] : 'default-instance';
}

const BASE_HOST =
  process.env.NODE_ENV === 'development'
    ? ''
    : `${window.location.protocol}//${window.location.host}`;

const SERVICE_ROOT =
  process.env.REACT_APP_SERVICE_CONTEXT_ROOT || '/pfm-service-pinky';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? `${SERVICE_ROOT}`
    : `${BASE_HOST}/api/pfm/${getInstanceId()}`;

export { BASE_HOST, BASE_URL, getInstanceId };
