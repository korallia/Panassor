import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function CollectionIntro({ collection }) {
  return (
    <section className="relative h-[430px] overflow-hidden bg-[#120c07] text-[#f3e7cf]">
      <img
        src={collection.hero_image_url}
        alt={collection.title_fr}
        className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.72] contrast-[1.1] saturate-[0.95]"
      />

      <div className="absolute inset-0 bg-[#080504]/18" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/92 via-[#080504]/62 to-[#080504]/22" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/72 via-transparent to-[#080504]/28" />

      <div className="pointer-events-none absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-[#080504] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-[#080504] to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

      <CornerFrame
        inset="collectionIntro"
        size="sm"
        thickness="subtle"
        color="paleGold"
        className="z-20"
      />

      {/* CHANGEMENT ICI : On ajoute des paddings de sécurité fixes à gauche et à droite (px-12 md:px-24) 
          pour maintenir le texte TRÈS LOIN des équerres, peu importe la taille de la fenêtre. */}
      <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-12 sm:px-16 md:px-24 lg:grid-cols-2">
        
        {/* On limite la largeur maximale de la boîte de texte (max-w-[450px] à max-w-[650px]) 
            pour qu'elle ne prenne jamais toute la place horizontalement */}
        <div className="-translate-y-6 flex w-full max-w-[450px] flex-col items-start text-left sm:max-w-[550px] md:max-w-[650px]">
          
          <OrnamentDivider
            className="mb-6 justify-start"
            width={96}
            opacity={0.7}
          />

          {/* CORRECTION DU TITRE : 
              - On remplace les tailles fixes par un text-[clamp(...)] ultra adaptatif.
              - Sur mobile, il commence proprement à 2.2rem.
              - Il grossit de manière fluide avec la largeur de l'écran (5.5vw).
              - Il se stabilise à un maximum de 5rem (équivalent à ton ancien 8xl) pour les grands écrans.
              - tracking-normal pour éviter que l'espace des lettres ne pousse les bords.
          */}
          <h1 className="font-['IM_Fell_English_SC'] text-[clamp(2.2rem,5.5vw,5rem)] uppercase leading-[0.95] tracking-normal text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
            {collection.title_fr}
          </h1>

          <OrnamentDivider
            className="mt-6 justify-start"
            width={96}
            opacity={0.7}
          />
        </div>

        <div className="hidden lg:block" />
      </div>
    </section>
  );
}

export default CollectionIntro;