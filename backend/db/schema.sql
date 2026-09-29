--
-- PostgreSQL database dump
--

\restrict BKJGff6fkidZITfTXhNdcl5JyhhVVSbLgtgvJrVGxgSYA9yNkhqoPul8uUxbbxA

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.6

-- Started on 2026-09-29 17:50:24

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
-- TOC entry 5 (class 2615 OID 17125)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 4516 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 878 (class 1247 OID 17128)
-- Name: order_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.order_status AS ENUM (
    'pending',
    'paid',
    'failed',
    'cancelled',
    'refunded'
);


--
-- TOC entry 881 (class 1247 OID 17140)
-- Name: shipment_item_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.shipment_item_status AS ENUM (
    'pending',
    'preparing',
    'ready',
    'packed',
    'cancelled'
);


--
-- TOC entry 884 (class 1247 OID 17152)
-- Name: shipment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.shipment_status AS ENUM (
    'pending',
    'preparing',
    'ready_to_ship',
    'shipped',
    'delivered',
    'cancelled',
    'returned'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 17167)
-- Name: atelier_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.atelier_videos (
    id integer NOT NULL,
    slug_fr text,
    slug_en text,
    title_fr text NOT NULL,
    title_en text NOT NULL,
    eyebrow_fr text,
    eyebrow_en text,
    description_fr text,
    description_en text,
    video_url text NOT NULL,
    poster_url text,
    sort_order integer DEFAULT 100,
    featured boolean DEFAULT false,
    status text DEFAULT 'published'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 220 (class 1259 OID 17181)
-- Name: atelier_videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.atelier_videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4517 (class 0 OID 0)
-- Dependencies: 220
-- Name: atelier_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.atelier_videos_id_seq OWNED BY public.atelier_videos.id;


--
-- TOC entry 243 (class 1259 OID 17502)
-- Name: box_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.box_types (
    id integer NOT NULL,
    slug character varying(40) NOT NULL,
    name_fr character varying(80) NOT NULL,
    name_en character varying(80),
    weight_grams integer NOT NULL,
    length_cm numeric(6,2) NOT NULL,
    width_cm numeric(6,2) NOT NULL,
    height_cm numeric(6,2) NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 4518 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE box_types; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.box_types IS 'Formats de boîtes d''expédition disponibles. packing.service.js choisit, parmi celles dont le volume suffit, celle avec le poids le plus bas.';


--
-- TOC entry 244 (class 1259 OID 17518)
-- Name: box_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.box_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4519 (class 0 OID 0)
-- Dependencies: 244
-- Name: box_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.box_types_id_seq OWNED BY public.box_types.id;


--
-- TOC entry 221 (class 1259 OID 17182)
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    slug_fr character varying(120) NOT NULL,
    name_fr character varying(160) NOT NULL,
    name_en character varying(160),
    title_fr character varying(200),
    title_en character varying(200),
    eyebrow_fr character varying(160),
    eyebrow_en character varying(160),
    url_fr character varying(255),
    description_fr text,
    description_en text,
    long_description_fr text,
    long_description_en text,
    hero_image_url text,
    thumbnail_image_url text,
    video_url text,
    video_poster_url text,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT 'published'::text,
    slug_en character varying(120),
    url_en character varying(120),
    intro_image_url text
);


--
-- TOC entry 222 (class 1259 OID 17197)
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4520 (class 0 OID 0)
-- Dependencies: 222
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- TOC entry 223 (class 1259 OID 17198)
-- Name: colors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.colors (
    id integer NOT NULL,
    name_en text,
    hex_code text,
    name_fr text
);


--
-- TOC entry 224 (class 1259 OID 17204)
-- Name: colors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.colors ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.colors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 17205)
-- Name: kit_component_modifiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kit_component_modifiers (
    id integer NOT NULL,
    kit_component_id integer NOT NULL,
    tool_product_id integer NOT NULL,
    square_modifier_id text
);


--
-- TOC entry 226 (class 1259 OID 17213)
-- Name: kit_component_modifiers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kit_component_modifiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4521 (class 0 OID 0)
-- Dependencies: 226
-- Name: kit_component_modifiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kit_component_modifiers_id_seq OWNED BY public.kit_component_modifiers.id;


