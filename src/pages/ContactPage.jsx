import { useNavigate } from "react-router-dom";

import PageHeroBanner from "../components/layout/PageHeroBanner";
import SectionAtmosphere from "../components/layout/SectionAtmosphere";
import OrnamentDivider from "../components/ui/OrnamentDivider";
import CornerFrame from "../components/ui/CornerFrame";

const goldButtonClass =
  "inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]";

const greenButtonClass =
  "inline-flex items-center justify-center border border-[#b8964a] bg-[#1f3324]/95 px-7 py-4 font-['IM_Fell_English_SC'] text-base uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]";

function ContactPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#080504] text-[#f3e7cf]">
      <PageHeroBanner
        image="/images/collections-hero.png"
        alt="Contact Panassor"
        eyebrow="Correspondance"
        title="Contact"
        description="Venez nous dire salut, suivre nos projets et nous écrire pour toute question ou demande spéciale."
      />

      <section className="relative overflow-hidden bg-[#080504] px-6 pb-40 pt-24 text-[#f3e7cf]">
        <SectionAtmosphere variant="featured" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_34%,rgba(35,72,40,0.2),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(200,155,60,0.12),transparent_32%)]" />

        <div className="relative z-10 mx-auto max-w-[88rem]">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
              Correspondance
            </p>

            <h2 className="mt-3 font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] sm:text-5xl md:text-6xl">
              Nous contacter
            </h2>

            <OrnamentDivider className="mt-6" width={112} opacity={0.65} />

            <p className="mx-auto mt-8 max-w-4xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/84 md:text-2xl md:leading-9">
              Venez nous suivre sur Facebook, nous dire salut et suivre les
              aperçus des prochains kits. Pour toute question, commande unique,
              collaboration ou demande spéciale, contactez-nous par Messenger ou
              par courriel.
            </p>

            <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <a
                href="https://www.facebook.com/profile.php?id=61587079943525"
                target="_blank"
                rel="noreferrer"
                className={`${goldButtonClass} px-9 py-4 text-lg md:text-xl`}
              >
                Suivre sur Facebook
              </a>

              <a
                href="mailto:contact@panassor.com"
                className={`${greenButtonClass} px-9 py-4 text-lg md:text-xl`}
              >
                <span className="mr-3">✦</span>
                contact@panassor.com
              </a>
            </div>
          </div>

          <div className="mx-auto mt-20 h-px max-w-5xl bg-gradient-to-r from-transparent via-[#c89b3c]/40 to-transparent" />

          <div className="mx-auto mt-20 grid max-w-[82rem] gap-12 lg:grid-cols-2 lg:items-stretch">
            <div className="relative min-h-[28rem] overflow-hidden border border-[#6f5423]/70 bg-[#120c07] shadow-[0_22px_70px_rgba(0,0,0,0.62)] sm:min-h-[32rem] md:min-h-[35rem]">
              <img
                src="/images/kit_de_voleur.jpg"
                alt="Commande unique Panassor"
                className="absolute inset-0 h-full w-full object-cover brightness-[0.55] contrast-[1.12] saturate-[0.88]"
              />

              <div className="absolute inset-0 bg-[#080504]/28" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/88 via-[#080504]/28 to-transparent" />
              <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(8,5,4,0.75)]" />

              <CornerFrame size="lg" />

              <div className="absolute bottom-8 left-8 right-8">
                <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#c89b3c] sm:text-sm">
                  Commande unique
                </p>

                <h2 className="mt-3 font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] sm:text-5xl">
                  Un objet pour votre personnage
                </h2>
              </div>
            </div>

            <div className="flex flex-col justify-center border border-[#6f5423]/30 bg-[#120c07]/30 px-8 py-10 md:px-12">
              <p className="font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#c89b3c] sm:text-sm">
                Commandes et projets spéciaux
              </p>

              <h2 className="mt-2 font-['IM_Fell_English_SC'] text-4xl uppercase leading-[0.95] text-[#fff1d2] sm:text-5xl md:text-6xl">
                Une idée hors collection?
              </h2>

              <div className="my-6 h-px w-48 bg-gradient-to-r from-[#c89b3c] to-transparent" />

              <div className="space-y-4 font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/84 md:text-2xl md:leading-9">
                <p>
                  Vous avez une idée pour un accessoire, une commande unique ou
                  un projet spécial? Écrivez-nous simplement ce que vous avez en
                  tête.
                </p>

                <p>
                  Que ce soit pour un personnage, un événement ou une
                  collaboration, on pourra regarder avec vous si le projet est
                  possible.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:contact@panassor.com?subject=Commande%20unique%20Panassor"
                  className={goldButtonClass}
                >
                  <span className="mr-2">✦</span>
                  Écrire à l’atelier
                </a>

                <a
                  href="https://www.facebook.com/profile.php?id=61587079943525"
                  target="_blank"
                  rel="noreferrer"
                  className={greenButtonClass}
                >
                  Nous écrire sur Messenger
                </a>
              </div>
            </div>
          </div>

          <OrnamentDivider
            className="mx-auto mt-28"
            width={136}
            opacity={0.55}
          />

          <div className="mx-auto mt-20 max-w-[82rem]">
            <div className="relative border-y border-[#6f5423]/60 px-8 py-16 md:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(200,155,60,0.1),transparent_34%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_50%,rgba(35,72,40,0.16),transparent_36%)]" />

              <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-px w-16 bg-[#c89b3c]/80" />

                    <p className="shrink-0 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.28em] text-[#c89b3c] sm:text-sm">
                      Facebook
                    </p>

                    <div className="h-px w-16 bg-[#c89b3c]/60" />
                  </div>

                  <h2 className="max-w-4xl font-['IM_Fell_English_SC'] text-4xl uppercase leading-[0.95] text-[#fff1d2] sm:text-5xl">
                    Suivre ce qui se prépare dans l’ombre
                  </h2>

                  <p className="mt-5 max-w-3xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/80 md:text-2xl md:leading-9">
                    On y partage les aperçus, les projets à venir et les
                    nouvelles de l’atelier. Passez nous dire salut, poser une
                    question ou suivre ce qui se prépare.
                  </p>
                </div>

                <div className="flex flex-col gap-4 lg:items-end">
                  <a
                    href="https://www.facebook.com/profile.php?id=61587079943525"
                    target="_blank"
                    rel="noreferrer"
                    className={`${goldButtonClass} w-full sm:w-fit`}
                  >
                    Suivre sur Facebook
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate("/atelier#sneak-peek")}
                    className={`${greenButtonClass} w-full sm:w-fit`}
                  >
                    Voir les projets à venir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactPage;