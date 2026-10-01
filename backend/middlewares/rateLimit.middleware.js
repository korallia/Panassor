// =========================================
// LIMITE D'APPELS PAR VISITEUR (en mémoire, sans dépendance)
//
// Sert aux routes publiques qui coûtent cher (ex. calcul de livraison :
// chaque appel interroge Postes Canada et Purolator). Un vrai client en
// fait quelques-uns ; un robot en ferait des milliers.
// =========================================

// Adresse du visiteur. Derrière un proxy (nginx, load balancer), la vraie
// adresse est la DERNIÈRE de X-Forwarded-For : c'est celle que notre
// proxy a ajoutée, le visiteur ne peut pas la falsifier.
function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return forwarded.at(-1) || req.socket?.remoteAddress || "inconnu";
}

export function rateLimit({ max, windowMs, name = "limite" }) {
  const hits = new Map(); // ip -> { count, resetAt }

  // Ménage régulier pour que la mémoire ne grossisse pas.
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }, windowMs).unref();

  return function rateLimitMiddleware(req, res, next) {
    const ip = clientIp(req);
    const now = Date.now();
    let entry = hits.get(ip);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(ip, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));

      if (entry.count === max + 1) {
        console.warn(`[${name}] trop d'appels pour ${ip} -- bloqué ${retryAfterSeconds}s`);
      }

      return res.status(429).json({ message: "TOO_MANY_REQUESTS", retryAfterSeconds });
    }

    next();
  };
}