--
-- TOC entry 227 (class 1259 OID 17214)
-- Name: kit_components; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kit_components (
    id integer NOT NULL,
    kit_product_id integer NOT NULL,
    included_product_id integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    square_modifier_id text,
    square_modifier_list_version bigint,
    CONSTRAINT no_self_inclusion CHECK ((kit_product_id <> included_product_id))
);


--
-- TOC entry 228 (class 1259 OID 17229)
-- Name: kit_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kit_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4522 (class 0 OID 0)
-- Dependencies: 228
-- Name: kit_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kit_items_id_seq OWNED BY public.kit_components.id;


--
-- TOC entry 245 (class 1259 OID 17527)
-- Name: order_number_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_number_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 229 (class 1259 OID 17230)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    status public.order_status DEFAULT 'pending'::public.order_status NOT NULL,
    square_order_id text,
    square_payment_link_id text,
    square_payment_id text,
    checkout_url text,
    subtotal_cents integer DEFAULT 0 NOT NULL,
    tax_cents integer DEFAULT 0 NOT NULL,
    total_cents integer DEFAULT 0 NOT NULL,
    currency text DEFAULT 'CAD'::text NOT NULL,
    order_note text,
    cart_snapshot jsonb DEFAULT '[]'::jsonb NOT NULL,
    square_payload jsonb,
    square_payment_snapshot jsonb,
    square_order_snapshot jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    thank_you_token text,
    selected_carrier character varying(30),
    shipping_carrier_label character varying(160),
    shipping_service_code character varying(50),
    shipping_service_label character varying(160),
    shipping_cents integer,
    order_number integer
);


--
-- TOC entry 4523 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN orders.selected_carrier; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.orders.selected_carrier IS 'Transporteur choisi par le client au checkout ("postes_canada" ou "purolator") -- recopié sur shipments.carrier à la création du shipment.';


--
-- TOC entry 230 (class 1259 OID 17252)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4524 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 231 (class 1259 OID 17253)
-- Name: product_color_variants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_color_variants (
    id integer NOT NULL,
    product_id integer NOT NULL,
    price_delta_cents integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    color_id integer,
    square_variation_id text,
    square_variation_version bigint,
    square_image_id character varying
);


--
-- TOC entry 232 (class 1259 OID 17266)
-- Name: product_color_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_color_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4525 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_color_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_color_prices_id_seq OWNED BY public.product_color_variants.id;


--
-- TOC entry 233 (class 1259 OID 17267)
-- Name: product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    product_id integer NOT NULL,
    url text NOT NULL,
    alt_fr character varying(255),
    alt_en character varying(255),
    sort_order integer DEFAULT 0 NOT NULL,
    is_main boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    color_id integer
);


--
-- TOC entry 234 (class 1259 OID 17281)
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4526 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- TOC entry 235 (class 1259 OID 17282)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    collection_id integer NOT NULL,
    slug_fr character varying(120) NOT NULL,
    name_fr character varying(160) NOT NULL,
    name_en character varying(160),
    title_fr character varying(200),
    title_en character varying(200),
    description_fr text,
    description_en text,
    long_description_fr text,
    long_description_en text,
    price_cents integer,
    customizable boolean DEFAULT false NOT NULL,
    is_kit boolean DEFAULT false NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug_en text,
    square_item_id text,
    square_item_version bigint,
    square_image_id character varying,
    square_default_variation_id text,
    weight_grams integer,
    length_cm numeric(6,2),
    width_cm numeric(6,2),
    height_cm numeric(6,2)
);


--
-- TOC entry 4527 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN products.weight_grams; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.weight_grams IS 'Poids réel du produit seul (sans boîte), en grammes.';


--
-- TOC entry 4528 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN products.length_cm; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.length_cm IS 'Longueur réelle du produit, en cm.';


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN products.width_cm; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.width_cm IS 'Largeur réelle du produit, en cm.';


--
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN products.height_cm; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.products.height_cm IS 'Hauteur réelle du produit, en cm.';


--
-- TOC entry 236 (class 1259 OID 17301)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4531 (class 0 OID 0)
-- Dependencies: 236
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 237 (class 1259 OID 17302)
-- Name: shipment_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment_events (
    id integer NOT NULL,
    shipment_id integer NOT NULL,
    shipment_item_id integer,
    event_type text NOT NULL,
    previous_status text,
    new_status text,
    source text DEFAULT 'system'::text NOT NULL,
    actor_name text,
    actor_external_id text,
    message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 17314)
