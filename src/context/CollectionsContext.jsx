import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCollections,
  getCollectionBySlug,
} from "../api/panassorApi";

const CollectionsContext = createContext(null);

// Si l'API ne répond pas, on réessaie en espaçant de plus en plus
// (3 s, 6 s, 12 s… jusqu'à 1 min) au lieu de toutes les 3 s sans fin.
const RETRY_DELAY_MS = 3000;
const MAX_RETRY_DELAY_MS = 60000;

function retryDelay(attempt) {
  return Math.min(RETRY_DELAY_MS * 2 ** attempt, MAX_RETRY_DELAY_MS);
}

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState([]);
  const [collectionDetailsBySlug, setCollectionDetailsBySlug] = useState({});

  const detailsCacheRef = useRef({});
  const pendingDetailsRequestsRef = useRef({});

  useEffect(() => {
    let isMounted = true;
    let retryTimeoutId = null;
    let attempt = 0;

    async function loadCollections() {
      try {
        const data = await getCollections();

        if (!isMounted) return;

        setCollections(data);
      } catch (error) {
        console.error("Failed to fetch collections:", error);

        if (!isMounted) return;

        retryTimeoutId = window.setTimeout(loadCollections, retryDelay(attempt++));
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
        // Rangée sous ses deux slugs (FR et EN) : changer de langue sur la
        // page collection ne la recharge pas.
        const keys = [slug, data?.slug_fr, data?.slug_en].filter(Boolean);

        for (const key of keys) {
          detailsCacheRef.current[key] = data;
        }

        setCollectionDetailsBySlug((previousDetails) => ({
          ...previousDetails,
          ...Object.fromEntries(keys.map((key) => [key, data])),
        }));

        return data;
      })
      .finally(() => {
        delete pendingDetailsRequestsRef.current[slug];
      });

    pendingDetailsRequestsRef.current[slug] = request;

    return request;
  }, []);

  const value = useMemo(
    () => ({
      collections,
      collectionDetailsBySlug,
      loadCollectionDetails,
    }),
    [collections, collectionDetailsBySlug, loadCollectionDetails]
  );

  return (
    <CollectionsContext.Provider value={value}>
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

  const { collectionDetailsBySlug, loadCollectionDetails } = context;

  const cachedCollection = slug ? collectionDetailsBySlug[slug] : null;

  const [collection, setCollection] = useState(cachedCollection ?? null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    let retryTimeoutId = null;
    let attempt = 0;

    async function loadDetails() {
      try {
        setNotFound(false);

        const data = await loadCollectionDetails(slug);

        if (!isMounted) return;

        setCollection(data);
      } catch (error) {
        console.error("Failed to fetch collection details:", error);

        if (!isMounted) return;

        if (error.status === 404) {
          setNotFound(true);
          return;
        }

        retryTimeoutId = window.setTimeout(loadDetails, retryDelay(attempt++));
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
  }, [slug, cachedCollection, loadCollectionDetails]);

  return {
    collection,
    notFound,
  };
}