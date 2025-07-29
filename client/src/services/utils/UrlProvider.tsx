import { BASE_URL, BASE_HOST } from '../../config/restConfig';

export enum PartUri {
  CANCEL = 'cancel',
  CONFIGURATION = 'gateway/v0.2/configuration',
  ENVIRONMENT = 'environment',
  LOGOUT = 'oauth/logout',
  PLANT = 'plant',
  PLANTCONTROLCODE = 'plantcontrolcode',
  TASK = 'task',
  FILEDOWNLOAD = 'files/download',
  MULTIFILEDOWNLOAD = 'files/downloadmulti',
  SIMULATION = 'simulation',
  USERRIGHT = 'userright',
  USERS = 'gateway/v0.2/users',
  VERSION = 'version',
}

export class UrlProvider {
  static basedataBaseUrl = BASE_URL;
  static apiBaseUrl = `${BASE_URL}/${PartUri.TASK}`;
  static hostUrl = BASE_HOST;

  public static getBasedataEndpointUrl = (
    endpoint: string,
    id?: number,
    childEndpoint?: string,
    childId?: number
  ): string => {
    let url: string = this.basedataBaseUrl + '/' + endpoint;
    if (id) {
      url += '/' + id.toString();
    }
    if (childEndpoint) {
      url += '/' + childEndpoint;
    }
    if (childId) {
      url += '/' + childId.toString();
    }

    return url;
  };

  public static getUserNameUrl = (): string => {
    return this.hostUrl + '/' + PartUri.USERS;
  };

  public static getPlantUrl = (): string => {
    return this.basedataBaseUrl + '/' + PartUri.PLANT;
  };

  public static getFileDownloadUrl = (): string => {
    return this.basedataBaseUrl + '/' + PartUri.FILEDOWNLOAD;
  };

  public static getMultiFileDownloadUrl = (): string => {
    return this.basedataBaseUrl + '/' + PartUri.MULTIFILEDOWNLOAD;
  };

  public static getPlantControlCodeUrl = (): string => {
    return this.basedataBaseUrl + '/' + PartUri.PLANTCONTROLCODE;
  };

  public static getVersionUrl = (): string => {
    return this.apiBaseUrl + '/' + PartUri.VERSION;
  };

  public static getEnvironmentUrl = (): string => {
    return this.apiBaseUrl + '/' + PartUri.ENVIRONMENT;
  };

  public static getPrivilegeUrl = (userName: string): string => {
    return this.basedataBaseUrl + '/' + PartUri.USERRIGHT + '/' + userName;
  };

  public static getServerConfigUrl = (): string => {
    return this.hostUrl + '/' + PartUri.CONFIGURATION;
  };

  public static getStartSimulationUrl = (): string => {
    return this.apiBaseUrl + '/' + PartUri.SIMULATION;
  };

  public static getCancelSimulationUrl = (correlationId: string): string => {
    return this.apiBaseUrl + '/' + PartUri.CANCEL + '/' + correlationId;
  };

  public static getLogoutUrl = (): string => {
    return this.hostUrl + '/' + PartUri.LOGOUT;
  };

  public static getLogoutRedirectUrl = async (): Promise<string> => {
    const url = this.getEnvironmentUrl();
    const response = await fetch(url);
    const data = await response.json();
    return data.logoutRedirectUri;
  };
}