-- Name: shipment_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipment_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 238
-- Name: shipment_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipment_events_id_seq OWNED BY public.shipment_events.id;


--
-- TOC entry 239 (class 1259 OID 17315)
-- Name: shipment_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipment_items (
    id integer NOT NULL,
    shipment_id integer NOT NULL,
    parent_shipment_item_id integer,
    product_id integer,
    product_slug text,
    cart_key text,
    type text DEFAULT 'product'::text NOT NULL,
    name text NOT NULL,
    color_name text,
    color_key text,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price_cents integer DEFAULT 0 NOT NULL,
    total_price_cents integer DEFAULT 0 NOT NULL,
    status public.shipment_item_status DEFAULT 'pending'::public.shipment_item_status NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 240 (class 1259 OID 17339)
-- Name: shipment_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipment_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 240
-- Name: shipment_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipment_items_id_seq OWNED BY public.shipment_items.id;


--
-- TOC entry 241 (class 1259 OID 17340)
-- Name: shipments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    status public.shipment_status DEFAULT 'pending'::public.shipment_status NOT NULL,
    recipient_email text,
    recipient_phone text,
    address_line_1 text,
    address_line_2 text,
    locality text,
    province text,
    postal_code text,
    country text,
    carrier text,
    tracking_number text,
    tracking_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    recipient_display_name text,
    admin_access_token character varying(64),
    tracking_email_sent_at timestamp without time zone,
    discord_message_id character varying(32),
    carrier_tracking_checked_at timestamp without time zone,
    delivered_at timestamp without time zone
);


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN shipments.admin_access_token; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shipments.admin_access_token IS 'Jeton secret (dans l''URL) donnant accès à la page où entrer le transporteur/tracking pour CETTE expédition -- pas un vrai login, même principe que orders.thank_you_token.';


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN shipments.tracking_email_sent_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shipments.tracking_email_sent_at IS 'Quand le courriel de suivi a été envoyé au client pour la dernière fois (NULL si jamais envoyé).';


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN shipments.discord_message_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shipments.discord_message_id IS 'ID du message Discord de notification de cette commande -- permet de l''éditer en place (PATCH webhook) au lieu de reposter.';


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN shipments.carrier_tracking_checked_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shipments.carrier_tracking_checked_at IS 'Dernière fois que le poller a interrogé l''API du transporteur pour cette expédition.';


--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN shipments.delivered_at; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shipments.delivered_at IS 'Quand le transporteur a rapporté la livraison (détecté automatiquement).';


--
-- TOC entry 242 (class 1259 OID 17353)
-- Name: shipments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 4539 (class 0 OID 0)
-- Dependencies: 242
-- Name: shipments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;


--
-- TOC entry 4232 (class 2604 OID 17354)
-- Name: atelier_videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelier_videos ALTER COLUMN id SET DEFAULT nextval('public.atelier_videos_id_seq'::regclass);


--
-- TOC entry 4287 (class 2604 OID 17519)
-- Name: box_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.box_types ALTER COLUMN id SET DEFAULT nextval('public.box_types_id_seq'::regclass);


--
-- TOC entry 4238 (class 2604 OID 17355)
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- TOC entry 4243 (class 2604 OID 17356)
-- Name: kit_component_modifiers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_component_modifiers ALTER COLUMN id SET DEFAULT nextval('public.kit_component_modifiers_id_seq'::regclass);


--
-- TOC entry 4244 (class 2604 OID 17357)
-- Name: kit_components id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_components ALTER COLUMN id SET DEFAULT nextval('public.kit_items_id_seq'::regclass);


--
-- TOC entry 4248 (class 2604 OID 17358)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4257 (class 2604 OID 17359)
-- Name: product_color_variants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_color_variants ALTER COLUMN id SET DEFAULT nextval('public.product_color_prices_id_seq'::regclass);


--
-- TOC entry 4261 (class 2604 OID 17360)
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- TOC entry 4265 (class 2604 OID 17361)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4271 (class 2604 OID 17362)
-- Name: shipment_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events ALTER COLUMN id SET DEFAULT nextval('public.shipment_events_id_seq'::regclass);


--
-- TOC entry 4274 (class 2604 OID 17363)
-- Name: shipment_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items ALTER COLUMN id SET DEFAULT nextval('public.shipment_items_id_seq'::regclass);


--
-- TOC entry 4283 (class 2604 OID 17364)
-- Name: shipments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);


