export const panassorCollections = {
  chirurgien: {
    id: "chirurgien",
    slug: "chirurgien",
    featured: true,

    name: "Chirurgien",
    title: "Kit Chirurgien",
    eyebrow: "Dernière collection",
    url: "/collections/chirurgien",

    description:
      "Accessoires immersifs et faits main pour sublimer vos scènes de soin, de tension et de survie en grandeur nature.",

    longDescription:
      "La collection Chirurgien rassemble des accessoires pensés pour donner du poids aux scènes médicales en jeu : soins d’urgence, diagnostics, sutures, opérations improvisées et moments de tension autour de la survie d’un personnage.",

    image: "/images/hero-kit-chirurgien.jpg",
    heroImage: "/images/hero-kit-chirurgien.jpg",
    thumbnail: "/images/hero-kit-chirurgien.jpg",

    cta: "Découvrir la collection",

    productsSection: {
      eyebrow: "Produits de la collection",
      title: "Le kit du chirurgien",
    },

    video: {
      eyebrow: "Vidéo du produit",
      title: "Voir le kit en action",
      description:
        "Chaque pièce est pensée pour être manipulée, observée et intégrée naturellement au jeu. Cette vidéo présente le contenu du kit, sa logique de rangement et son usage en scène.",
      cta: "Découvrir l’atelier",
      src: "/video/kit-chirurgien-panassor.mp4",
      poster: "/images/video-kit-chirurgien-poster.jpg",
    },

    products: [
      {
        id: "kit-chirurgien",
        slug: "kit-chirurgien",
        name: "Kit du chirurgien",
        shortName: "Kit chirurgien",
        price: 295.0,
        currency: "CAD",
        image: "/images/hero-kit-chirurgien.jpg",
        url: "/produits/kit-chirurgien",
        description:
          "La trousse complète pour incarner les scènes de soin, de tension et de survie.",
        featured: true,
      },
      {
        id: "spatule",
        slug: "spatule",
        name: "Spatule",
        shortName: "Spatule",
        price: 40.0,
        currency: "CAD",
        image: "/images/spatule.jpg",
        url: "/produits/spatule",
        description:
          "Un outil de manipulation simple pour enrichir les examens et les interventions en scène.",
        featured: false,
        customizable: true,
      },
      {
        id: "pince",
        slug: "pince",
        name: "Pince",
        shortName: "Pince",
        price: 40.0,
        currency: "CAD",
        image: "/images/pinces.jpg",
        url: "/produits/pince",
        description:
          "Un accessoire médical visuel pour manipuler, examiner et intervenir avec précision.",
        featured: false,
        customizable: false,
      },
      {
        id: "curette",
        slug: "curette",
        name: "Curette",
        shortName: "Curette",
        price: 40.0,
        currency: "CAD",
        image: "/images/curette.jpg",
        url: "/produits/curette",
        description:
          "Une pièce spécialisée pour donner plus de réalisme aux scènes de soin et d’intervention.",
        featured: false,
        customizable: true,
      },
      {
        id: "crochet",
        slug: "crochet",
        name: "Crochet",
        shortName: "Crochet",
        price: 40.0,
        currency: "CAD",
        image: "/images/crochet.jpg",
        url: "/produits/crochet",
        description:
          "Un outil fin pour appuyer les manipulations délicates et les scènes médicales tendues.",
        featured: false,
        customizable: true,
      },
      {
        id: "scalpel",
        slug: "scalpel",
        name: "Scalpel",
        shortName: "Scalpel",
        price: 40.0,
        currency: "CAD",
        image: "/images/scalpel.jpg",
        url: "/produits/scalpel",
        description:
          "Un accessoire immersif pour les interventions délicates et les scènes chirurgicales.",
        featured: false,
        customizable: true,
      },
      {
        id: "aiguilles-suture",
        slug: "aiguilles-suture",
        name: "Aiguilles de suture",
        shortName: "Aiguilles",
        price: 20.0,
        currency: "CAD",
        image: "/images/aiguilles_suture.jpg",
        url: "/produits/aiguilles-suture",
        description:
          "Des pièces visuelles pour enrichir les scènes de couture, de soin et d’intervention.",
        featured: false,
         customizable: false,
      },
      {
        id: "bandage",
        slug: "bandage",
        name: "Bandage",
        shortName: "Bandage",
        price: 5.0,
        currency: "CAD",
        image: "/images/bandage.jpg",
        url: "/produits/bandage",
        description:
          "Un élément simple et efficace pour appuyer les blessures et les premiers soins sur le terrain.",
        featured: false,
           customizable: false,
      },
    ],
  },

  tortionnaire: {
    id: "tortionnaire",
    slug: "tortionnaire",
    featured: false,

    name: "Tortionnaire",
    title: "Kit Tortionnaire",
    eyebrow: "Collection immersive",
    url: "/collections/tortionnaire",

    description:
      "Accessoires immersifs et théâtraux pour enrichir les scènes d’interrogatoire, de menace et de tension narrative.",

    longDescription:
      "La collection Tortionnaire est pensée pour les personnages inquiétants, les geôliers, les inquisiteurs et les scènes où l’ambiance compte plus que l’action physique.",

    image: "/images/Kit_tortionnaire.png",
    heroImage: "/images/PhotoSacoche3.png",
    thumbnail: "/images/PhotoSacocheFerme3.png",

    cta: "Découvrir la collection",

    productsSection: {
      eyebrow: "Produits de la collection",
      title: "Le kit du tortionnaire",
    },

    video: {
      eyebrow: "Vidéo du produit",
      title: "Voir le kit en action",
      description:
        "Chaque pièce est pensée pour être manipulée, observée et intégrée naturellement au jeu. Cette vidéo présente le contenu du kit, sa logique de rangement et son usage en scène.",
      cta: "Découvrir l’atelier",
      src: "/video/kit-chirurgien-panassor.mp4",
      poster: "/images/video-kit-chirurgien-poster.jpg",
    },

    products: [
      {
        id: "kit-tortionnaire",
        slug: "kit-tortionnaire",
        name: "Kit du tortionnaire",
        shortName: "Kit tortionnaire",
        price: 195.0,
        currency: "CAD",
        image: "/images/Kit_tortionnaire.png",
        url: "/produits/kit-tortionnaire",
        description:
          "La trousse complète pour incarner les scènes d’interrogatoire, de tension et de domination narrative.",
        featured: true,
      },
      {
        id: "aiguilles-douleur",
        slug: "aiguilles-douleur",
        name: "Aiguilles de douleur",
        shortName: "Aiguilles",
        price: 30.0,
        currency: "CAD",
        image: "/images/OutilsTortionaire.png",
        url: "/produits/aiguilles-douleur",
        description:
          "Deux longues aiguilles visuelles pour accentuer les scènes de menace, d’intimidation et d’interrogatoire.",
        featured: false,
         customizable: true,
      },
      {
        id: "redresseur",
        slug: "redresseur",
        name: "Le Redresseur",
        shortName: "Redresseur",
        price: 40.0,
        currency: "CAD",
        image: "/images/Redresseur.png",
        url: "/produits/redresseur",
        description:
          "Un outil de scène au nom évocateur, pensé pour imposer une présence froide et inquiétante.",
        featured: false,
         customizable: true,
      },
      {
        id: "correcteur",
        slug: "correcteur",
        name: "Le Correcteur",
        shortName: "Correcteur",
        price: 40.0,
        currency: "CAD",
        image: "/images/Correcteur.png",
        url: "/produits/correcteur",
        description:
          "Un accessoire théâtral pour appuyer les scènes de discipline, de menace et de confrontation.",
        featured: false,
         customizable: true,
      },
      {
        id: "dernier-argument",
        slug: "dernier-argument",
        name: "Le Dernier Argument",
        shortName: "Dernier Argument",
        price: 40.0,
        currency: "CAD",
        image: "/images/Dernier_Argument.png",
        url: "/produits/dernier-argument",
        description:
          "Un outil narratif au nom dramatique, parfait pour faire monter la tension avant une décision finale.",
        featured: false,
         customizable: true,
      },
      {
        id: "pacificateur",
        slug: "pacificateur",
        name: "Le Pacificateur",
        shortName: "Pacificateur",
        price: 40.0,
        currency: "CAD",
        image: "/images/Pacificateur.png",
        url: "/produits/pacificateur",
        description:
          "Un accessoire sombre et ironique pour les personnages qui imposent le silence par leur seule présence.",
        featured: false,
         customizable: true,
      },
    ],
  },
};

export const collectionsList = Object.values(panassorCollections);

export function getCollectionBySlug(slug) {
  return panassorCollections[slug] ?? null;
}

export function getFeaturedCollection() {
  return (
    collectionsList.find((collection) => collection.featured) ??
    collectionsList[0]
  );
}

export function getFeaturedCollectionProducts() {
  const featuredCollection = getFeaturedCollection();
  return featuredCollection?.products ?? [];
}

export function getFeaturedProducts() {
  return collectionsList.flatMap((collection) =>
    collection.products.filter((product) => product.featured)
  );
}

export function formatPrice(price, currency = "CAD") {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
  }).format(price);
}
export function getProductBySlug(slug) {
  for (const collection of collectionsList) {
    const product = collection.products.find((item) => item.slug === slug);

    if (product) {
      return {
        ...product,
        collection,
      };
    }
  }

  return null;
}