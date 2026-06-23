import PageHeroBanner from "../components/layout/PageHeroBanner";
import { useCollections } from "../context/CollectionsContext";

import AtelierVideoShowcase from "../components/sections/Atelier/AtelierVideoShowcase";
import AtelierConventionGallery from "../components/sections/Atelier/AtelierConventionGallery";
import AtelierVisionSection from "../components/sections/Atelier/AtelierVisionSection";
import AtelierVideosSection from "../components/sections/Atelier/AtelierVideosSection";
import AtelierSneakPeekSection from "../components/sections/Atelier/AtelierSneakPeekSection";

function AtelierPage() {
  const collections = useCollections();

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image="/images/collections-hero.png"
        alt="Atelier Panassor"
        eyebrow="Dans l’atelier"
        title="Atelier"
        description="Photos, vidéos et sneak peeks futurs dans l’univers Panassor."
      />

      <AtelierConventionGallery />

      <AtelierVisionSection />

      <AtelierVideosSection>
        <AtelierVideoShowcase />
      </AtelierVideosSection>

      <AtelierSneakPeekSection />
    </main>
  );
}

export default AtelierPage;