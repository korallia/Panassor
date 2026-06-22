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
  return (
    <section className="relative overflow-hidden bg-[#080504] px-6 pt-12 pb-32 text-[#f3e7cf]">
      <SectionAtmosphere variant="featured" />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <PanassorSectionHeader
          eyebrow="Galerie"
          title="Panassor en convention"
          description=" Les photos montrent une partie de l’expérience, mais rien ne
            remplace le moment où l’on peut prendre les kits en main, voir les
            détails de près et discuter avec nous de vos personnages, scènes et
            idées de jeu."
          showAtmosphere={false}
          className="mx-auto mb-16 max-w-[78rem]"
        />

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.75fr]">
          <div className="relative min-h-[720px] overflow-hidden border border-[#c89b3c]/55 bg-[#120c07] p-4 shadow-[0_28px_80px_rgba(0,0,0,0.72)]">
            <CornerFrame
              inset="cardImage"
              size="lg"
              thickness="subtle"
              color="gold"
            />

            <img
              src={conventionImages[0].src}
              alt={conventionImages[0].alt}
              className="h-full min-h-[690px] w-full object-cover brightness-[0.82] contrast-[1.08] saturate-[0.92]"
            />

            <div className="pointer-events-none absolute inset-4 bg-gradient-to-t from-[#080504]/82 via-[#080504]/18 to-transparent" />

            <div className="absolute bottom-8 left-8 right-8 z-20 max-w-3xl">
              <p className="mb-3 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#c89b3c]">
                Première sortie officielle
              </p>

              <h3 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-5xl">
                Salon de la Passion Médiévale
              </h3>

              <p className="mt-4 max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/88">
                Cette année, Panassor présentait ses premiers kits au public lors
                du Salon de la Passion Médiévale. Une première rencontre avec la
                communauté, nos accessoires sur table, et le début concret de
                l’univers Panassor hors de l’atelier.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {conventionImages.slice(1).map((image) => (
              <div
                key={image.src}
                className="relative min-h-[347px] overflow-hidden border border-[#c89b3c]/40 bg-[#120c07] p-3 shadow-[0_20px_55px_rgba(0,0,0,0.55)]"
              >
                <CornerFrame
                  inset="cardImage"
                  size="sm"
                  thickness="subtle"
                  color="gold"
                />

                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full min-h-[323px] w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[0.92]"
                />

                <div className="pointer-events-none absolute inset-3 bg-gradient-to-t from-[#080504]/35 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

        

        <OrnamentDivider className="mt-16" width={112} opacity={0.55} />
      </div>
    </section>
  );
}

export default AtelierConventionGallery;