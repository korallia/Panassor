import PageHeroBanner from "../components/layout/PageHeroBanner";
import { useLanguage } from "../context/LanguageContext";
import { getPageText } from "../utils/content";
import { atelierContent } from "../content/atelierContent";

import AtelierVideoShowcase from "../components/sections/Atelier/AtelierVideoShowcase";
import AtelierConventionGallery from "../components/sections/Atelier/AtelierConventionGallery";
import AtelierVisionSection from "../components/sections/Atelier/AtelierVisionSection";
import AtelierVideosSection from "../components/sections/Atelier/AtelierVideosSection";
import AtelierSneakPeekSection from "../components/sections/Atelier/AtelierSneakPeekSection";

function AtelierPage() {
  const { language } = useLanguage();
  const copy = getPageText(atelierContent, language);

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image={copy.hero.image}
        alt={copy.hero.alt}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
      />

      <AtelierConventionGallery copy={copy.conventionGallery} />

      <AtelierVisionSection copy={copy.vision} />

      <AtelierVideosSection>
        <AtelierVideoShowcase />
      </AtelierVideosSection>

      <AtelierSneakPeekSection copy={copy.sneakPeek} />
    </main>
  );
}

export default AtelierPage;