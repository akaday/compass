import ConnectionString from 'mongodb-connection-string-url';
import { getStoragePaths } from '@mongodb-js/compass-utils';

import type { ConnectionInfo } from './connection-info';

export function getKeytarServiceName() {
  const { appName } = getStoragePaths() ?? {};
  const namespace = 'Connections';
  return `${appName}/${namespace}`;
}

export function deleteCompassAppNameParam(
  connectionInfo: ConnectionInfo
): ConnectionInfo {
  let connectionStringUrl;

  try {
    connectionStringUrl = new ConnectionString(
      connectionInfo.connectionOptions.connectionString
    );
  } catch {
    return connectionInfo;
  }

  if (
    /^mongodb compass/i.exec(
      connectionStringUrl.searchParams.get('appName') || ''
    )
  ) {
    connectionStringUrl.searchParams.delete('appName');
  }

  return {
    ...connectionInfo,
    connectionOptions: {
      ...connectionInfo.connectionOptions,
      connectionString: connectionStringUrl.href,
    },
  };
}