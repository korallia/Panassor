import { useEffect, useState } from "react";

import { getAtelierVideos } from "../../backend/panassorApi";
import PageHeroBanner from "../components/layout/PageHeroBanner";
import { useLanguage } from "../context/LanguageContext";
import { getPageText } from "../utils/content";
import { getAssetUrl } from "../utils/assets";
import { atelierContent } from "../content/atelierContent";

import AtelierVideoShowcase from "../components/sections/Atelier/AtelierVideoShowcase";
import AtelierConventionGallery from "../components/sections/Atelier/AtelierConventionGallery";
import AtelierVisionSection from "../components/sections/Atelier/AtelierVisionSection";
import AtelierVideosSection from "../components/sections/Atelier/AtelierVideosSection";
import AtelierSneakPeekSection from "../components/sections/Atelier/AtelierSneakPeekSection";

function isUsableVideoUrl(value) {
  if (!value) return false;

  const url = String(value).trim();

  if (!url) return false;

  const invalidValues = ["null", "undefined", "false", "none"];

  return !invalidValues.includes(url.toLowerCase());
}

function AtelierPage() {
  const { language } = useLanguage();
  const copy = getPageText(atelierContent, language);

  const [atelierVideos, setAtelierVideos] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAtelierVideos() {
      try {
        const videos = await getAtelierVideos();

        if (!isMounted) return;

        setAtelierVideos(
          videos.filter((video) => isUsableVideoUrl(video.video_url))
        );
      } catch (error) {
        console.error("Failed to fetch atelier videos:", error);

        if (!isMounted) return;

        setAtelierVideos([]);
      }
    }

    loadAtelierVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasAtelierVideos = atelierVideos.length > 0;

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image={getAssetUrl(copy.hero.image)}
        alt={copy.hero.alt}
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        description={copy.hero.description}
      />

      <AtelierConventionGallery copy={copy.conventionGallery} />

      <AtelierVisionSection copy={copy.vision} />

      {hasAtelierVideos && (
        <AtelierVideosSection copy={copy.videos}>
          <AtelierVideoShowcase videos={atelierVideos} copy={copy.videos} />
        </AtelierVideosSection>
      )}

      <AtelierSneakPeekSection copy={copy.sneakPeek} />
    </main>
  );
}

export default AtelierPage;