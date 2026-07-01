[NO CONTENT FOUND]Ah, misère ! Je vois exactement ce qui se passe sur tes deux captures de la page Contact (image_1a1f3c.png et image_1a7157.png). Oublie PageHeroBanner, c'est réglé. Le problème est directement dans ton fichier ContactPage.jsx, plus précisément dans les deux boîtes du milieu ("Une idée hors collection?").

Regarde ton code :
La boîte de gauche contenant l'image du kit de voleur est configurée avec une hauteur minimale fixe stricte (min-h-[34rem]).
Par contre, ta boîte de droite (qui contient le texte "Une idée hors collection ?") n'a aucune hauteur définie. En mode Desktop, la ligne décorative du bas (OrnamentDivider className="mx-auto mt-32") vient remonter et s'écraser directement sous tes boutons, ce qui fait disparaître l'espace et coupe le layout !

Pour que les deux blocs soient parfaitement symétriques, fixes, et que l'ornement du bas reste sagement à sa place sans jamais couper tes sections, on va utiliser une grille flex standardisée.

Voici ton fichier ContactPage.jsx corrigé :

JavaScript
import { useNavigate } from "react-router-dom";

import PageHeroBanner from "../components/layout/PageHeroBanner";
import SectionAtmosphere from "../components/layout/SectionAtmosphere";
import SectionTitle from "../components/layout/SectionTitle";
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

      <section className="relative overflow-hidden bg-[#080504] px-6 pt-28 pb-40 text-[#f3e7cf]">
        <SectionAtmosphere variant="featured" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_34%,rgba(35,72,40,0.2),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_22%,rgba(200,155,60,0.12),transparent_32%)]" />

        <div className="relative z-10 mx-auto max-w-[88rem]">
          <div className="mx-auto max-w-5xl text-center">
            <SectionTitle
              eyebrow="Correspondance"
              title="Nous contacter"
              align="center"
              showDivider={false}
            />

            <OrnamentDivider className="mt-7" width={112} opacity={0.65} />

            <p className="mx-auto mt-9 max-w-4xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/84 md:text-3xl md:leading-10">
              Venez nous suivre sur Facebook, nous dire salut et suivre les
              aperçus des prochains kits. Pour toute question, commande unique,
              collaboration ou demande spéciale, contactez-nous par Messenger ou
              par courriel.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://www.facebook.com/profile.php?id=61587079943525"
                target="_blank"
                rel="noreferrer"
                className={`${goldButtonClass} px-9 py-5 text-xl`}
              >
                Suivre sur Facebook
              </a>

              <a
                href="mailto:contact@panassor.com"
                className={`${greenButtonClass} px-9 py-5 text-xl`}
              >
                <span className="mr-4">✦</span>
                contact@panassor.com
              </a>
            </div>
          </div>

          <div className="mx-auto mt-24 h-px max-w-5xl bg-gradient-to-r from-transparent via-[#c89b3c]/55 to-transparent" />

          {/* AJUSTEMENT DU PARENT : On force la grille à étirer ses deux enfants de manière égale (items-stretch) */}
          <div className="mx-auto mt-24 grid max-w-[82rem] gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            
            <div className="relative min-h-[34rem] overflow-hidden border border-[#6f5423]/70 bg-[#120c07] shadow-[0_22px_70px_rgba(0,0,0,0.62)]">
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
                <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                  Commande unique
                </p>

                <h2 className="mt-3 font-['IM_Fell_English_SC'] text-5xl uppercase leading-none text-[#fff1d2] drop-shadow-[0_8px_18px_rgba(0,0,0,0.95)] md:text-6xl">
                  Un objet pour votre personnage
                </h2>
              </div>
            </div>

            {/* RECTIFICATION DE LA BOÎTE DE TEXTE : 
                On lui donne un flex layout vertical pour qu'elle s'aligne proprement avec la hauteur de l'image à sa gauche,
                ce qui empêche le contenu du dessous de remonter trop haut. */}
            <div className="flex flex-col justify-center py-4">
              <p className="mb-5 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                Commandes et projets spéciaux
              </p>

              <h2 className="font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.9] text-[#fff1d2] md:text-7xl">
                Une idée hors collection?
              </h2>

              <div className="my-8 h-px w-72 bg-gradient-to-r from-[#c89b3c] to-transparent" />

              <div className="space-y-6 font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/84">
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

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:contact@panassor.com?subject=Commande%20unique%20Panassor"
                  className={goldButtonClass}
                >
                  <span className="mr-3">✦</span>
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
            className="mx-auto mt-32"
            width={136}
            opacity={0.55}
          />

          <div className="mx-auto mt-20 max-w-[82rem]">
            <div className="relative border-y border-[#6f5423]/60 px-8 py-20 md:px-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(200,155,60,0.1),transparent_34%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_50%,rgba(35,72,40,0.16),transparent_36%)]" />

              <div className="relative z-10 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <div className="mb-5 flex items-center gap-4">
                    <div className="h-px w-16 bg-[#c89b3c]/80" />

                    <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                      Facebook
                    </p>

                    <div className="hidden h-px w-16 bg-[#c89b3c]/60 sm:block" />
                  </div>

                  <h2 className="max-w-4xl font-['IM_Fell_English_SC'] text-5xl uppercase leading-[0.92] text-[#fff1d2] md:text-6xl">
                    Suivre ce qui se prépare dans l’ombre
                  </h2>

                  <p className="mt-7 max-w-3xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/80">
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