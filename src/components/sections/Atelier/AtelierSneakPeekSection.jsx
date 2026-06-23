import OrnamentDivider from "../../ui/OrnamentDivider";
import SectionAtmosphere from "../../layout/SectionAtmosphere";
import SectionTitle from "../../layout/SectionTitle";
import CollectionAvenirHero from "./CollectionAvenirHero";

const collectionAVenir = {
  id: "kit-voleur-avenir",
  name_fr: "Kit de voleur",
  title_fr: "Kit de voleur",
  eyebrow_fr: "Prochainement",
  description_fr:
    "Le prochain univers Panassor se prépare dans l’ombre. Suivez-nous sur Facebook pour voir les aperçus, les pistes de création et nous laisser vos suggestions.",
  hero_image_url: "/images/kit_de_voleur.jpg",
};

function AtelierSneakPeekSection() {
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
          collection={collectionAVenir}
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