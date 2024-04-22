import React from 'react';
import {
  openToast,
  showConfirmation,
  ConfirmationModalArea,
  ToastArea,
} from '@mongodb-js/compass-components';
import type { LoggerAndTelemetry } from '@mongodb-js/compass-logging/provider';
import type AppRegistry from 'hadron-app-registry';
import type { ConnectionsManager } from '@mongodb-js/compass-connections/provider';
import toNS from 'mongodb-ns';
import type { ActivateHelpers } from 'hadron-app-registry';

type NS = ReturnType<typeof toNS>;

type DropNamespaceServices = {
  globalAppRegistry: AppRegistry;
  connectionsManager: ConnectionsManager;
  logger: LoggerAndTelemetry;
};

export function activatePlugin(
  _: unknown,
  {
    globalAppRegistry,
    connectionsManager,
    logger: { track },
  }: DropNamespaceServices,
  { on, cleanup, signal }: ActivateHelpers
) {
  const onDropNamespace = async (
    connectionId: string,
    namespace: string | NS
  ) => {
    // `drop-collection` is emitted with NS, `drop-database` is emitted with a
    // string, we're keeping compat with both for now to avoid conflicts with
    // other refactoring
    if (typeof namespace === 'string') {
      namespace = toNS(namespace);
    }

    const {
      ns,
      validCollectionName: isCollection,
      database,
      collection,
    } = namespace;
    const namespaceLabel = isCollection ? 'Collection' : 'Database';
    track('Screen', {
      name: isCollection ? 'drop_collection_modal' : 'drop_database_modal',
    });
    const confirmed = await showConfirmation({
      variant: 'danger',
      title: `Drop ${namespaceLabel}`,
      description: `Are you sure you want to drop ${namespaceLabel.toLocaleLowerCase()} "${ns}"?`,
      requiredInputText: isCollection ? collection : database,
      buttonText: `Drop ${namespaceLabel}`,
      'data-testid': 'drop-namespace-confirmation-modal',
      signal,
    });
    if (confirmed) {
      try {
        const method = isCollection ? 'dropCollection' : 'dropDatabase';
        const dataService =
          connectionsManager.getDataServiceForConnection(connectionId);
        if (!dataService) {
          throw new Error(
            'unreachable: only available when there is an open connection.'
          );
        }

        await dataService[method](ns);
        globalAppRegistry.emit(
          isCollection ? 'collection-dropped' : 'database-dropped',
          ns
        );
        openToast('drop-namespace-success', {
          variant: 'success',
          title: `${namespaceLabel} "${ns}" dropped`,
          timeout: 3000,
        });
      } catch (err) {
        if (signal.aborted) {
          return;
        }
        openToast('drop-namespace-error', {
          variant: 'important',
          title: `Failed to drop ${namespaceLabel.toLocaleLowerCase()} "${ns}"`,
          description: (err as Error).message,
          timeout: 3000,
        });
      }
    }
  };

  on(globalAppRegistry, 'open-drop-database', onDropNamespace);
  on(globalAppRegistry, 'open-drop-collection', onDropNamespace);

  return {
    store: {},
    deactivate: cleanup,
  };
}

/**
 * Drop namespace plugin doesn't render anything on it's own, but requires
 * compass-component toast and confirmation modal areas to be present
 */
export const DropNamespaceComponent: React.FunctionComponent = ({
  children,
}) => {
  return (
    <ConfirmationModalArea>
      <ToastArea>{children}</ToastArea>
    </ConfirmationModalArea>
  );
};
