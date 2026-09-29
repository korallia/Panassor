--
-- PostgreSQL database dump
--

\restrict QLgGFeqdd1sGrhwGASethPzBHvgwFjwgGcWA0Mbrjx2lq8F2UanefL9T6dkpipm

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-29 17:55:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4405 (class 0 OID 17167)
-- Dependencies: 219
-- Data for Name: atelier_videos; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 4421 (class 0 OID 17502)
-- Dependencies: 243
-- Data for Name: box_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.box_types VALUES (1, 'petite', 'Petite boîte (outils)', 'Small box (tools)', 50, 15.20, 10.20, 7.60, 1, '2026-09-17 00:28:15.943799', '2026-09-17 00:28:15.943799');
INSERT INTO public.box_types VALUES (2, 'grosse', 'Grosse boîte (kits)', 'Large box (kits)', 190, 30.50, 25.40, 11.40, 2, '2026-09-17 00:28:15.943799', '2026-09-17 00:28:15.943799');


--
-- TOC entry 4407 (class 0 OID 17182)
-- Dependencies: 221
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.collections VALUES (2, 'tortionnaire', 'Tortionnaire', 'Torturer', 'Kit Tortionnaire', 'Torturer Kit', 'INTERROGATOIRE ET TENSION', 'INTERROGATION AND TENSION', '/collections/tortionnaire', 'Un kit immersif fait main pour enrichir vos scènes d’interrogatoire, d’intimidation et de tension d’un décorum sombre et marquant.', 'A handmade immersive kit designed to bring dark, striking decorum to your interrogation, intimidation, and tension scenes.', 'Un kit immersif fait main pour enrichir vos scènes d’interrogatoire, d’intimidation et de tension d’un décorum sombre et marquant.', 'A handmade immersive kit designed to bring dark, striking decorum to your interrogation, intimidation, and tension scenes.', '/images/kit_torsio_rouge/04_kit_torsio_rouge_ouvert.jpg', '/images/kit_torsio_rouge/05_kit_torsio_rouge_ouvert.jpg', NULL, NULL, false, '2026-06-21 20:07:11.686833', '2026-07-03 19:24:07.667578', 'published', 'torturer', '/collections/torturer', NULL);
INSERT INTO public.collections VALUES (1, 'chirurgien', 'Chirurgien', 'Surgeon', 'Kit Chirurgien', 'Surgeon Kit', 'EN VEDETTE', 'FEATURED', '/collections/chirurgien', 'Un kit immersif fait main pour enrichir vos scènes de soin et d’intervention d’un décorum marquant et inoubliable.', 'Handmade immersive accessories designed to elevate your healing, tension, and survival scenes in live action roleplay.', 'Un kit immersif fait main pour enrichir vos scènes de soin et d’intervention d’un décorum marquant et inoubliable.', 'The Surgeon collection brings together accessories designed to give weight to medical scenes in play: emergency care, diagnoses, sutures, improvised operations, and tense moments surrounding a character’s survival.', '/images/banniere/14_banner_med_ouvert.jpg', '/images/kit_med_brun/11_kit_brun_ouvert.jpg', NULL, NULL, true, '2026-06-21 20:07:11.686833', '2026-07-03 19:24:07.63399', 'published', 'surgeon', '/collections/surgeon', '/images/kit_med_noir/14_kit_noir_outils.jpg');
INSERT INTO public.collections VALUES (3, 'kit_voleur', 'Kit du voleur', 'Thief''s Kit', 'Kit du voleur', 'Thief''s Kit', 'Infiltration et discrétion', 'Stealth and infiltration', NULL, 'Accessoires immersifs et faits main pour donner vie à vos scènes d’infiltration, de crochetage et de cambriolage en grandeur nature.', 'Immersive handmade props to bring your infiltration, lockpicking and burglary scenes to life in live-action roleplay.', 'La collection Kit du voleur est pensée pour les cambrioleurs, les espions et tous les personnages qui préfèrent une porte close à une grande entrée. Clés, crochets, passes et limes : chaque pièce appuie les scènes où la discrétion compte plus que la force.', 'The Thief’s Kit collection is made for burglars, spies and every character who prefers a locked door to a grand entrance. Keys, picks, passes and files: each piece supports the scenes where stealth matters more than strength.', '/images/kit_de_voleur.jpg', '/images/voleurs_temp/LeKitArriveraProchainement.jpg', NULL, NULL, false, '2026-07-03 18:57:16.610462', '2026-09-26 14:48:34.724175', 'published', 'thief', NULL, '/images/banniere/03_banner_med_torsio.jpg');


--
-- TOC entry 4409 (class 0 OID 17198)
-- Dependencies: 223
-- Data for Name: colors; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.colors OVERRIDING SYSTEM VALUE VALUES (1, 'Red', '#401918', 'Rouge');
INSERT INTO public.colors OVERRIDING SYSTEM VALUE VALUES (2, 'Dark brown', '#2a160c', 'Brun foncé');
INSERT INTO public.colors OVERRIDING SYSTEM VALUE VALUES (3, 'Black', '#141414', 'Noir');


