import { useEffect, useState } from "react";

import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../utils/localization";

import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";
import SectionTitle from "../../layout/SectionTitle";
import CollectionAvenirHero from "./CollectionAvenirHero";
import { getComingSoonCollections } from "../../../../backend/panassorApi";

function AtelierSneakPeekSection() {
  const { language } = useLanguage();

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

  const localizedCollectionAVenir = {
    ...collectionAVenir,
    name: t(collectionAVenir, "name", language),
    title: t(collectionAVenir, "title", language),
    eyebrow: t(collectionAVenir, "eyebrow", language),
    description: t(collectionAVenir, "description", language),
    long_description: t(collectionAVenir, "long_description", language),
  };

  return (
    <section
      id="sneak-peek"
      className="relative scroll-mt-40 overflow-hidden bg-[#080504] px-6 pt-16 pb-32 text-[#f3e7cf]"
    >
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[88rem]">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <SectionTitle
            eyebrow="Sneak peek"
            title="Un nouveau kit se prépare"
            align="center"
            showDivider={false}
          />

          <OrnamentDivider className="mt-7" width={112} opacity={0.65} />
        </div>

        <CollectionAvenirHero
          collection={localizedCollectionAVenir}
          primaryAction={{
            label: "Suivre sur Facebook",
            href: "https://www.facebook.com/profile.php?id=61587079943525",
            external: true,
          }}
          secondaryAction={{
            label: "Voir les collections",
            href: "/collections",
          }}
        />

        <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default AtelierSneakPeekSection;