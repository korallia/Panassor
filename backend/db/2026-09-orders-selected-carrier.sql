-- =========================================
-- CAPTURER LE TRANSPORTEUR CHOISI PAR LE CLIENT AU CHECKOUT
-- =========================================
-- Jusqu'ici, le transporteur choisi par le client (Postes Canada vs
-- Purolator) ne servait qu'à afficher le bon prix sur la page Square,
-- puis se perdait -- shipments.carrier restait toujours vide, à remplir
-- à la main plus tard sur la page de tracking.
--
-- On le capture maintenant dès la commande (orders.selected_carrier),
-- pour qu'il soit automatiquement recopié sur le shipment au moment où
-- la commande est payée -- ça permet au bouton "créer l'étiquette" dans
-- Discord de pointer directement vers le bon portail transporteur.

ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_carrier VARCHAR(30);

COMMENT ON COLUMN orders.selected_carrier IS 'Transporteur choisi par le client au checkout ("postes_canada" ou "purolator") -- recopié sur shipments.carrier à la création du shipment.';
