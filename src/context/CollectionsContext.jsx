import { createContext, useContext, useEffect, useState } from "react";
import { getCollections  } from "../../backend/panassorApi";

const CollectionsContext = createContext([]);

const RETRY_DELAY_MS = 3000;

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId;

    async function loadCollections() {
      try {
        const data = await getCollections ();

        if (!isMounted) {
          return;
        }

        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);

        if (!isMounted) {
          return;
        }

        retryTimeoutId = window.setTimeout(loadCollections, RETRY_DELAY_MS);
      }
    }

    loadCollections();

    return () => {
      isMounted = false;

      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  return (
    <CollectionsContext.Provider value={collections}>
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  return useContext(CollectionsContext);
}