import { useEffect, useState } from "react";

import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";
import PanassorSectionHeader from "../../layout/PanassorSectionHeader";
import SectionAtmosphere from "../../layout/SectionAtmosphere";

const conventionImages = [
  {
    src: "/images/Kiosque.jpg",
    alt: "Kiosque Panassor au Salon de la Passion Médiévale",
  },
  {
    src: "/images/Emile.jpg",
    alt: "Présentation des kits Panassor au Salon de la Passion Médiévale",
  },
  {
    src: "/images/Kiosque2.jpg",
    alt: "Table Panassor avec accessoires médiévaux en convention",
  },
];

function AtelierConventionGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <section className="relative overflow-hidden bg-[#080504] px-6 pt-12 pb-32 text-[#f3e7cf]">
        <SectionAtmosphere variant="featured" />

        <div className="relative z-10 mx-auto max-w-[92rem]">
          <PanassorSectionHeader
            eyebrow="Galerie"
            title="Panassor en convention"
            description="Les photos montrent une partie de l’expérience, mais rien ne remplace le moment où l’on peut prendre les kits en main, voir les détails de près et discuter avec nous de vos personnages, scènes et idées de jeu."
            showAtmosphere={false}
            className="mx-auto mb-16 max-w-[78rem]"
          />

          <div className="grid gap-10 lg:grid-cols-[1.55fr_0.75fr]">
            <button
              type="button"
              onClick={() => setSelectedImage(conventionImages[0])}
              className="relative min-h-[720px] border border-[#c89b3c]/55 bg-[#120c07] p-4 text-left shadow-[0_28px_80px_rgba(0,0,0,0.72)]"
              aria-label="Ouvrir l’image du kiosque Panassor en plein écran"
            >
              <CornerFrame inset="outside" size="lg" />

              <div className="relative h-full min-h-[690px] overflow-hidden">
                <img
                  src={conventionImages[0].src}
                  alt={conventionImages[0].alt}
                  className="h-full min-h-[690px] w-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.92] transition duration-500 hover:scale-[1.015] hover:brightness-[0.9]"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080504]/68 via-[#080504]/14 to-transparent" />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_46px_rgba(8,5,4,0.72)]" />

                <div className="absolute right-5 bottom-5 left-5 z-30">
                  <div className="pointer-events-none absolute inset-0 bg-[#080504]/24 backdrop-blur-[0.5px]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,4,0.58)_0%,rgba(8,5,4,0.34)_52%,rgba(8,5,4,0.08)_100%)]" />

                  <div className="relative z-10 px-5 py-4">
                    <p className="mb-2 font-['IM_Fell_English_SC'] text-[11px] uppercase tracking-[0.24em] text-[#c89b3c]">
                      Première sortie officielle
                    </p>

                    <h3 className="font-['IM_Fell_English_SC'] text-3xl uppercase leading-[0.92] text-[#fff1d2] drop-shadow-[0_6px_16px_rgba(0,0,0,0.9)] md:text-4xl">
                      Salon de la Passion Médiévale
                    </h3>

                    <p className="mt-3 max-w-none font-['EB_Garamond'] text-lg leading-7 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      Cette année, Panassor présentait ses premiers kits au
                      public lors du Salon de la Passion Médiévale. Une première
                      rencontre avec la communauté, nos accessoires sur table,
                      et le début concret de l’univers Panassor hors de
                      l’atelier.
                    </p>
                  </div>
                </div>
              </div>
            </button>

            <div className="grid gap-10">
              {conventionImages.slice(1).map((image) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="relative min-h-[347px] border border-[#c89b3c]/40 bg-[#120c07] p-3 text-left shadow-[0_20px_55px_rgba(0,0,0,0.55)]"
                  aria-label={`Ouvrir l’image : ${image.alt}`}
                >
                  <CornerFrame inset="outside" size="lg" />

                  <div className="relative h-full min-h-[323px] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full min-h-[323px] w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[0.92] transition duration-500 hover:scale-[1.02] hover:brightness-[0.92]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080504]/35 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(8,5,4,0.55)]" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <OrnamentDivider className="mt-16" width={112} opacity={0.55} />
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030201]/92 px-6 py-8 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 z-20 border border-[#c89b3c]/70 bg-[#120c07] px-4 py-2 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.14em] text-[#e7c97b] transition hover:bg-[#c89b3c] hover:text-[#100805]"
          >
            Fermer
          </button>

          <div
            className="relative max-h-full max-w-[92vw] border border-[#c89b3c]/60 bg-[#080504] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.85)]"
            onClick={(event) => event.stopPropagation()}
          >
            <CornerFrame inset="outside" size="lg" />

            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[82vh] max-w-full object-contain"
            />

            <p className="mt-4 max-w-4xl font-['EB_Garamond'] text-lg leading-7 text-[#d7c8ad]/80">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AtelierConventionGallery;