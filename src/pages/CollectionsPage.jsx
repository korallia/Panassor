import { useNavigate } from "react-router-dom";
import { collectionsList } from "../data/panassorCollections";


function CollectionsPage() {
  const navigate = useNavigate();

  return (

      <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
        <section className="relative h-[430px] overflow-hidden bg-[#120c07]">
          <img
            src="/images/collections-hero.png"
            alt="Collections Panassor"
            className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.68] contrast-[1.08] saturate-[0.95]"
          />

          <div className="absolute inset-0 bg-[#080504]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/94 via-[#080504]/64 to-[#080504]/24" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/76 via-transparent to-[#080504]/30" />

          <div className="pointer-events-none absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-[#080504] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-[#080504] to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent via-[#080504]/70 to-[#080504]" />

          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="absolute left-14 top-10 h-10 w-10 border-l border-t border-[#f3d58b]/65" />
            <div className="absolute right-14 top-10 h-10 w-10 border-r border-t border-[#f3d58b]/65" />
            <div className="absolute bottom-20 left-14 h-10 w-10 border-b border-l border-[#f3d58b]/65" />
            <div className="absolute bottom-20 right-14 h-10 w-10 border-b border-r border-[#f3d58b]/65" />
          </div>

          <div className="relative z-30 mx-auto grid h-full max-w-[88rem] items-center px-6 lg:grid-cols-2">
            <div className="-translate-y-6 flex flex-col items-start text-left">
              <div className="mb-6 flex items-center justify-start gap-4 text-[#d8a24c]">
                <div className="h-px w-24 bg-[#d8a24c]/70" />
                <span className="text-xl">✦</span>
                <div className="h-px w-24 bg-[#d8a24c]/70" />
              </div>

              <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.38em] text-[#d8a24c]">
                Univers Panassor
              </p>

              <h1 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.88] text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-7xl xl:text-8xl">
                Collections
              </h1>

              <p className="mt-8 max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/88 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]">
                Des kits immersifs pensés pour enrichir les scènes, soutenir les
                personnages et donner une vraie présence aux moments de jeu.
              </p>

              <div className="mt-7 flex items-center justify-start gap-4 text-[#d8a24c]">
                <div className="h-px w-24 bg-[#d8a24c]/70" />
                <span className="text-xl">✦</span>
                <div className="h-px w-24 bg-[#d8a24c]/70" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#080504] px-6 pt-24 pb-32">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#120c07] via-[#080504] to-transparent" />

          <div className="pointer-events-none absolute left-1/2 top-24 h-[28rem] w-[64rem] -translate-x-1/2 rounded-full bg-[#c89b3c]/8 blur-3xl" />
          <div className="pointer-events-none absolute left-[12%] top-[34rem] h-[34rem] w-[34rem] rounded-full bg-[#15361f]/14 blur-3xl" />
          <div className="pointer-events-none absolute right-[10%] top-[48rem] h-[30rem] w-[30rem] rounded-full bg-[#234828]/12 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-[78rem]">
            <div className="mb-16 text-center">
              <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.35em] text-[#c89b3c]">
                Collections courantes
              </p>

              <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] md:text-7xl">
                Choisir un univers
              </h2>

              <p className="mx-auto mt-8 max-w-3xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/82">
                Chaque collection rassemble des accessoires conçus autour d’une
                ambiance, d’un rôle et d’un type de scène.
              </p>
            </div>

            <div className="space-y-8">
              {collectionsList.map((collection, index) => (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => navigate(collection.url)}
                  className="group relative grid w-full overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:-translate-y-1 hover:border-[#c89b3c]/90 hover:shadow-[0_24px_70px_rgba(0,0,0,0.78),0_0_34px_rgba(200,155,60,0.08)] lg:grid-cols-[1.15fr_0.85fr]"
                >
                  <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

                  <div className="relative z-10 flex min-h-[18rem] flex-col justify-center p-8 md:p-10">
                    <div className="mb-5 flex w-36 items-center gap-4 text-[#c89b3c]">
                      <div className="h-px flex-1 bg-[#c89b3c]/70" />
                      <span className="text-lg">✦</span>
                      <div className="h-px flex-1 bg-[#c89b3c]/70" />
                    </div>

                    <p className="mb-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.32em] text-[#c89b3c]">
                      {collection.eyebrow}
                    </p>

                    <h3 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] transition group-hover:text-[#e7c97b] md:text-6xl">
                      {collection.title}
                    </h3>

                    <p className="mt-6 max-w-2xl font-['EB_Garamond'] text-2xl leading-8 text-[#d7c8ad]/84">
                      {collection.description}
                    </p>

                    <span className="mt-8 inline-flex w-fit items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-lg uppercase tracking-[0.06em] text-[#e7c97b] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
                      {collection.cta}
                    </span>
                  </div>

                  <div
                    className={`relative min-h-[18rem] overflow-hidden bg-[#0b0704] ${
                      index % 2 === 1 ? "lg:order-first" : ""
                    }`}
                  >
                    <img
                      src={collection.thumbnail || collection.image}
                      alt={collection.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover brightness-[0.82] contrast-[1.08] saturate-[1.02] transition duration-500 group-hover:scale-[1.035] group-hover:brightness-[0.95]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/72 via-transparent to-[#080504]/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/18 via-transparent to-[#080504]/18" />
                    <div className="absolute inset-0 shadow-[inset_0_0_54px_rgba(8,5,4,0.55)]" />

                    <div className="absolute left-5 top-5 h-12 w-12 border-l border-t border-[#c89b3c]/75" />
                    <div className="absolute right-5 top-5 h-12 w-12 border-r border-t border-[#c89b3c]/75" />
                    <div className="absolute bottom-5 left-5 h-12 w-12 border-b border-l border-[#c89b3c]/75" />
                    <div className="absolute bottom-5 right-5 h-12 w-12 border-b border-r border-[#c89b3c]/75" />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-20 flex items-center justify-center gap-4 text-[#c89b3c]">
              <div className="h-px w-28 bg-gradient-to-r from-transparent to-[#c89b3c]/55" />
              <span className="text-lg">✦</span>
              <div className="h-px w-28 bg-gradient-to-l from-transparent to-[#c89b3c]/55" />
            </div>
          </div>
        </section>
      </main>

      
  );
}

export default CollectionsPage;