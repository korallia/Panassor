import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getCollections,
  getCollectionBySlug,
} from "../../backend/panassorApi";

const CollectionsContext = createContext(null);

const RETRY_DELAY_MS = 3000;

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [collectionDetailsBySlug, setCollectionDetailsBySlug] = useState({});

  const detailsCacheRef = useRef({});
  const pendingDetailsRequestsRef = useRef({});

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId = null;

    async function loadCollections() {
      try {
        const data = await getCollections();

        if (!isMounted) return;

        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);

        if (!isMounted) return;

        retryTimeoutId = window.setTimeout(
          loadCollections,
          RETRY_DELAY_MS
        );
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

  const loadCollectionDetails = useCallback(async (slug) => {
    if (!slug) return null;

    if (detailsCacheRef.current[slug]) {
      return detailsCacheRef.current[slug];
    }

    if (pendingDetailsRequestsRef.current[slug]) {
      return pendingDetailsRequestsRef.current[slug];
    }

    const request = getCollectionBySlug(slug)
      .then((data) => {
        detailsCacheRef.current[slug] = data;

        setCollectionDetailsBySlug((previousDetails) => ({
          ...previousDetails,
          [slug]: data,
        }));

        return data;
      })
      .finally(() => {
        delete pendingDetailsRequestsRef.current[slug];
      });

    pendingDetailsRequestsRef.current[slug] = request;

    return request;
  }, []);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        collectionDetailsBySlug,
        loadCollectionDetails,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

export function useCollections() {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error("useCollections must be used inside CollectionsProvider");
  }

  return context.collections;
}

export function useCollectionDetails(slug) {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw new Error(
      "useCollectionDetails must be used inside CollectionsProvider"
    );
  }

  const cachedCollection = slug
    ? context.collectionDetailsBySlug[slug]
    : null;

  const [collection, setCollection] = useState(cachedCollection ?? null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    let retryTimeoutId = null;

    async function loadDetails() {
      try {
        setNotFound(false);

        const data = await context.loadCollectionDetails(slug);

        if (!isMounted) return;

        setCollection(data);
      } catch (error) {
        console.error("Failed to fetch collection details:", error);

        if (!isMounted) return;

        if (error.status === 404) {
          setNotFound(true);
          return;
        }

        retryTimeoutId = window.setTimeout(loadDetails, RETRY_DELAY_MS);
      }
    }

    if (cachedCollection) {
      setCollection(cachedCollection);
      return;
    }

    loadDetails();

    return () => {
      isMounted = false;

      if (retryTimeoutId) {
        window.clearTimeout(retryTimeoutId);
      }
    };
  }, [slug, cachedCollection, context]);

  return {
    collection,
    notFound,
  };
}