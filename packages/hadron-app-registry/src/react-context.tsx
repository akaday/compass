import React, {
  createContext,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react';
import { globalAppRegistry, AppRegistry } from './app-registry';
import createDebug from 'debug';
const debug = createDebug('hadron-app-registry:react');

const GlobalAppRegistryContext = createContext(globalAppRegistry);
const LocalAppRegistryContext = createContext<AppRegistry | null>(null);

type AppRegistryProviderProps =
  | {
      localAppRegistry?: never;
      deactivateOnUnmount?: never;
      children: React.ReactNode;
    }
  | {
      /**
       * localAppRegistry to be set in React context. By default will be created
       * when this component renders. Can be used to preserve appRegistry state even
       * if AppRegistryProvider is unmounted
       *
       * @example
       * function CollectionTab({ id }) {
       *   return (
       *     <AppRegistryProvider
       *       appRegistry={getRegistryForTabId(id)}
       *       deactivateOnUnmount={false}
       *     >
       *       ...
       *     </AppRegistryProvider>
       *   )
       * }
       */
      localAppRegistry: AppRegistry;

      /**
       * Deactivates all active plugins and remove all event listeners from the app
       * registry when provider unmounts. Default is `true`
       */
      deactivateOnUnmount?: boolean;
      children: React.ReactNode;
    };

export function AppRegistryProvider({
  children,
  ...props
}: AppRegistryProviderProps) {
  const initialPropsRef = useRef(props);
  const {
    localAppRegistry: initialLocalAppRegistry,
    deactivateOnUnmount = true,
  } = initialPropsRef.current;

  const globalAppRegistry = useGlobalAppRegistry();
  const isTopLevelProvider = useContext(LocalAppRegistryContext) === null;
  const [localAppRegistry] = useState(() => {
    return (
      initialLocalAppRegistry ??
      (isTopLevelProvider ? globalAppRegistry : new AppRegistry())
    );
  });

  useEffect(() => {
    // For cases where localAppRegistry was provided by the parent, we allow
    // parent to also take control over the cleanup lifecycle by disabling
    // deactivate call with the `deactivateOnUnmount` prop. Otherwise if
    // localAppRegistry was created by the provider, it will always clean up on
    // unmount
    const shouldDeactivate = initialLocalAppRegistry
      ? deactivateOnUnmount
      : true;
    return () => {
      if (shouldDeactivate) {
        localAppRegistry.deactivate();
      }
    };
  }, [localAppRegistry, initialLocalAppRegistry, deactivateOnUnmount]);

  return (
    <GlobalAppRegistryContext.Provider value={globalAppRegistry}>
      <LocalAppRegistryContext.Provider value={localAppRegistry}>
        {children}
      </LocalAppRegistryContext.Provider>
    </GlobalAppRegistryContext.Provider>
  );
}

export function useGlobalAppRegistry(): AppRegistry {
  return useContext(GlobalAppRegistryContext);
}

export function useLocalAppRegistry(): AppRegistry {
  const appRegistry = useContext(LocalAppRegistryContext);
  if (!appRegistry) {
    throw new Error(`No local AppRegistry registered within this context`);
  }
  return appRegistry;
}

/** @deprecated prefer using plugins or direct references instead */
export function useAppRegistryComponent(
  componentName: string
): React.JSXElementConstructor<unknown> | null {
  const appRegistry = useGlobalAppRegistry();

  const [component] = useState(() => {
    const newComponent = appRegistry.getComponent(componentName);
    if (!newComponent) {
      debug(
        `home plugin loading component, but ${String(componentName)} is NULL`
      );
    }
    return newComponent;
  });

  return component ? component : null;
}

/** @deprecated prefer using plugins or direct references instead */
export function useAppRegistryRole(roleName: string):
  | {
      component: React.JSXElementConstructor<unknown>;
      name: string;
    }[]
  | null {
  const appRegistry = useGlobalAppRegistry();

  const [role] = useState(() => {
    const newRole = appRegistry.getRole(roleName);
    if (!newRole) {
      debug(`home plugin loading role, but ${String(roleName)} is NULL`);
    }
    return newRole;
  });

  return role ? role : null;
}