--
-- TOC entry 4419 (class 0 OID 17282)
-- Dependencies: 235
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (1, 1, 'kit-chirurgien', 'Kit du chirurgien', 'Surgeon Kit', 'Kit chirurgien', 'Surgeon Kit', 'Une trousse complète faite main pour enrichir vos scènes de soin, d’urgence et d’intervention médical.', 'A complete handmade pouch designed to enrich your healing, emergency, and medical intervention scenes.', NULL, NULL, 29500, false, true, true, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.827529', 'surgeon-kit', 'MR75S4ETT7M7UPV3ZSKRTSEN', 1785035578358, 'EVLKEBR56QORWI3RC7DUYVDI', NULL, 920, 19.05, 5.08, 20.96);
INSERT INTO public.products VALUES (2, 1, 'spatule', 'Spatule', 'Spatula', 'Spatule', 'Spatula', 'Spatule moulée avec manche effet bois et embout au fini fer froid. Son embout rigide permet de manipuler l’intérieur d’une fausse plaie et sert de point d’appui.', 'Molded spatula with a wood-effect handle and cold iron finish tip. Its rigid end allows you to manipulate the inside of a fake wound and serves as a support point.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.857799', 'spatula', 'QPZMWDTWOD33VCATDPOPDYDK', 1785035606316, 'XG2WROVIANBFZK3ZZZM57NK3', 'RWL35KOT2R6UTGEOQ6QZ2VLM', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (3, 1, 'pince', 'Pince', 'Forceps', 'Pince', 'Forceps', 'Pinces moulées au fini fer froid. Véritable seconde main, leur prise solide permet d’extraire les corps étrangers ou de manipuler les chairs pendant vos scènes de soin.', 'Molded forceps with a cold iron finish. A true second hand, their solid grip allows you to extract foreign objects or manipulate flesh during healing scenes.', NULL, NULL, 4000, false, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.885485', 'forceps', 'AMNM5WPFRPRMGNG2JI546YS6', 1785035612442, 'MR6757EZ7ZHLKG27DWTMAFRR', 'UZZ52DLYYB652JTXNNZSYIKD', 150, 7.00, 14.00, 1.00);
INSERT INTO public.products VALUES (4, 1, 'curette', 'Curette', 'Curette', 'Curette', 'Curette', 'Curette moulée avec manche effet bois et embout au fini fer froid. Sa pointe flexible permet de simuler le retrait de peau morte ou gangrenée.', 'Molded curette with a wood-effect handle and cold iron finish tip. Its flexible tip allows you to simulate the removal of dead or gangrenous skin.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.921148', 'curette', '7YMEJ6XPPHTQTHVNJD3KJ6OH', 1785035619077, 'C7AI37RW43IDXPMR7DJU5OYL', 'RV4OUJSZ2BV4ICCOPI4DVWH3', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (5, 1, 'crochet', 'Crochet', 'Hook', 'Crochet', 'Hook', 'Crochet moulé avec manche effet bois et embout au fini fer froid. Sa pointe flexible permet de simuler le perçage d’abcès cutanés.', 'Molded hook with a wood-effect handle and cold iron finish tip. Its flexible tip allows you to simulate piercing skin abscesses.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.955578', 'hook', 'RKMQ2JAVQWKH3HE3XB2WBHVY', 1785035626246, 'CRT7NDFLBADFG67TIXRXBYQD', 'LPJH6UANIAD2EP56TRZETCRU', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (6, 1, 'scalpel', 'Scalpel', 'Scalpel', 'Scalpel', 'Scalpel', 'Scalpel moulé avec manche effet bois et lame au fini fer froid. Sa pointe flexible permet une utilisation directement sur la peau pendant vos scènes de soin.', 'Molded scalpel with a wood-effect handle, cold iron finish blade, and flexible tip for direct use on the skin during healing scenes.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:07.982649', 'scalpel', 'TNM6LX76XOXTOOKLTTXJOFMU', 1785035633402, 'OKIB7X4FYJDT2EC2PAXLOWUU', 'RZNFYSTESQX25JCOMLTU2PYK', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (7, 1, 'aiguilles-suture', 'Aiguilles de suture', 'Suture Needles', 'Aiguilles', 'Needles', 'Aiguilles de suture moulées au fini fer froid. Une droite et une incurvée permettent de simuler les sutures et de refermer les plaies en toute circonstance.', 'Molded suture needles with a cold iron finish. One straight and one curved needle allow you to simulate sutures and close wounds in any situation.', NULL, NULL, 2000, false, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.011034', 'suture-needles', 'NT4FCRXXT6YOSA5IA3IJOIUZ', 1785035641003, 'XCCRX3OPUPYAES2SBDBIXWZD', 'K35WUXBVGYFPJSHBGMYXGIM4', 4, 2.00, 6.00, 0.75);
INSERT INTO public.products VALUES (8, 1, 'bandage', 'Bandage', 'Bandage', 'Bandage', 'Bandage', 'Long bandage en toile de coton. Conçu pour être plus résistant, il permet de couvrir différents types de blessures en jeu.', 'Long cotton bandage. Designed to be more resistant, it allows you to cover different types of wounds in play.', NULL, NULL, 500, false, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.038755', 'bandage', 'SNIP63LW7PAJTPBT3QALF64V', 1785035646974, 'FEZFFT3PCBAR2Q4H5VIYTHRX', 'G3CN25UKC3AO3LFDMLR4AS2W', 15, 4.00, 4.00, 7.00);
INSERT INTO public.products VALUES (9, 2, 'kit-tortionnaire', 'Kit du tortionnaire', 'Torturer Kit', 'Kit tortionnaire', 'Torturer Kit', 'Une trousse complète faite main pour enrichir vos scènes d’interrogatoire musclé.', 'A complete handmade pouch designed to enrich your intense interrogation scenes.', NULL, NULL, 19500, false, true, true, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.066734', 'torturer-kit', 'BOGDAJOSZIQP6BEHRH75XNMO', 1785035656191, 'P3TRIOTI463IPFYHNS62Z636', NULL, 300, 20.96, 5.08, 7.62);
INSERT INTO public.products VALUES (10, 2, 'aiguilles-douleur', 'Aiguilles de douleur', 'Pain Needles', 'Aiguilles', 'Needles', 'Deux longues aiguilles pour piquer les nerfs avec précision. Flexibles, elles permettent un usage sécuritaire en jeu.', 'Two long needles designed to prick nerves with precision. Flexible, they allow safer use in play.', NULL, NULL, 3000, false, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.093099', 'pain-needles', '2HB2C3DEYPRURFOGMVQAC2VT', 1785035690990, 'NITZZJFJYSHRBWA53LO7DZZL', 'U5ZXF3GS4OT7QHY2DABPX65Z', 10, 1.50, 0.75, 20.00);
INSERT INTO public.products VALUES (11, 2, 'redresseur', 'Le Redresseur', 'The Straightener', 'Redresseur', 'Straightener', 'Un crochet monté sur un levier, parfait pour redresser les torts de ceux que vous sélectionnerez en jeu. Conçu flexible pour un accessoire sécuritaire sur la peau.', 'A hook mounted on a lever, perfect for righting the wrongs of those you select in play. Flexible for safer use on the skin.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.122971', 'straightener', 'VSRKDJKOEWFWAYCIE7TWGURP', 1785035696805, 'XOSZFSKNNZIC2N7C3AORAMYO', 'DSVW6TC2IQ5VB3FY7PV7OELY', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (12, 2, 'correcteur', 'Le Correcteur', 'The Corrector', 'Correcteur', 'Corrector', 'Une humble pointe émoussée, parfaite comme outil de base pour commencer vos questions en douceur. Conçue flexible pour un accessoire sécuritaire sur la peau.', 'A theatrical accessory designed to support scenes of discipline, threat, and confrontation.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.153163', 'corrector', '4H63H2HB6GNVKC2WVFN7YRJN', 1785035703552, 'CSXFN5NFO7ZYEHOZYD2HLQOV', 'C47PJ6JLZASWLLYYKMIYH3D7', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (13, 2, 'dernier-argument', 'Le Dernier Argument', 'The Final Argument', 'Dernier Argument', 'Final Argument', 'Quand la subtilité n’est plus au menu, le Dernier Argument marque les aveux en deux étapes. Bien plus efficace à retirer qu’à insérer. Conçu flexible pour un accessoire sécuritaire sur la peau.', 'When subtlety is no longer on the table, the Final Argument marks confession in two steps. Far more effective to remove than to insert. Flexible for safer use on the skin.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.181079', 'final-argument', 'HNJM5H7FAJ5S66IPMLL6ZNBG', 1785035709769, 'SKDUKKQKFLYGVO63K44FXW4X', 'KIWL32KRDV55RWIMO5UPI5WA', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (14, 2, 'pacificateur', 'Le Pacificateur', 'The Pacifier', 'Pacificateur', 'Pacifier', 'Une sphère conçue pour élargir les plaies existantes, parfaite pour des scènes déchirantes. Conçue flexible pour un accessoire sécuritaire sur la peau.', 'A sphere designed to widen existing wounds, perfect for harrowing scenes. Its flexibility allows safer use on the skin.', NULL, NULL, 4000, true, false, false, '2026-06-21 20:07:11.724477', '2026-07-03 19:27:08.207292', 'pacifier', 'J3ISEORSZM4U4J3RYL7PX75U', 1785035716028, 'RAQXGZ6PLXOR3GQNJBNJCSZH', 'UYJF2ILNJOZMOZ4CM73WUQ6U', 23, 18.00, 1.75, 1.75);
INSERT INTO public.products VALUES (15, 3, 'tourne-serrure-voleur', 'Tourne-serrure', 'Lock Turner', 'Tourne-serrure', 'Lock Turner', 'L’outil qui maintient la tension pendant que le crochet fait son travail.', 'The tool that holds the tension while the pick does its work.', 'Indispensable au crochetage, le tourne-serrure exerce la pression qui permet à la serrure de céder. Associé au crochet, il donne toute sa crédibilité aux scènes d’infiltration.', 'Essential to lockpicking, the lock turner applies the pressure that makes the lock give way. Paired with the pick, it makes infiltration scenes truly believable.', 4000, true, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'lock-turner-thief', 'SR2SSGA6V5XTFQVLNKXPV763', 1790433192776, 'BBJYCEZEXD6WXHOHBN7QMJVR', 'NEIHPEJ6ZYSC3KM3TDJ25MUA', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (16, 3, 'crochet-et-tourne-serrure-voleur', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 'Le duo essentiel du crochetage, réuni dans un seul ensemble.', 'The essential lockpicking duo, together in one set.', 'Le crochet et le tourne-serrure travaillent toujours ensemble : l’un maintient la tension, l’autre trouve le chemin. L’ensemble parfait pour les personnages qui ouvrent les portes sans y être invités.', 'The pick and the lock turner always work together: one holds the tension, the other finds the way. The perfect set for characters who open doors without an invitation.', 5000, false, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'lock-pick-and-lock-turner-thief', 'HR7TQHZXB6RMFSXNRQXORIQ2', 1790433193288, 'BBJYCEZEXD6WXHOHBN7QMJVR', 'XM4QW2XCOM7R3AXKMJ7TTXWH', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (17, 3, 'lime-voleur', 'Lime', 'File', 'Lime', 'File', 'Un outil de précision pour ajuster une clé ou venir à bout d’un obstacle en scène.', 'A precision tool to shape a key or get past an obstacle in a scene.', 'Pour tailler une clé vierge, user un barreau ou effacer une marque compromettante, la lime accompagne le voleur patient. Un accessoire simple qui ajoute du réalisme aux préparations de cambriolage.', 'Cutting a blank key, wearing down a bar or erasing a telltale mark: the file goes wherever a patient thief goes. A simple prop that adds realism to any burglary preparation.', 4000, true, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'file-thief', 'HDFGJL6YLBVZTM3OCWBWTT7E', 1790433193853, 'EVR3WRRPR7VFLTHPRXAZTHVA', 'AVRYNM6EHAKEHMRVH7OO6TXM', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (18, 3, 'cle-vierge-et-lime-voleur', 'Clé vierge + lime', 'Blank Key + File', 'Clé vierge + lime', 'Blank Key + File', 'Le duo pour tailler sa propre clé en pleine scène.', 'The duo to cut your own key right in the middle of a scene.', 'Cet ensemble réunit une clé vierge et une lime : tout ce qu’il faut pour jouer la copie d’une clé dérobée, le temps d’une nuit.', 'This set brings together a blank key and a file: everything you need to play out copying a stolen key, just for one night.', 5000, false, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'blank-key-and-file-thief', 'LC7YFUOTJV3SLQZUX3K37WDL', 1790433194594, 'HMCYU2MI66JJ44COQBGSTLFI', 'RZEMVOW4ZE3WFR434BWN2ZAY', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (19, 3, 'passe-droite-voleur', 'Passe droite', 'Straight Pass', 'Passe droite', 'Straight Pass', 'Un passe au profil droit pour les serrures qui cèdent aux mains habiles.', 'A straight-profile pass for locks that give way to skilled hands.', 'Le passe droit est l’outil de base du crocheteur : direct, fiable et toujours à portée de main. Il complète la trousse du voleur pour les scènes d’effraction et les portes qui ne devaient pas s’ouvrir.', 'The straight pass is the lockpicker’s go-to tool: direct, reliable and always within reach. It rounds out the thief’s kit for break-in scenes and doors that were never meant to open.', 4000, true, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'straight-pass-thief', 'UE5NNQKI33C3HPWXOCIQ6T6Q', 1790433195401, '4HSQNTPTV24PINMOWFM7H6FO', 'KT7EZ7QYOP3ZFP67WDCICLMP', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (20, 3, 'passe-interieur-voleur', 'Passe intérieur', 'Inner Pass', 'Passe intérieur', 'Inner Pass', 'Un passe pour atteindre le cœur des serrures les plus tenaces.', 'A pass to reach the heart of the most stubborn locks.', 'Le passe intérieur complète le trio des passes du voleur. Avec lui, le personnage montre qu’aucune serrure ne lui résiste bien longtemps, pour des scènes d’infiltration plus crédibles.', 'The inner pass completes the thief’s trio of passes. With it, your character shows that no lock holds out for long, making infiltration scenes all the more convincing.', 4000, true, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'inner-pass-thief', 'TUYGZ36JAAYMFELDLLKOWDBS', 1790433195980, 'OBQS4GZB3PQWKT23TEPF4OML', 'LMBNYVVUUFRXMKS6IJPPZ6U2', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (22, 3, 'cle-vierge-voleur', 'Clé vierge', 'Blank Key', 'Clé vierge', 'Blank Key', 'Une clé encore sans dents, prête à devenir la copie de la serrure convoitée.', 'A key with no teeth yet, ready to become a copy of the coveted lock.', 'Point de départ de tout bon voleur, la clé vierge attend d’être taillée pour la porte visée. Idéale pour les scènes de préparation, de copie de clé et de missions d’infiltration en grandeur nature.', 'Every good thief starts here: a blank key waiting to be cut for the door in sight. Perfect for preparation scenes, key copying and infiltration missions in live-action roleplay.', 2000, false, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'blank-key-thief', 'A2E2COVUM2JZ2YFJLDNXK5VC', 1790433197131, 'HMCYU2MI66JJ44COQBGSTLFI', 'RARKQCRMRXZDI5LBXGCUGX2S', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (24, 3, 'crochet-voleur', 'Crochet', 'Lock Pick', 'Crochet', 'Lock Pick', 'Un outil fin pour donner vie aux scènes de crochetage et d’infiltration.', 'A fine tool to bring lockpicking and infiltration scenes to life.', 'Glissé dans la serrure avec patience, le crochet est l’allié discret du voleur. Il appuie les scènes de tension où chaque seconde compte avant le retour de la garde.', 'Slipped patiently into the lock, the pick is the thief’s quiet ally. It supports those tense scenes where every second counts before the guard comes back.', 2000, false, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'lock-pick-thief', 'R2QBRIF4OVXOUYYP6YDE7NE2', 1790433198186, 'VCQ2GSTW7BW4U7GQ3C6GW5G4', 'XL5JSGNC4UBO3NXPSZJFTLSJ', NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (23, 3, 'kit-du-voleur', 'Kit du voleur', 'Thief''s Kit', 'Kit du voleur', 'Thief''s Kit', 'La trousse complète pour incarner les voleurs, les cambrioleurs et les scènes d’infiltration.', 'The complete kit to play thieves, burglars and infiltration scenes.', 'Le kit du voleur réunit une clé vierge, un crochet, une lime, trois passes et un tourne-serrure, pensés pour les personnages qui vivent dans l’ombre. Comme pour les autres kits Panassor, la lime, les passes et le tourne-serrure peuvent être remplacés par d’autres outils au choix.', 'The Thief’s Kit brings together a blank key, a lock pick, a file, three passes and a lock turner, made for characters who live in the shadows. As with every Panassor kit, the file, the passes and the lock turner can be swapped for other tools of your choice.', 23500, false, true, false, '2026-09-25 14:11:32.060237', '2026-09-26 14:32:43.819432', 'thiefs-kit', '7HVVYU4A36ZCWOF57FUPIEWJ', 1790433197786, 'ZHVMSZNVPM6DWR345GOYZ3LM', NULL, NULL, NULL, NULL, NULL);
INSERT INTO public.products VALUES (21, 3, 'passe-exterieur-voleur', 'Passe extérieur', 'Outer Pass', 'Passe extérieur', 'Outer Pass', 'Un passe pensé pour les serrures qui résistent aux outils habituels.', 'A pass made for locks that resist the usual tools.', 'Quand le passe droit ne suffit plus, le passe extérieur prend le relais. Un accessoire qui donne de la profondeur aux scènes de crochetage et au savoir-faire du personnage.', 'When the straight pass is not enough, the outer pass takes over. A prop that adds depth to lockpicking scenes and to your character’s craft.', 4000, true, false, false, '2026-09-25 14:11:32.060237', '2026-09-25 14:11:32.060237', 'outer-pass-thief', 'GLFFYN3ZD726KUAOJKLWOQWQ', 1790433196605, 'PIV3ATOGOON7CTI5DZSX6CFU', 'NGR6GLBSP35K5Y4U5C3MFU2G', NULL, NULL, NULL, NULL);


--
-- TOC entry 4413 (class 0 OID 17214)
-- Dependencies: 227
-- Data for Name: kit_components; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.kit_components VALUES (7, 1, 8, 1, 7, '2026-06-21 20:07:11.787278', NULL, NULL);
INSERT INTO public.kit_components VALUES (8, 9, 10, 1, 1, '2026-06-21 20:07:11.787278', NULL, NULL);
INSERT INTO public.kit_components VALUES (2, 1, 3, 1, 5, '2026-06-21 20:07:11.787278', NULL, NULL);
INSERT INTO public.kit_components VALUES (6, 1, 7, 1, 6, '2026-06-21 20:07:11.787278', NULL, NULL);
INSERT INTO public.kit_components VALUES (18, 23, 22, 1, 0, '2026-09-25 14:11:32.060237', NULL, NULL);
INSERT INTO public.kit_components VALUES (19, 23, 24, 1, 1, '2026-09-25 14:11:32.060237', NULL, NULL);
INSERT INTO public.kit_components VALUES (1, 1, 2, 1, 4, '2026-06-21 20:07:11.787278', 'S5FAAVXQ27CR3MXOMQO3GFQF', 1790372450494);
INSERT INTO public.kit_components VALUES (3, 1, 4, 1, 2, '2026-06-21 20:07:11.787278', '32AWXV2E2L3DPBN7AR4S6UCG', 1790372451019);
INSERT INTO public.kit_components VALUES (4, 1, 5, 1, 3, '2026-06-21 20:07:11.787278', 'KEN3OJMNUZRRCZAI35N7CM4K', 1790372451365);
INSERT INTO public.kit_components VALUES (5, 1, 6, 1, 1, '2026-06-21 20:07:11.787278', 'RUBK7P6P2KZMPB3CSONNOEMS', 1790372451733);
INSERT INTO public.kit_components VALUES (9, 9, 11, 1, 3, '2026-06-21 20:07:11.787278', 'RACCCUIS3AW3CQBE5GHFHTHN', 1790372452093);
INSERT INTO public.kit_components VALUES (10, 9, 12, 1, 1, '2026-06-21 20:07:11.787278', 'F73XUZ5S4RIA5EDVBOE7T2U6', 1790372452410);
INSERT INTO public.kit_components VALUES (11, 9, 13, 1, 4, '2026-06-21 20:07:11.787278', 'YKVJYMNS5HUEFJXANCDMIGV7', 1790372452821);
INSERT INTO public.kit_components VALUES (12, 9, 14, 1, 2, '2026-06-21 20:07:11.787278', 'MBCQCEMLM4645DT2A6P3O6KY', 1790372453135);
INSERT INTO public.kit_components VALUES (13, 23, 15, 1, 6, '2026-09-25 14:11:32.060237', '47KII4RATO5HSYWDQJIDZLUU', 1790433191232);
INSERT INTO public.kit_components VALUES (14, 23, 17, 1, 2, '2026-09-25 14:11:32.060237', 'MFLGYVMDEFMGO6NAWIBAWSC7', 1790433191631);
INSERT INTO public.kit_components VALUES (15, 23, 19, 1, 3, '2026-09-25 14:11:32.060237', '6PH6KEJMYKIHQMAQFUVTSOON', 1790433191905);
INSERT INTO public.kit_components VALUES (16, 23, 20, 1, 5, '2026-09-25 14:11:32.060237', '52F74WCHNUA7D5PH5BO3U3UF', 1790433192207);
INSERT INTO public.kit_components VALUES (17, 23, 21, 1, 4, '2026-09-25 14:11:32.060237', 'FH6WUWWQB7MGJ2LQNN2RHZ7Y', 1790433192484);


--
-- TOC entry 4411 (class 0 OID 17205)
-- Dependencies: 225
-- Data for Name: kit_component_modifiers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.kit_component_modifiers VALUES (321, 11, 11, 'AFUARJAKPET77VZW33ZMY3Z6');
INSERT INTO public.kit_component_modifiers VALUES (322, 11, 12, 'JELSQRNRH2OWSG4NRJC63TXU');
INSERT INTO public.kit_component_modifiers VALUES (323, 11, 13, '4JTDD3PU7HK62YHSXSVCW32G');
INSERT INTO public.kit_component_modifiers VALUES (324, 11, 14, 'W6X3E6ZUHG2WG2HHVBIXWXYU');
INSERT INTO public.kit_component_modifiers VALUES (325, 11, 2, 'TZ3LT5KEDERNZDNYPFK2RES2');
INSERT INTO public.kit_component_modifiers VALUES (326, 11, 4, 'VEDKT7WB7NUIPAHZ7TFEIS4H');
INSERT INTO public.kit_component_modifiers VALUES (327, 11, 5, 'HODTVBWZ6S2ZU6HAJY4IKZKH');
INSERT INTO public.kit_component_modifiers VALUES (328, 11, 6, 'AJCRZ5FZ5UVOYJ4RZQIKBCYF');
INSERT INTO public.kit_component_modifiers VALUES (329, 5, 11, '3QD6FPIGAOKSQ75K46BOV2EQ');
INSERT INTO public.kit_component_modifiers VALUES (330, 5, 12, 'CROHSD2JCX4KR3EA6UWINVSH');
INSERT INTO public.kit_component_modifiers VALUES (331, 5, 13, 'QY57XMKMMKNY6GJM4X767LVC');
INSERT INTO public.kit_component_modifiers VALUES (332, 5, 14, 'I3GHCWH2E4FYNMWX5POW6KLP');
INSERT INTO public.kit_component_modifiers VALUES (333, 5, 2, 'DK7V6IMEXLAX3YTXQ5EMAKXT');
INSERT INTO public.kit_component_modifiers VALUES (334, 5, 4, 'LBP4TH2BLSEIQT6VNLWDQOF4');
INSERT INTO public.kit_component_modifiers VALUES (335, 5, 5, 'RHQTCEUMET4JLJ7TA2HXHZMH');
INSERT INTO public.kit_component_modifiers VALUES (336, 5, 6, '76JWOENOYPRHXA34RLSUAPXE');
INSERT INTO public.kit_component_modifiers VALUES (337, 3, 11, 'CN2HRR7I7YNNDR4Z7FHYXXFQ');
INSERT INTO public.kit_component_modifiers VALUES (338, 3, 12, 'QQTYH56JUPCGFR7CVFY46DF3');
INSERT INTO public.kit_component_modifiers VALUES (339, 3, 13, 'HCASHZKAJXFOQDXWUK7GR54V');
INSERT INTO public.kit_component_modifiers VALUES (340, 3, 14, 'ND3TZP5S3JC4GKSFWANZZ27C');
INSERT INTO public.kit_component_modifiers VALUES (341, 3, 2, 'UHWP76XHKS6HABDY67DPIJEB');
INSERT INTO public.kit_component_modifiers VALUES (342, 3, 4, '3HVC2OD7DAOZLE3WDH4BDPCK');
INSERT INTO public.kit_component_modifiers VALUES (343, 3, 5, 'NSQ2KG3EQYVSUD3VVAA445HV');
INSERT INTO public.kit_component_modifiers VALUES (344, 3, 6, '7P6HKT4A5FJ5LE45OQ6JPQNL');
INSERT INTO public.kit_component_modifiers VALUES (345, 4, 11, 'HCY2DTDFCDQDST44IMMS6UZP');
INSERT INTO public.kit_component_modifiers VALUES (346, 4, 12, '5UHEUQVA4OC2HPIL5KQFRYYV');
INSERT INTO public.kit_component_modifiers VALUES (347, 4, 13, '4K66SOYZCSBZGY2GCSZW3GN5');
INSERT INTO public.kit_component_modifiers VALUES (348, 4, 14, 'ZJ23NWERIFEL3ZZF5K62IYSA');
INSERT INTO public.kit_component_modifiers VALUES (349, 4, 2, 'PSWF6GTCPBLABMFCRXTYCZZO');
INSERT INTO public.kit_component_modifiers VALUES (350, 4, 4, 'NHRHWUW6FR4X4YKK3VSFR2UK');
INSERT INTO public.kit_component_modifiers VALUES (351, 4, 5, '3BSL3AGCEH7C5HMZCEUX54RP');
INSERT INTO public.kit_component_modifiers VALUES (352, 4, 6, 'XWOQDJD3UJOMHBQ6UECLWIPG');
INSERT INTO public.kit_component_modifiers VALUES (353, 1, 11, 'HIBWLBERJQZNIRRXMZPZBGUT');
INSERT INTO public.kit_component_modifiers VALUES (354, 1, 12, 'H25UIOREKUOSJA7NALV4XTMA');
INSERT INTO public.kit_component_modifiers VALUES (355, 1, 13, 'G7AYQOYNA7T5OFQFYT65XWV7');
INSERT INTO public.kit_component_modifiers VALUES (356, 1, 14, 'YWPRRR25DONUDABGAGXDREAO');
INSERT INTO public.kit_component_modifiers VALUES (357, 1, 2, 'YYF3LKVFH6EJPNB7VSBZCLBG');
INSERT INTO public.kit_component_modifiers VALUES (358, 1, 4, 'H4QIHP6O2ZM5I5YHMIMZZC4D');
INSERT INTO public.kit_component_modifiers VALUES (359, 1, 5, 'H3X4I2JKATPAS7ITHNUCI2AZ');
INSERT INTO public.kit_component_modifiers VALUES (360, 1, 6, '6MPWRIW6LOYAKASV52LUIASZ');
INSERT INTO public.kit_component_modifiers VALUES (361, 12, 11, 'PHJTXIFMPZDJR5APFA4ZCVKN');
INSERT INTO public.kit_component_modifiers VALUES (362, 12, 12, 'SQBIYKR62AHC5OQKYJYAVAQU');
INSERT INTO public.kit_component_modifiers VALUES (363, 12, 13, 'CIDD5OBFFE2765EWRRQWQABF');
INSERT INTO public.kit_component_modifiers VALUES (364, 12, 14, 'T2SWCBLY2QASYMIEJIVHFDCY');
INSERT INTO public.kit_component_modifiers VALUES (365, 12, 2, '5YXS46QJTPAVPYM2LNBBVCIH');
INSERT INTO public.kit_component_modifiers VALUES (366, 12, 4, 'BYEQY4DR7SI2AKCGFQYUTZU6');
INSERT INTO public.kit_component_modifiers VALUES (367, 12, 5, 'ILAXYDFZXK2POIFGOMAYHPSG');
INSERT INTO public.kit_component_modifiers VALUES (368, 12, 6, 'GVRXWQZ23FRAWGKE5ZETGOFI');
INSERT INTO public.kit_component_modifiers VALUES (369, 10, 11, '4MTVR7D34NSCOHPY3NOIIXST');
INSERT INTO public.kit_component_modifiers VALUES (370, 10, 12, 'JEQPEORSSZTFIH5YKLUBLAXD');
INSERT INTO public.kit_component_modifiers VALUES (371, 10, 13, 'MRL3M2UPMLF245CXHCKIO2GW');
INSERT INTO public.kit_component_modifiers VALUES (372, 10, 14, 'NGHZ5OQ2BWMRIU27INSDXHZN');
INSERT INTO public.kit_component_modifiers VALUES (373, 10, 2, 'PQXKTONKSDMGXUH7AYECOUTU');
INSERT INTO public.kit_component_modifiers VALUES (374, 10, 4, '5OLZ4N4ZT6P4DTGNJDA3XNKH');
INSERT INTO public.kit_component_modifiers VALUES (375, 10, 5, '7QCTNZVFS2L4QYZBCFBPVC66');
INSERT INTO public.kit_component_modifiers VALUES (376, 10, 6, '3MO2NE3HPERPKVLVZX7OB5QQ');
INSERT INTO public.kit_component_modifiers VALUES (377, 9, 11, '4JJDBQHXCJBX34FLSU7GBQ53');
INSERT INTO public.kit_component_modifiers VALUES (378, 9, 12, 'HFNJ5FAFXFAODDAQN56KK7OB');
INSERT INTO public.kit_component_modifiers VALUES (379, 9, 13, 'TDZNPO5CX7IQM77IBQT6S62R');
INSERT INTO public.kit_component_modifiers VALUES (380, 9, 14, 'N4W7ALTNPFYY6RYN5IPVMOA3');
INSERT INTO public.kit_component_modifiers VALUES (381, 9, 2, 'S4HAWXPYZWAH3WJNWUURVNYV');
INSERT INTO public.kit_component_modifiers VALUES (382, 9, 4, 'RZ744K4IQQYPX2AUGPMCMRYY');
INSERT INTO public.kit_component_modifiers VALUES (383, 9, 5, 'U52GMGRRRRT5MYGBS33QKPIN');
INSERT INTO public.kit_component_modifiers VALUES (384, 9, 6, 'LGZFJBQUFREIWDJ7WAGBO4K5');
INSERT INTO public.kit_component_modifiers VALUES (385, 13, 11, 'T7BX2G6EKLA53G7LLRQB5Q36');
INSERT INTO public.kit_component_modifiers VALUES (386, 13, 12, 'MJDUQ5HD2YZG3IK47NTK3WV3');
INSERT INTO public.kit_component_modifiers VALUES (387, 13, 13, 'EOUJMM7SSYEJD3X2SGHUCFMH');
INSERT INTO public.kit_component_modifiers VALUES (388, 13, 14, 'J6LFS2HQJSN7N35UHR24HNNN');
INSERT INTO public.kit_component_modifiers VALUES (389, 13, 2, 'KNIBO5LFLMNURLCBXGCJTGPX');
INSERT INTO public.kit_component_modifiers VALUES (390, 13, 4, 'MZEG3JYZDSUZECDP7U6NUN4K');
INSERT INTO public.kit_component_modifiers VALUES (391, 13, 5, '4KYKE3YOHAJNXFQTIFT3W7N4');
INSERT INTO public.kit_component_modifiers VALUES (392, 13, 6, 'CPKOWMYLNRJLRW7OTKPQXKCG');
INSERT INTO public.kit_component_modifiers VALUES (393, 14, 11, 'GSS4MMAUO2LSB36FUI3EEUW7');
INSERT INTO public.kit_component_modifiers VALUES (394, 14, 12, '4BQMRM4PCINKDX4R7FK7DJI7');
INSERT INTO public.kit_component_modifiers VALUES (395, 14, 13, 'WQYT7JYJ3TRPDNQ5WYMR2L4C');
INSERT INTO public.kit_component_modifiers VALUES (396, 14, 14, '6OIUVSYV3MQGEUIWBKQ47FBQ');
INSERT INTO public.kit_component_modifiers VALUES (397, 14, 2, 'MCCLTYPDWMVVT7YNGTD7UN35');
INSERT INTO public.kit_component_modifiers VALUES (398, 14, 4, 'APPFWGT4S7DFFW7IF7IP5Z5S');
INSERT INTO public.kit_component_modifiers VALUES (399, 14, 5, 'LOOLELFMXJNUDEYIN2CI5MSD');
INSERT INTO public.kit_component_modifiers VALUES (400, 14, 6, 'I6DW6TKWEMUJZE3FUXFM4UC2');
INSERT INTO public.kit_component_modifiers VALUES (401, 15, 11, 'VZKGCAO2V2WTWXR3GKUS5NNF');
INSERT INTO public.kit_component_modifiers VALUES (402, 15, 12, 'KOL5NQQHKNF2RPCQ3J4HN6SI');
INSERT INTO public.kit_component_modifiers VALUES (403, 15, 13, 'M5EG25F3WDUT5PLNXGT65L37');
INSERT INTO public.kit_component_modifiers VALUES (404, 15, 14, 'GHZOGK6B4TINFDSQOJP5RY74');
INSERT INTO public.kit_component_modifiers VALUES (405, 15, 2, 'H5C6FFTBGOV37RLCBQTT6DAS');
INSERT INTO public.kit_component_modifiers VALUES (406, 15, 4, 'UKYOROOBXJIXZJTSSW3LJKW6');
INSERT INTO public.kit_component_modifiers VALUES (407, 15, 5, 'TFFGYFZOQW6P25YIDEADADFN');
INSERT INTO public.kit_component_modifiers VALUES (408, 15, 6, 'ZDDOJG536DC6355YUPVBYIGM');
INSERT INTO public.kit_component_modifiers VALUES (409, 16, 11, '462OW7W7Q436AJFEZU6JMD26');
INSERT INTO public.kit_component_modifiers VALUES (410, 16, 12, 'CFUNQ2C4LIO7E3AJQ6X2QAAP');
INSERT INTO public.kit_component_modifiers VALUES (411, 16, 13, 'D6VSZEFFZL7UTK4E7UDSMS53');
INSERT INTO public.kit_component_modifiers VALUES (412, 16, 14, 'UJFUKDQRKNR6MXC4WQAZSW3T');
INSERT INTO public.kit_component_modifiers VALUES (413, 16, 2, '4YSWEIVBW7STEGWNPSEGVRT7');
INSERT INTO public.kit_component_modifiers VALUES (414, 16, 4, 'Q7COVYVUAQ3G4SPTRACDAPCO');
INSERT INTO public.kit_component_modifiers VALUES (415, 16, 5, 'MGF7ALG7GQQQD3BO3VQAKAS6');
INSERT INTO public.kit_component_modifiers VALUES (416, 16, 6, 'UUGLHYAMB6TOL2YRFLDW6373');
INSERT INTO public.kit_component_modifiers VALUES (417, 17, 11, 'NSVLAR6LTYKHQDFBFWOAY63J');
INSERT INTO public.kit_component_modifiers VALUES (418, 17, 12, 'EFPI2RSH5NPHXSYKPGGS2YTZ');
INSERT INTO public.kit_component_modifiers VALUES (419, 17, 13, '3X7Z7YNXMWW3FLUELDMLA6U6');
INSERT INTO public.kit_component_modifiers VALUES (420, 17, 14, '4VWCUWALN7FAX3O7MVBVKCF5');
INSERT INTO public.kit_component_modifiers VALUES (421, 17, 2, 'A2ANUFWDFET6LDG4WO6T3YPY');
INSERT INTO public.kit_component_modifiers VALUES (422, 17, 4, '26JI7WMHKUFYA2KZV5EXIK6M');
INSERT INTO public.kit_component_modifiers VALUES (423, 17, 5, 'NYPP4R5VCGOHIPN5DWLAMTQP');
INSERT INTO public.kit_component_modifiers VALUES (424, 17, 6, 'BELS3G6QYFVU3QGB4T23V3JU');
INSERT INTO public.kit_component_modifiers VALUES (425, 1, 15, 'IONTQRPYI7HPJRDSUSYWY2XR');
INSERT INTO public.kit_component_modifiers VALUES (426, 1, 17, 'HZWPJ6VCN5HTFNB2E2VYAXRG');
INSERT INTO public.kit_component_modifiers VALUES (427, 1, 19, 'DJ53PKSUGNY2G3DJZDRJG4YE');
INSERT INTO public.kit_component_modifiers VALUES (428, 1, 20, '3JK55XPZNPLHXBPEFSWNIAU4');
INSERT INTO public.kit_component_modifiers VALUES (429, 1, 21, 'WCY4LKUZCOVZ7SIPQYRB75VH');
INSERT INTO public.kit_component_modifiers VALUES (430, 3, 15, 'UTX6KCCET4NEOJTYX5HKN4NF');
INSERT INTO public.kit_component_modifiers VALUES (431, 3, 17, 'CEFOI2ZTD7LUJPN7TFEFVZGT');
INSERT INTO public.kit_component_modifiers VALUES (432, 3, 19, 'M7XNZKTN26XT64Z534625YAA');
INSERT INTO public.kit_component_modifiers VALUES (433, 3, 20, 'V6ATFZBLDWZLSLBHKDVCFGZV');
INSERT INTO public.kit_component_modifiers VALUES (434, 3, 21, '5EYVVGXNSEZC6HQT563KRHMZ');
INSERT INTO public.kit_component_modifiers VALUES (435, 4, 15, '7JDTXXYA5BXSCQUGUBTJ3FCF');
INSERT INTO public.kit_component_modifiers VALUES (436, 4, 17, 'YD6K2ZENH7NWVQG7EVU2LNAH');
INSERT INTO public.kit_component_modifiers VALUES (437, 4, 19, '3J33XOL2UQBTIDP35CN4ZV2I');
INSERT INTO public.kit_component_modifiers VALUES (438, 4, 20, 'PGZSGZFNFBGHTVINPEKIVUUI');
INSERT INTO public.kit_component_modifiers VALUES (439, 4, 21, 'PCR5UJ6IUGI26YK7PZ4AW2XP');
INSERT INTO public.kit_component_modifiers VALUES (440, 5, 15, 'QRSLLGJGNJWI2LLA2AFDSZ5G');
INSERT INTO public.kit_component_modifiers VALUES (441, 5, 17, '7BB5JL3YPVGJ2HOI74BV5NIG');
INSERT INTO public.kit_component_modifiers VALUES (442, 5, 19, 'JEZ5DQXXP2RMDOGLBATT7RMX');
INSERT INTO public.kit_component_modifiers VALUES (443, 5, 20, 'G3FMUCYNRFUQUVOAYDD5CXPW');
INSERT INTO public.kit_component_modifiers VALUES (444, 5, 21, 'KCHFO4PDD6OSF4WAWYQGABCW');
INSERT INTO public.kit_component_modifiers VALUES (445, 9, 15, '3FIGVYR25XVQVZFIUR6BTYHZ');
INSERT INTO public.kit_component_modifiers VALUES (446, 9, 17, 'EUJ45Y3RW4IIMVP7WVUUXDFX');
INSERT INTO public.kit_component_modifiers VALUES (447, 9, 19, 'SQ3RW5AEEAYDNILBTKJFQOYN');
INSERT INTO public.kit_component_modifiers VALUES (448, 9, 20, 'XHPTRAMTX2FSCY5GCT73SEXT');
INSERT INTO public.kit_component_modifiers VALUES (449, 9, 21, '3FMNU2PEOFFABX3YWFXT6VTY');
INSERT INTO public.kit_component_modifiers VALUES (450, 10, 15, '3GBVHXPVXZOYGWVFAFAU6GDJ');
INSERT INTO public.kit_component_modifiers VALUES (451, 10, 17, '6W44CYRZZLHPT4HDI5ZFSAMX');
INSERT INTO public.kit_component_modifiers VALUES (452, 10, 19, 'CE35J4TMDAEPI7ZJNPMIIJXM');
INSERT INTO public.kit_component_modifiers VALUES (453, 10, 20, '33J3JK2GD5SPQOUVDYUWVXV6');
INSERT INTO public.kit_component_modifiers VALUES (454, 10, 21, 'KS7DK33J2RRFX2HL4NWPUGU4');
INSERT INTO public.kit_component_modifiers VALUES (455, 11, 15, 'RJHZELEVK7SCBQ2QZYCT6NTM');
INSERT INTO public.kit_component_modifiers VALUES (456, 11, 17, 'FPAKWOGTYH27EUPCIMPRCZA5');
INSERT INTO public.kit_component_modifiers VALUES (457, 11, 19, 'JYOQLNI7LH7WGGXBST5INH7Y');
INSERT INTO public.kit_component_modifiers VALUES (458, 11, 20, 'F3H6LRFOOEBM4NHWFL4VUWOW');
INSERT INTO public.kit_component_modifiers VALUES (459, 11, 21, 'K7BLFBBX24K53GBKEQHSRKHZ');
INSERT INTO public.kit_component_modifiers VALUES (460, 12, 15, 'ENT7UWE3REJGELE7PNUCR4HC');
INSERT INTO public.kit_component_modifiers VALUES (461, 12, 17, 'VWOWTSOSHNJKBKSETD2LO6SM');
INSERT INTO public.kit_component_modifiers VALUES (462, 12, 19, '5F7MT54RX5B3C4Z7Q6QIC7CH');
INSERT INTO public.kit_component_modifiers VALUES (463, 12, 20, 'FRJMQ3DC4E6M2IYSLZNK5EPS');
INSERT INTO public.kit_component_modifiers VALUES (464, 12, 21, 'UXVHMH3AT3HDVL75HJOPW5HH');
INSERT INTO public.kit_component_modifiers VALUES (465, 13, 15, '2EPLCXIGAYBBKZ77HZO2QKUI');
INSERT INTO public.kit_component_modifiers VALUES (466, 13, 17, 'IDCYIBCCHSKRODMYOPNVSLH6');
INSERT INTO public.kit_component_modifiers VALUES (467, 13, 19, 'JRPK5QR5YGDVOC6F47UPMADH');
INSERT INTO public.kit_component_modifiers VALUES (468, 13, 20, 'DVWFX22DIXJ362BYRZ2VRLKZ');
INSERT INTO public.kit_component_modifiers VALUES (469, 13, 21, 'EOPNTF3PPKUISUBAKBM6IUYR');
INSERT INTO public.kit_component_modifiers VALUES (470, 14, 15, 'NIHGTKWJUSERC5OIDN55L6DX');
INSERT INTO public.kit_component_modifiers VALUES (471, 14, 17, 'DIMO7Y6OT3GQLZC7SRRQ3MQO');
INSERT INTO public.kit_component_modifiers VALUES (472, 14, 19, 'CKTLJMTZSFEVP5IQYH2JXX4E');
INSERT INTO public.kit_component_modifiers VALUES (473, 14, 20, 'IFFIY2KEBC5U3EDPB6UBBEFV');
INSERT INTO public.kit_component_modifiers VALUES (474, 14, 21, '5MERNMH5ZQKVO3RYFWAZUE2Z');
INSERT INTO public.kit_component_modifiers VALUES (475, 15, 15, '52NGQVJSJN764QGU3GCGG6VA');
INSERT INTO public.kit_component_modifiers VALUES (476, 15, 17, 'N4QJ347WA3QYZF6YAFTWAVEU');
INSERT INTO public.kit_component_modifiers VALUES (477, 15, 19, 'KXAA4QIMUBYLO5XTUEM5SWZG');
INSERT INTO public.kit_component_modifiers VALUES (478, 15, 20, 'KV444X6LXIBQWRNWJ7J7VCZD');
INSERT INTO public.kit_component_modifiers VALUES (479, 15, 21, 'JQVO4DLI2W5TKHLPNLQSACY3');
INSERT INTO public.kit_component_modifiers VALUES (480, 16, 15, 'ZCNR7EAROLE5YV34LWJDASMR');
INSERT INTO public.kit_component_modifiers VALUES (481, 16, 17, '3QVBIACICD4CEF7QR7ZBOLDW');
INSERT INTO public.kit_component_modifiers VALUES (482, 16, 19, 'HHSIYH6FEA3KNC7Q5ZLXUYFA');
INSERT INTO public.kit_component_modifiers VALUES (483, 16, 20, 'GA46MNOGIBIW4ROFVLOWLSZB');
INSERT INTO public.kit_component_modifiers VALUES (484, 16, 21, '2MRENO2LA5GJ2JION2B5OXFX');
INSERT INTO public.kit_component_modifiers VALUES (485, 17, 15, 'F4QHFTWZ4THUX6D7IB7SRISB');
INSERT INTO public.kit_component_modifiers VALUES (486, 17, 17, 'AV4J7Z325KZS7E6U2IZCAHWH');
INSERT INTO public.kit_component_modifiers VALUES (487, 17, 19, 'BCQNI7I6KU5B2DEGMHUF2CNZ');
INSERT INTO public.kit_component_modifiers VALUES (488, 17, 20, 'HZOVF3OSIS5FWXPEQTKIGFNF');
INSERT INTO public.kit_component_modifiers VALUES (489, 17, 21, 'CFAS63SJA2QTZTDVBGZUKAPR');


--
-- TOC entry 4415 (class 0 OID 17253)
-- Dependencies: 231
-- Data for Name: product_color_variants; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_color_variants VALUES (4, 1, 0, '2026-07-24 16:47:29.034149+00', '2026-07-24 16:47:29.034149+00', 2, 'D23DJBF4QQYPF6F63WXRKTSK', 1785035578358, 'ZL3SWDXTBDXEV4OHE6SZCNW6');
INSERT INTO public.product_color_variants VALUES (5, 1, 0, '2026-07-24 16:47:36.75642+00', '2026-07-24 16:47:36.75642+00', 3, 'EOIITGL3UUDSJY2U5Z4ARLFS', 1785035578358, 'EVLKEBR56QORWI3RC7DUYVDI');
INSERT INTO public.product_color_variants VALUES (2, 9, 0, '2026-07-24 16:46:59.591874+00', '2026-07-24 16:46:59.591874+00', 2, 'BRYKFMWV54TQMQRVFEWQCHLX', 1785035656191, 'TL3SU7PV3QPNWMPWAEAB6EMZ');
INSERT INTO public.product_color_variants VALUES (1, 9, 1000, '2026-07-08 17:39:21.597654+00', '2026-07-08 17:39:21.597654+00', 1, 'JFXL7RQG6M62BP3G4VYIHZPZ', 1785035656191, 'EHR5GGB7MPJD626GO64QMJT3');
INSERT INTO public.product_color_variants VALUES (3, 9, 0, '2026-07-24 16:47:13.71981+00', '2026-07-24 16:47:13.71981+00', 3, '4AGDSWDB3D5K7XSZ2ULHY7CU', 1785035656191, 'UB5OL3DWHCJEGIDJQZMZ57ZT');
INSERT INTO public.product_color_variants VALUES (6, 23, 0, '2026-09-25 14:11:32.060237+00', '2026-09-25 14:11:32.060237+00', 2, 'PXEOWVY3RGX7PMVFL4FHASDZ', 1790345563035, 'ZHVMSZNVPM6DWR345GOYZ3LM');
INSERT INTO public.product_color_variants VALUES (7, 23, 0, '2026-09-25 14:11:32.060237+00', '2026-09-25 14:11:32.060237+00', 3, 'NT5F2YJWW6RFPS7CXPTSFEQH', 1790345563035, 'ZHVMSZNVPM6DWR345GOYZ3LM');


--
-- TOC entry 4417 (class 0 OID 17267)
-- Dependencies: 233
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_images VALUES (124, 9, '/images/kit_torsio_brun/04_kit_torsio_brun_outils.jpg', NULL, NULL, 0, false, '2026-07-04 16:35:20.282736', 2);
INSERT INTO public.product_images VALUES (131, 5, '/images/outils_med/pointe/16_pointe_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 20:38:56.862692', NULL);
INSERT INTO public.product_images VALUES (10, 10, '/images/outils_torsio/aiguilles/17_aiguilles_longues_dessus.jpg', 'Aiguilles de douleur Panassor', NULL, 0, true, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (89, 10, '/images/outils_torsio/aiguilles/15_aiguilles_longues_angle.jpg', NULL, NULL, 0, false, '2026-07-04 02:07:33.275228', NULL);
INSERT INTO public.product_images VALUES (88, 10, '/images/outils_torsio/aiguilles/18_aiguilles_longues_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 02:07:03.804926', NULL);
INSERT INTO public.product_images VALUES (90, 10, '/images/outils_torsio/aiguilles/16_aiguilles_longues_angle.jpg', NULL, NULL, 0, false, '2026-07-04 02:08:12.617277', NULL);
INSERT INTO public.product_images VALUES (12, 12, '/images/outils_torsio/correcteur/06_correcteur_dessus.jpg', 'Le Correcteur Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (91, 12, '/images/outils_torsio/correcteur/07_correcteur_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 02:11:07.761604', NULL);
INSERT INTO public.product_images VALUES (96, 12, '/images/outils_torsio/correcteur/05_correcteur_angle.jpg', NULL, NULL, 0, true, '2026-07-04 02:19:43.323779', NULL);
INSERT INTO public.product_images VALUES (95, 11, '/images/outils_torsio/redresseur/09_redresseur_angle.jpg', NULL, NULL, 0, true, '2026-07-04 02:17:11.629276', NULL);
INSERT INTO public.product_images VALUES (94, 11, '/images/outils_torsio/redresseur/10_redresseur_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 02:16:41.820759', NULL);
INSERT INTO public.product_images VALUES (11, 11, '/images/outils_torsio/redresseur/11_redresseur_dessus.jpg', 'Le Redresseur Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (1, 1, '/images/banniere/13_banner_med_ouvert.jpg', 'Kit du chirurgien Panassor', NULL, 1, true, '2026-06-21 20:07:11.756043', 3);
INSERT INTO public.product_images VALUES (13, 13, '/images/outils_torsio/dernier_argument/14_argument_dessus.jpg', 'Le Dernier Argument Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (14, 14, '/images/outils_torsio/pacificateur/01_pacificateur_dessus.jpg', 'Le Pacificateur Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (129, 8, '/images/outils_med/rouleau/09_rouleau.jpg', NULL, NULL, 0, true, '2026-07-04 20:36:31.303088', NULL);
INSERT INTO public.product_images VALUES (4, 4, '/images/outils_med/curette/17_curette_angle.jpg', 'Curette Panassor', NULL, 0, true, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (9, 9, '/images/kit_torsio_rouge/00_kit_torsio_rouge_devant.jpg', 'Kit du tortionnaire Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', 1);
INSERT INTO public.product_images VALUES (35, 1, '/images/kit_med_brun/11_kit_brun_ouvert.jpg', NULL, NULL, 1, false, '2026-07-03 23:48:31.297372', 2);
INSERT INTO public.product_images VALUES (40, 1, '/images/kit_med_brun/18_kit_brun_outils.jpg', NULL, NULL, 6, false, '2026-07-03 23:51:20.667566', 2);
INSERT INTO public.product_images VALUES (56, 1, '/images/kit_med_noir/10_kit_noir_ouvert.jpg', NULL, NULL, 5, false, '2026-07-04 00:12:23.194435', 3);
INSERT INTO public.product_images VALUES (61, 1, '/images/kit_med_noir/15_kit_noir_outils.jpg', NULL, NULL, 7, false, '2026-07-04 00:15:39.464254', 3);
INSERT INTO public.product_images VALUES (67, 1, '/images/kit_med_noir/00_kit_noir_devant.jpg', NULL, NULL, 3, false, '2026-07-04 00:36:52.051968', 3);
INSERT INTO public.product_images VALUES (104, 9, '/images/kit_torsio_rouge/08_kit_torsio_rouge_outils.jpg', NULL, NULL, 0, false, '2026-07-04 16:16:24.99985', 1);
INSERT INTO public.product_images VALUES (60, 1, '/images/kit_med_noir/14_kit_noir_outils.jpg', NULL, NULL, 6, false, '2026-07-04 00:15:16.098392', 3);
INSERT INTO public.product_images VALUES (64, 1, '/images/kit_med_noir/17_kit_noir_outils.jpg', NULL, NULL, 9, false, '2026-07-04 00:16:40.072278', 3);
INSERT INTO public.product_images VALUES (98, 9, '/images/kit_torsio_rouge/02_kit_torsio_rouge_derriere.jpg', NULL, NULL, 0, false, '2026-07-04 16:13:52.357728', 1);
INSERT INTO public.product_images VALUES (103, 9, '/images/kit_torsio_rouge/07_kit_torsio_rouge_ouvert.jpg', NULL, NULL, 0, true, '2026-07-04 16:16:01.590073', 1);
INSERT INTO public.product_images VALUES (120, 9, '/images/kit_torsio_brun/00_kit_torsio_brun_devant.jpg', NULL, NULL, 0, false, '2026-07-04 16:33:44.884541', 2);
INSERT INTO public.product_images VALUES (122, 9, '/images/kit_torsio_brun/02_kit_torsio_brun_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 16:34:53.179424', 2);
INSERT INTO public.product_images VALUES (119, 9, '/images/kit_torsio_noir/10_kit_torsio_noir_outils.jpg', NULL, NULL, 0, false, '2026-07-04 16:27:02.760666', 3);
INSERT INTO public.product_images VALUES (117, 9, '/images/kit_torsio_noir/08_kit_torsio_noir_outils.jpg', NULL, NULL, 0, false, '2026-07-04 16:26:42.693336', 3);
INSERT INTO public.product_images VALUES (121, 9, '/images/kit_torsio_brun/01_kit_torsio_brun_derriere.jpg', NULL, NULL, 0, false, '2026-07-04 16:34:38.209833', 2);
INSERT INTO public.product_images VALUES (73, 8, '/images/outils_med/rouleau/06_rouleau_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 01:21:09.261981', NULL);
INSERT INTO public.product_images VALUES (7, 7, '/images/outils_med/aiguilles/27_aiguilles_dessus.jpg', 'Aiguilles de suture Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (71, 7, '/images/outils_med/aiguilles/25_aiguilles_angle.jpg', NULL, NULL, 0, true, '2026-07-04 01:02:52.593291', NULL);
INSERT INTO public.product_images VALUES (74, 8, '/images/outils_med/rouleau/07_rouleau_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 01:21:24.319348', NULL);
INSERT INTO public.product_images VALUES (68, 7, '/images/outils_med/aiguilles/26_aiguilles_angle.jpg', NULL, NULL, 0, false, '2026-07-04 01:01:10.235717', NULL);
INSERT INTO public.product_images VALUES (86, 3, '/images/outils_med/ciseaux/02_ciseaux_dessus.jpg', NULL, NULL, 0, true, '2026-07-04 01:33:27.08125', NULL);
INSERT INTO public.product_images VALUES (2, 2, '/images/outils_med/spatule/24_spatule_angle.jpg', 'Spatule Panassor', NULL, 0, true, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (132, 4, '/images/outils_med/curette/18_curette_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 20:40:41.713448', NULL);
INSERT INTO public.product_images VALUES (80, 5, '/images/outils_med/pointe/12_pointe_angle.jpg', NULL, NULL, 0, false, '2026-07-04 01:25:40.433633', NULL);
INSERT INTO public.product_images VALUES (47, 1, '/images/kit_med_noir/04_kit_noir_derriere.jpg', NULL, NULL, 0, false, '2026-07-04 00:07:46.980757', NULL);
INSERT INTO public.product_images VALUES (69, 7, '/images/outils_med/aiguilles/28_aiguilles_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 01:01:40.097995', NULL);
INSERT INTO public.product_images VALUES (75, 8, '/images/outils_med/rouleau/08_rouleau_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 01:21:43.424088', NULL);
INSERT INTO public.product_images VALUES (130, 5, '/images/outils_med/pointe/14_pointe_angle.jpg', NULL, NULL, 0, true, '2026-07-04 20:38:37.644071', NULL);
INSERT INTO public.product_images VALUES (6, 6, '/images/outils_med/scalpel/20_scalpel_dessus.jpg', 'Scalpel Panassor', NULL, 0, false, '2026-06-21 20:07:11.756043', NULL);
INSERT INTO public.product_images VALUES (133, 3, '/images/outils_med/ciseaux/03_ciseaux_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 20:42:17.845765', NULL);
INSERT INTO public.product_images VALUES (134, 3, '/images/outils_med/ciseaux/04_ciseaux_angle.jpg', NULL, NULL, 0, false, '2026-07-04 20:42:32.520665', NULL);
INSERT INTO public.product_images VALUES (87, 6, '/images/outils_med/scalpel/19_scalpel_angle.jpg', NULL, NULL, 0, true, '2026-07-04 01:37:21.729564', NULL);
INSERT INTO public.product_images VALUES (137, 14, '/images/outils_torsio/pacificateur/03_pacificateur_dessus.jpg', NULL, NULL, 0, false, '2026-07-04 21:08:38.072245', NULL);
INSERT INTO public.product_images VALUES (138, 14, '/images/outils_torsio/pacificateur/00_pacificateur_angle.jpg', NULL, NULL, 0, true, '2026-07-04 21:08:53.510573', NULL);
INSERT INTO public.product_images VALUES (136, 13, '/images/outils_torsio/dernier_argument/13_argument_angle.jpg', NULL, NULL, 0, true, '2026-07-04 21:07:41.49379', NULL);
INSERT INTO public.product_images VALUES (38, 1, '/images/kit_med_brun/17_kit_brun_outils.jpg', NULL, NULL, 5, false, '2026-07-03 23:50:32.749881', 2);
INSERT INTO public.product_images VALUES (41, 1, '/images/banniere/06_banner_med_torsio.jpg', NULL, NULL, 2, false, '2026-07-04 00:05:39.855404', 3);
INSERT INTO public.product_images VALUES (46, 1, '/images/kit_med_noir/03_kit_noir_derriere.jpg', NULL, NULL, 4, false, '2026-07-04 00:07:14.499213', 3);
INSERT INTO public.product_images VALUES (109, 9, '/images/kit_torsio_noir/01_kit_torsio_noir_devant.jpg', NULL, NULL, 0, false, '2026-07-04 16:25:09.456691', 3);
INSERT INTO public.product_images VALUES (105, 9, '/images/kit_torsio_rouge/09_kit_torsio_rouge_outils.jpg', NULL, NULL, 0, false, '2026-07-04 16:16:36.203952', 1);
INSERT INTO public.product_images VALUES (24, 1, '/images/kit_med_brun/09_kit_brun_derriere.jpg', NULL, NULL, 3, false, '2026-07-03 23:42:41.928663', 2);
INSERT INTO public.product_images VALUES (36, 1, '/images/kit_med_brun/16_kit_brun_outils.jpg', NULL, NULL, 4, false, '2026-07-03 23:49:31.153245', 2);
INSERT INTO public.product_images VALUES (110, 9, '/images/kit_torsio_noir/02_kit_torsio_noir_derriere.jpg', NULL, NULL, 0, false, '2026-07-04 16:25:19.373652', 3);
INSERT INTO public.product_images VALUES (111, 9, '/images/kit_torsio_noir/03_kit_torsio_noir_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 16:25:39.444954', 3);
INSERT INTO public.product_images VALUES (16, 1, '/images/kit_med_brun/01_kit_brun_devant.jpg', 'Kit du chirurgien Panassor', NULL, 2, false, '2026-07-03 23:35:41.048033', 2);
INSERT INTO public.product_images VALUES (62, 1, '/images/kit_med_noir/16_kit_noir_outils.jpg', NULL, NULL, 8, false, '2026-07-04 00:16:08.289842', 3);
INSERT INTO public.product_images VALUES (112, 9, '/images/kit_torsio_noir/04_kit_torsio_noir_ouvert.jpg', NULL, NULL, 0, false, '2026-07-04 16:25:50.888381', 3);
INSERT INTO public.product_images VALUES (139, 15, '/images/voleurs_temp/tourne_serrure(2).jpg', 'Tourne-serrure', 'Lock Turner', 2, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (140, 18, '/images/voleurs_temp/key.jpg', 'Clé vierge + lime', 'Blank Key + File', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (141, 16, '/images/voleurs_temp/tourne_serrure(2).jpg', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 2, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (142, 24, '/images/voleurs_temp/crochet(3).jpg', 'Crochet', 'Lock Pick', 3, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (143, 24, '/images/voleurs_temp/crochet(2).jpg', 'Crochet', 'Lock Pick', 2, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (144, 17, '/images/voleurs_temp/lime(1).jpg', 'Lime', 'File', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (145, 23, '/images/voleurs_temp/LeKitArriveraProchainement.jpg', 'Kit du voleur', 'Thief''s Kit', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (146, 16, '/images/voleurs_temp/crochet.jpg', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 3, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (147, 15, '/images/voleurs_temp/tourne_serrure(1).jpg', 'Tourne-serrure', 'Lock Turner', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (148, 24, '/images/voleurs_temp/crochet.jpg', 'Crochet', 'Lock Pick', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (149, 16, '/images/voleurs_temp/tourne_serrure(1).jpg', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (150, 21, '/images/voleurs_temp/passe_exterieur.jpg', 'Passe extérieur', 'Outer Pass', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (151, 20, '/images/voleurs_temp/passe_interieur(1).jpg', 'Passe intérieur', 'Inner Pass', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (152, 24, '/images/voleurs_temp/crochet(1).jpg', 'Crochet', 'Lock Pick', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (153, 18, '/images/voleurs_temp/lime.jpg', 'Clé vierge + lime', 'Blank Key + File', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (154, 22, '/images/voleurs_temp/key(1).jpg', 'Clé vierge', 'Blank Key', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (155, 16, '/images/voleurs_temp/tourne_serrure.jpg', 'Crochet + tourne-serrure', 'Lock Pick + Lock Turner', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (156, 17, '/images/voleurs_temp/lime.jpg', 'Lime', 'File', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (157, 15, '/images/voleurs_temp/tourne_serrure.jpg', 'Tourne-serrure', 'Lock Turner', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (158, 19, '/images/voleurs_temp/passe_droite(1).jpg', 'Passe droite', 'Straight Pass', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (159, 22, '/images/voleurs_temp/key.jpg', 'Clé vierge', 'Blank Key', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (160, 19, '/images/voleurs_temp/passe_droite.jpg', 'Passe droite', 'Straight Pass', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (161, 20, '/images/voleurs_temp/passe_interieur.jpg', 'Passe intérieur', 'Inner Pass', 0, true, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (162, 21, '/images/voleurs_temp/passe_exterieur(1).jpg', 'Passe extérieur', 'Outer Pass', 1, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (163, 22, '/images/voleurs_temp/key(2).jpg', 'Clé vierge', 'Blank Key', 2, false, '2026-09-25 14:11:32.060237', NULL);
INSERT INTO public.product_images VALUES (164, 23, '/images/voleurs_temp/LeKitArriveraProchainement.jpg', 'Kit du voleur', 'Thief''s Kit', 1, false, '2026-09-25 14:11:32.060237', 3);
INSERT INTO public.product_images VALUES (165, 23, '/images/voleurs_temp/LeKitArriveraProchainement.jpg', 'Kit du voleur', 'Thief''s Kit', 1, false, '2026-09-25 14:11:32.060237', 2);


--
-- TOC entry 4428 (class 0 OID 0)
-- Dependencies: 220
-- Name: atelier_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.atelier_videos_id_seq', 2, true);


--
-- TOC entry 4429 (class 0 OID 0)
-- Dependencies: 244
-- Name: box_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.box_types_id_seq', 2, true);


--
-- TOC entry 4430 (class 0 OID 0)
-- Dependencies: 222
-- Name: collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.collections_id_seq', 3, true);


--
-- TOC entry 4431 (class 0 OID 0)
-- Dependencies: 224
-- Name: colors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.colors_id_seq', 3, true);


--
-- TOC entry 4432 (class 0 OID 0)
-- Dependencies: 226
-- Name: kit_component_modifiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kit_component_modifiers_id_seq', 489, true);


--
-- TOC entry 4433 (class 0 OID 0)
-- Dependencies: 228
-- Name: kit_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kit_items_id_seq', 19, true);


--
-- TOC entry 4434 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_color_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_color_prices_id_seq', 7, true);


--
-- TOC entry 4435 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 165, true);


--
-- TOC entry 4436 (class 0 OID 0)
-- Dependencies: 236
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 24, true);


-- Completed on 2026-09-29 17:55:06

--
-- PostgreSQL database dump complete
--

\unrestrict QLgGFeqdd1sGrhwGASethPzBHvgwFjwgGcWA0Mbrjx2lq8F2UanefL9T6dkpipm

