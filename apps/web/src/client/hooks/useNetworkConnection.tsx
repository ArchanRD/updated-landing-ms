import React, { useMemo } from "react";

export interface ConnectionState {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: string;
  rtt?: number;
  type?: string;
}

export interface Connection extends ConnectionState, EventSource {}

export type NavigatorWithConnection = Navigator & {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
};

const getConnection = (): Connection | null => {
  const IS_SERVER = typeof window === "undefined";

  const navigator: NavigatorWithConnection | undefined =
    (!IS_SERVER && (window.navigator as NavigatorWithConnection)) || undefined;
  return !IS_SERVER
    ? navigator?.connection ||
        navigator?.mozConnection ||
        navigator?.webkitConnection ||
        null
    : null;
};

const NetworkInfoContext = React.createContext<Connection | null>(null);

export const NetworkInfoContextProvider: React.FC = ({ children }) => {
  const connection = useMemo(() => getConnection(), []);

  return (
    <NetworkInfoContext.Provider value={connection}>
      {children}
    </NetworkInfoContext.Provider>
  );
};

export function useNetworkConnection() {
  const context = React.useContext(NetworkInfoContext);
  if (context === undefined) {
    throw new Error(
      "useNetworkConnection must be used within a PostContextProvider"
    );
  }
  return context;
}
