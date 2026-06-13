import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CornerFrame from "../components/ui/CornerFrame";
import CarouselArrow from "../components/ui/CarouselArrow";

import { collectionsList, formatPrice } from "../data/panassorCollections";

function ProductPage() {
  const { slug } = useParams();

  const productMatch = useMemo(() => {
    for (const collection of collectionsList) {
      const product = collection.products.find((item) => item.slug === slug);

      if (product) {
        return { product, collection };
      }
    }

    return null;
  }, [slug]);

  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);

  if (!productMatch) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#080504] px-6 py-32 text-[#f3e7cf]">
          <div className="mx-auto max-w-[88rem]">
            <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.35em] text-[#c89b3c]">
              Produit introuvable
            </p>

            <h1 className="mt-4 font-['IM_Fell_English_SC'] text-5xl uppercase text-[#fff1d2]">
              Ce produit n’existe pas encore.
            </h1>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const { product, collection } = productMatch;

  const productMedia = [
    {
      type: "image",
      src: product.image,
      alt: product.name,
    },
    ...(product.gallery ?? []).map((image) => ({
      type: "image",
      src: image,
      alt: product.name,
    })),
    ...(collection.video?.src
      ? [
          {
            type: "video",
            src: collection.video.src,
            poster: collection.video.poster,
            alt: collection.video.title ?? "Vidéo du produit",
          },
        ]
      : []),
    {
      type: "image",
      src: collection.heroImage,
      alt: collection.name,
    },
    {
      type: "image",
      src: collection.thumbnail,
      alt: collection.name,
    },
  ].filter((item) => item.src);

  const selectedMedia = productMedia[selectedMediaIndex] ?? productMedia[0];

  const kitItems = collection.products.filter((item) => !item.featured);
  const customizableItems = kitItems.filter((item) => item.customizable);

  const leatherColors = product.leatherColors ?? [
    { name: "Brun foncé", value: "#2a160c" },
    { name: "Bordeaux", value: "#401918" },
    { name: "Noir", value: "#141414" },
  ];

  const otherCollections = collectionsList.filter(
    (item) => item.slug !== collection.slug
  );

  const goPreviousMedia = () => {
    setSelectedMediaIndex((current) =>
      current === 0 ? productMedia.length - 1 : current - 1
    );
  };

  const goNextMedia = () => {
    setSelectedMediaIndex((current) =>
      current === productMedia.length - 1 ? 0 : current + 1
    );
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden bg-[#080504] text-[#f3e7cf]">
        {/* PRODUCT HERO */}
        <section className="relative px-6 pt-9 pb-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(200,155,60,0.13),transparent_30%),radial-gradient(circle_at_18%_72%,rgba(6,40,24,0.34),transparent_34%),radial-gradient(circle_at_86%_68%,rgba(88,43,18,0.24),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(18,12,7,0.84),rgba(8,5,4,0.96)_32%,#080504)]" />

          <div className="relative mx-auto max-w-[88rem]">
            <nav className="mb-5 flex flex-wrap items-center gap-2 font-['IM_Fell_English_SC'] text-[0.7rem] uppercase tracking-[0.18em] text-[#8d6c34]">
              <Link to="/" className="transition hover:text-[#c89b3c]">
                Accueil
              </Link>

              <span>›</span>

              <Link to="/boutique" className="transition hover:text-[#c89b3c]">
                Boutique
              </Link>

              <span>›</span>

              <Link
                to={collection.url}
                className="transition hover:text-[#c89b3c]"
              >
                {collection.name}
              </Link>

              <span>›</span>

              <span className="text-[#b88b45]">{product.name}</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1.28fr_0.72fr] lg:items-start">
              {/* LEFT CARD */}
              <div className="relative">
                <div className="relative overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_22px_70px_rgba(0,0,0,0.68)]">
                  <div className="relative h-[470px] overflow-hidden md:h-[610px]">
                    {selectedMedia?.type === "video" ? (
                      <video
                        src={selectedMedia.src}
                        poster={selectedMedia.poster}
                        controls
                        className="h-full w-full object-cover brightness-[0.78] contrast-[1.1] saturate-[0.92]"
                      />
                    ) : (
                      <img
                        src={selectedMedia?.src}
                        alt={selectedMedia?.alt ?? product.name}
                        className="h-full w-full object-cover brightness-[0.78] contrast-[1.1] saturate-[0.92]"
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080504]/35 via-transparent to-[#080504]/12" />
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.68)]" />

                    <CornerFrame size="lg" />
                  </div>

                  <div className="border-t border-[#6f5423]/55 bg-[#0b0705]/92 px-5 py-5">
                    <div className="grid grid-cols-[34px_1fr_34px] items-center gap-4">
                      <button
                        type="button"
                        onClick={goPreviousMedia}
                        aria-label="Image précédente"
                        className="flex h-9 w-9 items-center justify-center font-['IM_Fell_English_SC'] text-3xl text-[#c89b3c] transition hover:text-[#fff1d2]"
                      >
                        ‹
                      </button>

                      <div className="grid grid-cols-5 gap-3">
                        {productMedia.slice(0, 5).map((media, index) => (
                          <button
                            key={`${media.src}-${index}`}
                            type="button"
                            onClick={() => setSelectedMediaIndex(index)}
                            className={`relative h-[78px] overflow-hidden border bg-[#120c07] transition ${
                              selectedMediaIndex === index
                                ? "border-[#c89b3c] shadow-[0_0_18px_rgba(200,155,60,0.24)]"
                                : "border-[#6f5423]/65 hover:border-[#c89b3c]/80"
                            }`}
                          >
                            <img
                              src={
                                media.type === "video" ? media.poster : media.src
                              }
                              alt=""
                              className="h-full w-full object-cover brightness-[0.74] contrast-[1.08]"
                            />

                            {media.type === "video" && (
                              <span className="absolute inset-x-2 bottom-2 border border-[#c89b3c]/65 bg-[#080504]/78 px-2 py-1 font-['IM_Fell_English_SC'] text-[0.58rem] uppercase tracking-[0.14em] text-[#d8b56f]">
                                Vidéo
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={goNextMedia}
                        aria-label="Image suivante"
                        className="flex h-9 w-9 items-center justify-center font-['IM_Fell_English_SC'] text-3xl text-[#c89b3c] transition hover:text-[#fff1d2]"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <aside>
                <div className="group relative overflow-hidden border border-[#6f5423]/75 bg-[linear-gradient(180deg,#160e08_0%,#0b0603_100%)] px-8 py-9 text-left shadow-[0_18px_50px_rgba(0,0,0,0.62)] transition duration-300 hover:border-[#c89b3c]/90 md:px-10 md:py-10">
                  <div className="pointer-events-none absolute inset-2 border border-[#c89b3c]/10" />

                  <div className="relative z-10">
                    {/* TOP ORNAMENT - LEFT ALIGNED */}
                    <div className="mb-7 flex w-60 max-w-full items-center gap-4 text-[#c89b3c]">
                      <div className="h-px flex-1 bg-[#c89b3c]/70" />

                      <span className="font-['IM_Fell_English_SC'] text-[0.72rem] uppercase tracking-[0.24em] text-[#c89b3c]">
                        {collection.name}
                      </span>

                      <div className="h-px flex-1 bg-[#c89b3c]/70" />
                    </div>

                    <h1 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] transition duration-300 group-hover:text-[#e7c97b] md:text-5xl">
                      {product.name}
                    </h1>

                    <p className="mt-6 max-w-[360px] font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/84">
                      {product.longDescription ?? product.description}
                    </p>

                    {/* BUY BLOCK */}
                    <div className="mt-8 max-w-[300px]">
                      <p className="font-['EB_Garamond'] text-4xl leading-none text-[#e7c97b]">
                        {formatPrice(product.price, product.currency)}
                      </p>

                      <div className="mt-4 flex w-52 items-center gap-4 text-[#c89b3c]">
                        <div className="h-px flex-1 bg-[#c89b3c]/50" />
                        <span className="text-lg">✦</span>
                        <div className="h-px flex-1 bg-[#c89b3c]/50" />
                      </div>

                      <span className="mt-4 inline-flex w-full items-center justify-center border border-[#c89b3c] bg-[#24170d] px-5 py-3 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.16em] text-[#e7c97b] transition duration-300 group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
                       
                        Ajouter au panier
                      </span>
                    </div>

                    {/* ORNAMENT BEFORE COLORS - SAME ALIGNMENT/SIZE AS BUY ORNAMENT */}
                    <div className="mt-8 flex w-52 items-center gap-4 text-[#c89b3c]">
                      <div className="h-px flex-1 bg-[#c89b3c]/50" />
                      <span className="text-lg">✦</span>
                      <div className="h-px flex-1 bg-[#c89b3c]/50" />
                    </div>

                    {/* LEATHER COLORS - LEFT PLACEMENT */}
                    <div className="mt-5 flex gap-4">
                      {leatherColors.map((color, index) => (
                        <button
                          key={color.name}
                          type="button"
                          title={color.name}
                          className={`h-10 w-10 rounded-full border transition ${
                            index === 0
                              ? "border-[#e3c17a]"
                              : "border-[#6f5423] hover:border-[#c89b3c]"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>


{/* ORNAMENT BEFORE CUSTOMIZABLE ITEMS */}
<div className="mt-7 flex w-52 items-center gap-4 text-[#c89b3c]">
  <div className="h-px flex-1 bg-[#c89b3c]/50" />
  <span className="text-lg">✦</span>
  <div className="h-px flex-1 bg-[#c89b3c]/50" />
</div>

{customizableItems.length > 0 && (
  <div className="mt-8 space-y-3">
    {customizableItems.map((item) => (
      <button
        key={item.id}
        type="button"
        className="group/item grid min-h-[68px] w-full grid-cols-[76px_1fr] overflow-hidden border border-[#b8964a] bg-[#1f3324]/95 text-left font-['IM_Fell_English_SC'] uppercase tracking-[0.08em] text-[#e4c36a] shadow-[0_0_24px_rgba(0,0,0,0.35)] transition hover:bg-[#2a4630] hover:text-[#f7ead2]"
      >
        <div className="h-full min-h-[68px] overflow-hidden border-r border-[#b8964a]/80 bg-[#080504]">
          <img
            src={item.image}
            alt=""
            className="h-full w-full object-cover brightness-[0.86] contrast-[1.1] saturate-[0.9] transition duration-500 group-hover/item:brightness-[0.98]"
          />
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="text-sm tracking-[0.12em]">
            {item.shortName ?? item.name}
          </span>

          <span className="font-['IM_Fell_English_SC'] text-[0.6rem] uppercase tracking-[0.18em] text-[#d8b56f]/80 transition group-hover/item:text-[#f7ead2]/90">
            Modifier
          </span>
        </div>
      </button>
    ))}
  </div>
)}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* NARRATIVE BANNER */}
        <section className="relative px-6 pb-8">
          <div className="relative mx-auto max-w-[88rem] overflow-hidden border border-[#6f5423]/75 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.58)]">
            <img
              src={collection.heroImage ?? collection.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover brightness-[0.36] contrast-[1.15] saturate-[0.88]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/96 via-[#080504]/74 to-[#080504]/34" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080504]/35 via-transparent to-[#080504]/30" />
            <div className="absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.78)]" />

            <CornerFrame size="md" />

            <div className="relative z-10 grid min-h-[205px] items-center gap-8 px-10 py-8 md:grid-cols-[0.95fr_1fr]">
              <div className="max-w-lg">
                <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.28em] text-[#c89b3c]">
                  Dans l’univers ✧
                </p>

                <h2 className="mt-2 font-['IM_Fell_English_SC'] text-4xl uppercase tracking-[0.14em] text-[#e4bf75] md:text-5xl">
                  {collection.name}
                </h2>

                <p className="mt-3 font-['EB_Garamond'] text-lg leading-6 text-[#d8c7a3]/90">
                  {collection.longDescription}
                </p>

                <div className="mt-7 flex flex-wrap gap-5">
                  {[
                    ["◌", "Matières nobles"],
                    ["✋", "Fait main en petite série"],
                    ["♢", "Conçu pour durer"],
                  ].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c89b3c]/70 bg-[#080504]/65 font-['IM_Fell_English_SC'] text-xl text-[#d8b56f]">
                        {icon}
                      </span>

                      <span className="max-w-[120px] font-['IM_Fell_English_SC'] text-[0.7rem] uppercase leading-4 tracking-[0.12em] text-[#d8c7a3]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden h-full md:block" />
            </div>
          </div>
        </section>

        {/* OTHER UNIVERSES */}
        {otherCollections.length > 0 && (
          <section className="relative px-6 pb-20 pt-2">
            <div className="mx-auto max-w-[88rem]">
              <div className="mb-4 flex items-center justify-center gap-5">
                <div className="h-px w-24 bg-gradient-to-l from-[#6f5423] to-transparent" />

                <p className="font-['IM_Fell_English_SC'] text-xl uppercase tracking-[0.38em] text-[#d8b56f]">
                  Explorez nos autres univers
                </p>

                <div className="h-px w-24 bg-gradient-to-r from-[#6f5423] to-transparent" />
              </div>

              <div className="grid grid-cols-[42px_1fr_42px] items-center gap-4">
                <CarouselArrow
                  direction="previous"
                  label="Univers précédent"
                  onClick={() => {}}
                />

                <div className="grid gap-4 lg:grid-cols-[0.8fr_1.35fr_0.8fr]">
                  {otherCollections.slice(0, 3).map((item, index) => (
                    <Link
                      key={item.id}
                      to={item.url}
                      className={`group relative min-h-[145px] overflow-hidden border bg-[#120c07] shadow-[0_14px_38px_rgba(0,0,0,0.5)] transition hover:border-[#c89b3c]/85 ${
                        index === 1
                          ? "border-[#c89b3c]/80 lg:min-h-[165px]"
                          : "border-[#6f5423]/70"
                      }`}
                    >
                      <img
                        src={item.thumbnail ?? item.image ?? item.heroImage}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover brightness-[0.56] contrast-[1.12] saturate-[0.9] transition duration-500 group-hover:scale-[1.035] group-hover:brightness-[0.68]"
                      />

                      <div className="absolute inset-0 bg-gradient-to-r from-[#080504]/88 via-[#080504]/55 to-transparent" />
                      <div className="absolute inset-0 shadow-[inset_0_0_35px_rgba(0,0,0,0.7)]" />

                      {index === 1 && <CornerFrame size="sm" />}

                      <div
                        className={`relative z-10 flex h-full flex-col justify-center p-7 ${
                          index === 1 ? "lg:pl-[44%]" : ""
                        }`}
                      >
                        <h3 className="font-['IM_Fell_English_SC'] text-3xl uppercase tracking-[0.16em] text-[#fff1d2] transition group-hover:text-[#e7c97b]">
                          {item.name}
                        </h3>

                        <p className="mt-2 max-w-sm font-['EB_Garamond'] text-lg leading-6 text-[#d8c7a3]/90">
                          {item.description}
                        </p>

                        {index === 1 && (
                          <span className="mt-5 w-fit border border-[#b88736] px-8 py-2 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.18em] text-[#d8b56f] transition group-hover:bg-[#c89b3c] group-hover:text-[#100805]">
                            Découvrir l’univers
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                <CarouselArrow
                  direction="next"
                  label="Univers suivant"
                  onClick={() => {}}
                />
              </div>

              <div className="mt-5 flex justify-center gap-4">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className={`h-3 w-3 rounded-full ${
                      dot === 0 ? "bg-[#d8b56f]" : "bg-[#3d372b]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

export default ProductPage;