--
-- TOC entry 4293 (class 2606 OID 17366)
-- Name: atelier_videos atelier_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.atelier_videos
    ADD CONSTRAINT atelier_videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4347 (class 2606 OID 17521)
-- Name: box_types box_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.box_types
    ADD CONSTRAINT box_types_pkey PRIMARY KEY (id);


--
-- TOC entry 4349 (class 2606 OID 17523)
-- Name: box_types box_types_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.box_types
    ADD CONSTRAINT box_types_slug_key UNIQUE (slug);


--
-- TOC entry 4295 (class 2606 OID 17368)
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- TOC entry 4297 (class 2606 OID 17370)
-- Name: collections collections_slug_fr_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_slug_fr_key UNIQUE (slug_fr);


--
-- TOC entry 4299 (class 2606 OID 17372)
-- Name: colors colors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.colors
    ADD CONSTRAINT colors_pkey PRIMARY KEY (id);


--
-- TOC entry 4301 (class 2606 OID 17374)
-- Name: kit_component_modifiers kit_component_modifiers_kit_component_id_tool_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_component_modifiers
    ADD CONSTRAINT kit_component_modifiers_kit_component_id_tool_product_id_key UNIQUE (kit_component_id, tool_product_id);


--
-- TOC entry 4303 (class 2606 OID 17376)
-- Name: kit_component_modifiers kit_component_modifiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_component_modifiers
    ADD CONSTRAINT kit_component_modifiers_pkey PRIMARY KEY (id);


--
-- TOC entry 4307 (class 2606 OID 17378)
-- Name: kit_components kit_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_components
    ADD CONSTRAINT kit_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4316 (class 2606 OID 17529)
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- TOC entry 4318 (class 2606 OID 17380)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4321 (class 2606 OID 17382)
-- Name: product_color_variants product_color_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_color_variants
    ADD CONSTRAINT product_color_prices_pkey PRIMARY KEY (id);


--
-- TOC entry 4324 (class 2606 OID 17384)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4327 (class 2606 OID 17386)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4329 (class 2606 OID 17388)
-- Name: products products_slug_fr_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_fr_key UNIQUE (slug_fr);


--
-- TOC entry 4333 (class 2606 OID 17390)
-- Name: shipment_events shipment_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events
    ADD CONSTRAINT shipment_events_pkey PRIMARY KEY (id);


--
-- TOC entry 4337 (class 2606 OID 17392)
-- Name: shipment_items shipment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items
    ADD CONSTRAINT shipment_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4341 (class 2606 OID 17525)
-- Name: shipments shipments_admin_access_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_admin_access_token_key UNIQUE (admin_access_token);


--
-- TOC entry 4343 (class 2606 OID 17394)
-- Name: shipments shipments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_key UNIQUE (order_id);


--
-- TOC entry 4345 (class 2606 OID 17396)
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- TOC entry 4309 (class 2606 OID 17398)
-- Name: kit_components unique_kit_item; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_components
    ADD CONSTRAINT unique_kit_item UNIQUE (kit_product_id, included_product_id);


--
-- TOC entry 4304 (class 1259 OID 17399)
-- Name: idx_kit_items_included_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kit_items_included_product_id ON public.kit_components USING btree (included_product_id);


--
-- TOC entry 4305 (class 1259 OID 17400)
-- Name: idx_kit_items_kit_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kit_items_kit_product_id ON public.kit_components USING btree (kit_product_id);


--
-- TOC entry 4310 (class 1259 OID 17401)
-- Name: idx_orders_square_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_square_order_id ON public.orders USING btree (square_order_id);


--
-- TOC entry 4311 (class 1259 OID 17402)
-- Name: idx_orders_square_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_square_payment_id ON public.orders USING btree (square_payment_id);


--
-- TOC entry 4312 (class 1259 OID 17403)
-- Name: idx_orders_square_payment_link_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_square_payment_link_id ON public.orders USING btree (square_payment_link_id);


--
-- TOC entry 4313 (class 1259 OID 17404)
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- TOC entry 4314 (class 1259 OID 17405)
-- Name: idx_orders_thank_you_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_orders_thank_you_token ON public.orders USING btree (thank_you_token);


--
-- TOC entry 4319 (class 1259 OID 17406)
-- Name: idx_product_color_prices_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_color_prices_product_id ON public.product_color_variants USING btree (product_id);


