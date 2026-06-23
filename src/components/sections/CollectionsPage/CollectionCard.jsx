import CornerFrame from "../../ui/CornerFrame";
import OrnamentDivider from "../../ui/OrnamentDivider";

function getMobileTitleWords(title) {
  return String(title || "")
    .split(" ")
    .filter(Boolean);
}

function CollectionCard({ collection, index = 0, onClick }) {
  const imageFirst = index % 2 === 1;
  const mobileTitleWords = getMobileTitleWords(collection.title_fr);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid w-full overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78),0_0_34px_rgba(200,155,60,0.08)] md:hover:-translate-y-1 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

      {/* IMAGE */}
      <div
        className={`relative min-h-[18rem] overflow-hidden bg-[#0b0704] md:min-h-[20rem] ${
          imageFirst ? "lg:order-first" : ""
        }`}
      >
        <img
          src={collection.thumbnail_image_url || collection.hero_image_url}
          alt={collection.title_fr}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center brightness-[0.68] contrast-[1.08] saturate-[1.02] transition duration-500 group-hover:scale-[1.035] group-hover:brightness-[0.9] md:brightness-[0.82] md:group-hover:brightness-[0.95]"
        />

        <div className="absolute inset-0 bg-[#080504]/18 md:bg-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/88 via-[#080504]/30 to-[#080504]/10 md:from-[#080504]/72 md:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/28 via-transparent to-[#080504]/28 md:from-[#080504]/18 md:to-[#080504]/18" />
        <div className="absolute inset-0 shadow-[inset_0_0_54px_rgba(8,5,4,0.62)] md:shadow-[inset_0_0_54px_rgba(8,5,4,0.55)]" />

        <CornerFrame
          inset="cardImage"
          size="md"
          thickness="subtle"
          color="gold"
        />

        {/* MOBILE TITLE OVER IMAGE */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-7 pt-16 md:hidden">
          <div className="mb-4 flex items-center justify-center gap-3 text-[#c89b3c]">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c89b3c]/70" />
            <span className="text-sm">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#c89b3c]/70" />
          </div>

          <p className="mb-3 text-center font-['IM_Fell_English_SC'] text-[0.7rem] uppercase tracking-[0.24em] text-[#c89b3c]">
            {collection.eyebrow_fr}
          </p>

          <h3 className="text-center font-['IM_Fell_English_SC'] text-[clamp(2.65rem,11vw,3.35rem)] uppercase leading-[0.9] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)]">
            {mobileTitleWords.map((word) => (
              <span key={word} className="block">
                {word}
              </span>
            ))}
          </h3>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[auto] flex-col justify-center px-6 pb-7 pt-6 text-center md:min-h-[18rem] md:p-10 md:text-left">
        <div className="hidden md:block">
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
        </div>

        <p className="mx-auto max-w-2xl font-['EB_Garamond'] text-[1.28rem] leading-7 text-[#d7c8ad]/84 md:mx-0 md:mt-6 md:text-2xl md:leading-8">
          {collection.description_fr}
        </p>

        <span className="mt-7 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.06em] text-[#e7c97b] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805] md:mt-8 md:w-fit md:text-lg">
          Découvrir la collection
        </span>
      </div>
    </button>
  );
}

export default CollectionCard;