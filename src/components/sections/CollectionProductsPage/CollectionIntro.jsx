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

      <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-6 lg:grid-cols-2">
        <div className="-translate-y-6 flex flex-col items-start text-left">
          <OrnamentDivider
            className="mb-6 justify-start"
            width={96}
            opacity={0.7}
          />

          <h1 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-7xl xl:text-8xl">
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