import { useNavigate } from "react-router-dom";

import { useCollections } from "../context/CollectionsContext";

import CollectionCard from "../components/sections/CollectionsPage/CollectionCard";
import PageHeroBanner from "../components/layout/PageHeroBanner";
import OrnamentDivider from "../components/ui/OrnamentDivider";
import PanassorSectionHeader from "../components/layout/PanassorSectionHeader";

function CollectionsPage() {
  const navigate = useNavigate();
  const collections = useCollections();

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image="/images/collections-hero.png"
        alt="Collections Panassor"
        eyebrow="Univers Panassor"
        title="Collections"
        description="Des kits immersifs pensés pour enrichir les scènes, soutenir les personnages et donner une vraie présence aux moments de jeu."
      />

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32">
        <PanassorSectionHeader
          eyebrow="Toutes les collections"
          title="Choisir un univers"
          description="Chaque collection rassemble des accessoires conçus autour d’une ambiance, d’un rôle et d’un type de scène."
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
                onClick={() => navigate(`/collections/${collection.slug}`)}
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