--
-- TOC entry 4322 (class 1259 OID 17407)
-- Name: idx_product_images_product_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_images_product_id ON public.product_images USING btree (product_id);


--
-- TOC entry 4325 (class 1259 OID 17408)
-- Name: idx_products_collection_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_products_collection_id ON public.products USING btree (collection_id);


--
-- TOC entry 4330 (class 1259 OID 17409)
-- Name: idx_shipment_events_shipment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipment_events_shipment_id ON public.shipment_events USING btree (shipment_id);


--
-- TOC entry 4331 (class 1259 OID 17410)
-- Name: idx_shipment_events_shipment_item_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipment_events_shipment_item_id ON public.shipment_events USING btree (shipment_item_id);


--
-- TOC entry 4334 (class 1259 OID 17411)
-- Name: idx_shipment_items_shipment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipment_items_shipment_id ON public.shipment_items USING btree (shipment_id);


--
-- TOC entry 4335 (class 1259 OID 17412)
-- Name: idx_shipment_items_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipment_items_status ON public.shipment_items USING btree (status);


--
-- TOC entry 4338 (class 1259 OID 17413)
-- Name: idx_shipments_order_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipments_order_id ON public.shipments USING btree (order_id);


--
-- TOC entry 4339 (class 1259 OID 17414)
-- Name: idx_shipments_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_shipments_status ON public.shipments USING btree (status);


--
-- TOC entry 4350 (class 2606 OID 17415)
-- Name: kit_component_modifiers kit_component_modifiers_kit_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_component_modifiers
    ADD CONSTRAINT kit_component_modifiers_kit_component_id_fkey FOREIGN KEY (kit_component_id) REFERENCES public.kit_components(id) ON DELETE CASCADE;


--
-- TOC entry 4351 (class 2606 OID 17420)
-- Name: kit_component_modifiers kit_component_modifiers_tool_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_component_modifiers
    ADD CONSTRAINT kit_component_modifiers_tool_product_id_fkey FOREIGN KEY (tool_product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4352 (class 2606 OID 17425)
-- Name: kit_components kit_items_included_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_components
    ADD CONSTRAINT kit_items_included_product_id_fkey FOREIGN KEY (included_product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4353 (class 2606 OID 17430)
-- Name: kit_components kit_items_kit_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kit_components
    ADD CONSTRAINT kit_items_kit_product_id_fkey FOREIGN KEY (kit_product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4354 (class 2606 OID 17435)
-- Name: product_color_variants product_color_prices_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_color_variants
    ADD CONSTRAINT product_color_prices_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4355 (class 2606 OID 17440)
-- Name: product_color_variants product_color_variant_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_color_variants
    ADD CONSTRAINT product_color_variant_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(id);


--
-- TOC entry 4356 (class 2606 OID 17445)
-- Name: product_images product_images_color_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_color_id_fkey FOREIGN KEY (color_id) REFERENCES public.colors(id);


--
-- TOC entry 4357 (class 2606 OID 17450)
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 4358 (class 2606 OID 17455)
-- Name: products products_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- TOC entry 4359 (class 2606 OID 17460)
-- Name: shipment_events shipment_events_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events
    ADD CONSTRAINT shipment_events_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE;


--
-- TOC entry 4360 (class 2606 OID 17465)
-- Name: shipment_events shipment_events_shipment_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_events
    ADD CONSTRAINT shipment_events_shipment_item_id_fkey FOREIGN KEY (shipment_item_id) REFERENCES public.shipment_items(id) ON DELETE SET NULL;


--
-- TOC entry 4361 (class 2606 OID 17470)
-- Name: shipment_items shipment_items_parent_shipment_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items
    ADD CONSTRAINT shipment_items_parent_shipment_item_id_fkey FOREIGN KEY (parent_shipment_item_id) REFERENCES public.shipment_items(id) ON DELETE CASCADE;


--
-- TOC entry 4362 (class 2606 OID 17475)
-- Name: shipment_items shipment_items_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipment_items
    ADD CONSTRAINT shipment_items_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE;


--
-- TOC entry 4363 (class 2606 OID 17480)
-- Name: shipments shipments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


-- Completed on 2026-09-29 17:50:25

--
-- PostgreSQL database dump complete
--

\unrestrict BKJGff6fkidZITfTXhNdcl5JyhhVVSbLgtgvJrVGxgSYA9yNkhqoPul8uUxbbxA

