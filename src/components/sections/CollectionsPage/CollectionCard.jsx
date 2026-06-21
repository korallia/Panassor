import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function CollectionCard({ collection, index = 0, onClick }) {
  const imageFirst = index % 2 === 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid w-full overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78),0_0_34px_rgba(200,155,60,0.08)] lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

      <div className="relative z-10 flex min-h-[18rem] flex-col justify-center p-8 md:p-10">
        <OrnamentDivider
          className="mb-5 justify-start"
          width={144}
          opacity={0.7}
        />

        <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.32em] text-[#c89b3c]">
          {collection.eyebrow_fr}
        </p>

        <h3 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] transition group-hover:text-[#e7c97b] md:text-6xl">
          {collection.title_fr}
        </h3>

        <p className="mt-6 max-w-2xl font-['EB_Garamond'] text-2xl leading-8 text-[#d7c8ad]/84">
          {collection.description_fr}
        </p>

        <span className="mt-8 inline-flex w-fit items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.06em] text-[#e7c97b] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
          Découvrir la collection
        </span>
      </div>

      <div
        className={`relative min-h-[18rem] overflow-hidden bg-[#0b0704] ${
          imageFirst ? "lg:order-first" : ""
        }`}
      >
        <img
          src={collection.thumbnail_image_url || collection.hero_image_url}
          alt={collection.title_fr}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover brightness-[0.82] contrast-[1.08] saturate-[1.02] transition duration-500 group-hover:scale-[1.035] group-hover:brightness-[0.95]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/72 via-transparent to-[#080504]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/18 via-transparent to-[#080504]/18" />
        <div className="absolute inset-0 shadow-[inset_0_0_54px_rgba(8,5,4,0.55)]" />

        <CornerFrame
          inset="cardImage"
          size="md"
          thickness="subtle"
          color="gold"
        />
      </div>
    </button>
  );
}

export default CollectionCard;