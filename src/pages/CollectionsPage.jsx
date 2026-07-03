import { useNavigate } from "react-router-dom";

import { useCollections } from "../context/CollectionsContext";
import { useLanguage } from "../context/LanguageContext";
import { getCollectionUrl } from "../utils/localization";
import { getPageText } from "../utils/content";
import { collectionsContent } from "../content/collectionsContent";

import CollectionCard from "../components/sections/CollectionsPage/CollectionCard";
import PageHeroBanner from "../components/layout/PageHeroBanner";
import OrnamentDivider from "../components/ui/OrnamentDivider";
import PanassorSectionHeader from "../components/layout/PanassorSectionHeader";

function CollectionsPage() {
  const navigate = useNavigate();
  const collections = useCollections();
  const { language } = useLanguage();

  const copy = getPageText(collectionsContent, language);

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image={copy.hero.image}
        alt={copy.hero.alt}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
      />

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32">
        <PanassorSectionHeader
          eyebrow={copy.index.eyebrow}
          title={copy.index.title}
          description={copy.index.description}
          atmosphere="collectionsIndex"
          className="mx-auto mb-16 max-w-[78rem]"
        />

        <div className="relative z-10 mx-auto max-w-[78rem]">
          <div className="space-y-8">
            {collections.map((collection, index) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                index={index}
                onClick={() => navigate(getCollectionUrl(collection, language))}
              />
            ))}
          </div>

          <OrnamentDivider className="mt-20" width={112} opacity={0.55} />
        </div>
      </section>
    </main>
  );
}

export default CollectionsPage;