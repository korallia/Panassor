import { useEffect, useState } from "react";

import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";
import SectionTitle from "../../layout/SectionTitle";
import CollectionAvenirHero from "./CollectionAvenirHero";
import { getComingSoonCollections } from "../../../api/panassorApi";

function AtelierSneakPeekSection({ copy = {} }) {
  const [comingSoonCollections, setComingSoonCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadComingSoonCollections() {
      try {
        const data = await getComingSoonCollections();

        if (isMounted) {
          setComingSoonCollections(data);
        }
      } catch (error) {
        console.error("Failed to load coming soon collections:", error);

        if (isMounted) {
          setComingSoonCollections([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadComingSoonCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  const collectionAVenir = comingSoonCollections[0];

  if (loading) {
    return null;
  }

  if (!collectionAVenir) {
    return null;
  }

  return (
    <section
      id="sneak-peek"
      className="relative scroll-mt-40 overflow-hidden bg-[#080504] px-6 pt-16 pb-32 text-[#f3e7cf]"
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <SectionTitle
            eyebrow={copy.eyebrow}
            title={copy.title}
            align="center"
            showDivider={false}
          />

          <OrnamentDivider className="mt-7" width={112} opacity={0.65} />
        </div>

        <CollectionAvenirHero
          collection={collectionAVenir}
          primaryAction={copy.primaryAction}
          secondaryAction={copy.secondaryAction}
        />

        <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default AtelierSneakPeekSection;