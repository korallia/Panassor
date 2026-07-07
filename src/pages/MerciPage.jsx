import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getOrderSummary } from "../../backend/panassorApi";
import { useLanguage } from "../context/LanguageContext";

import SectionTitle from "../components/layout/SectionTitle";
import CornerFrame from "../components/ui/CornerFrame";
import OrnamentDivider from "../components/ui/OrnamentDivider";

const LAST_CHECKOUT_STORAGE_KEY = "panassor_last_checkout";

const USE_MOCK_ORDER = true;

const MOCK_ORDER = {
  id: 12,
  status: "paid",
  language: "fr",
  customer: {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@example.com",
    phone: "+1 202 555-0143",
  },
  shippingAddress: {
    line1: "123 rue des Artisans",
    line2: "Appartement 4",
    locality: "Montréal",
    province: "QC",
    postalCode: "H2X 1Y4",
    country: "Canada",
  },
  totals: {
    subtotalCents: 29500,
    taxCents: 4418,
    totalCents: 33918,
    currency: "CAD",
  },
  items: [
    {
      name: "Kit du chirurgien",
      type: "kit",
      colorName: "Noir",
      quantity: 1,
      selectedItems: [
        { name: "Spatule" },
        { name: "Curette" },
        { name: "Crochet" },
        { name: "Scalpel" },
      ],
      unitPriceCents: 29500,
      totalPriceCents: 29500,
      cartKey: "kit__1__black__2-4-5-6",
    },
  ],
};

function formatMoney(cents, currency = "CAD", language = "fr") {
  const amount = Number(cents || 0) / 100;

  return new Intl.NumberFormat(language === "en" ? "en-CA" : "fr-CA", {
    style: "currency",
    currency,
  }).format(amount);
}

function getStatusLabel(status, language = "fr") {
  const labels = {
    pending: { fr: "Commande reçue", en: "Order received" },
    paid: { fr: "Paiement confirmé", en: "Payment confirmed" },
    failed: { fr: "Paiement non complété", en: "Payment not completed" },
    cancelled: { fr: "Commande annulée", en: "Order cancelled" },
    refunded: { fr: "Commande remboursée", en: "Order refunded" },
  };

  return labels[status]?.[language] || status;
}

function getStoredCheckout() {
  try {
    const storedCheckout = window.sessionStorage.getItem(
      LAST_CHECKOUT_STORAGE_KEY
    );

    if (!storedCheckout) return null;

    return JSON.parse(storedCheckout);
  } catch {
    return null;
  }
}

function hasShippingAddress(address) {
  return Boolean(
    address?.line1 ||
      address?.line2 ||
      address?.locality ||
      address?.province ||
      address?.postalCode ||
      address?.country
  );
}

function MerciPage() {
  const { language } = useLanguage();

  const [order, setOrder] = useState(USE_MOCK_ORDER ? MOCK_ORDER : null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_ORDER);

  const copy = useMemo(
    () =>
      language === "en"
        ? {
            eyebrow: "Panassor",
            title: "Thank you",
            subtitle: "We have received your order.",
            loading: "Loading order...",
            emptyTitle: "Thank you",
            emptyText: "No order summary is available for this session.",
            order: "Order",
            status: "Status",
            customer: "Customer",
            shipping: "Shipping",
            subtotal: "Subtotal",
            taxes: "Taxes",
            total: "Total",
            selectedItems: "Selected tools",
            quantity: "Quantity",
            noCustomer: "Information unavailable.",
            noShipping: "Information unavailable.",
            backHome: "Back to home",
          }
        : {
            eyebrow: "Panassor",
            title: "Merci",
            subtitle: "Nous avons bien reçu ta commande.",
            loading: "Chargement de la commande...",
            emptyTitle: "Merci",
            emptyText:
              "Aucun résumé de commande n’est disponible pour cette session.",
            order: "Commande",
            status: "Statut",
            customer: "Client",
            shipping: "Livraison",
            subtotal: "Sous-total",
            taxes: "Taxes",
            total: "Total",
            selectedItems: "Outils choisis",
            quantity: "Quantité",
            noCustomer: "Information non disponible.",
            noShipping: "Information non disponible.",
            backHome: "Retour à l’accueil",
          },
    [language]
  );

  useEffect(() => {
    if (USE_MOCK_ORDER) return;

    let isMounted = true;

    async function loadOrderSummary() {
      const storedCheckout = getStoredCheckout();
      const localOrderId = storedCheckout?.localOrderId;

      if (!localOrderId) {
        if (!isMounted) return;
        setIsLoading(false);
        return;
      }

      try {
        const orderSummary = await getOrderSummary(localOrderId);

        if (!isMounted) return;

        setOrder(orderSummary);
      } catch (error) {
        console.error("Failed to fetch order summary:", error);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    loadOrderSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const customerName = [order?.customer?.firstName, order?.customer?.lastName]
    .filter(Boolean)
    .join(" ");

  const hasCustomerInfo = Boolean(
    customerName || order?.customer?.email || order?.customer?.phone
  );

  const shippingAddress = order?.shippingAddress;
  const showShippingAddress = hasShippingAddress(shippingAddress);

  return (
    <main className="bg-[#080504] text-[#f3e7cf]">
      <section className="relative overflow-hidden px-4 py-10 md:px-6 md:py-14">
        <div className="relative mx-auto max-w-[88rem]">
          <div className="relative overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <CornerFrame size="lg" />

            <div className="relative z-10 px-5 py-10 md:px-16 md:py-16">
              <div className="mx-auto max-w-4xl text-center">
                <SectionTitle
                  eyebrow={copy.eyebrow}
                  title={order ? copy.title : copy.emptyTitle}
                  align="center"
                  showDivider={false}
                />

                <div className="mx-auto mt-6 h-px w-72 max-w-full bg-gradient-to-r from-transparent via-[#c89b3c]/85 to-transparent" />

                <p className="mx-auto mt-7 max-w-2xl font-['EB_Garamond'] text-2xl leading-9 text-[#d7c8ad]/86">
                  {isLoading
                    ? copy.loading
                    : order
                      ? copy.subtitle
                      : copy.emptyText}
                </p>

                <OrnamentDivider className="mt-9" width={112} opacity={0.65} />
              </div>

              {order && (
                <div className="mx-auto mt-12 max-w-4xl">
                  
                  {/* BLOC SUPÉRIEUR : COMMANDE & STATUT */}
                  <div className="grid border-t border-[#6f5423]/70 md:divide-x divide-[#6f5423]/40 md:grid-cols-2">
                    <div className="py-6 pr-6 md:pr-10">
                      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                        {copy.order}
                      </p>
                      <p className="mt-1 font-['IM_Fell_English_SC'] text-3xl uppercase text-[#fff1d2]">
                        #{order.id}
                      </p>
                    </div>

                    <div className="py-6 pl-6 md:pl-10">
                      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                        {copy.status}
                      </p>
                      <p className="mt-1 font-['IM_Fell_English_SC'] text-3xl uppercase text-[#fff1d2]">
                        {getStatusLabel(order.status, language)}
                      </p>
                    </div>
                  </div>

                  {/* LIGNE DE SÉPARATION VISUELLE COMPLÈTE & BLOC INFÉRIEUR : CLIENT & LIVRAISON */}
                  <div className="grid border-y border-[#6f5423]/70 border-t-[#6f5423]/40 md:divide-x divide-[#6f5423]/40 md:grid-cols-2">
                    <div className="py-6 pr-6 md:pr-10">
                      <section>
                        <h2 className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                          {copy.customer}
                        </h2>
                        {hasCustomerInfo ? (
                          <div className="mt-2 space-y-1 font-['EB_Garamond'] text-xl leading-7 text-[#d7c8ad]/88">
                            {customerName && <p className="font-medium text-[#fff1d2]">{customerName}</p>}
                            {order.customer?.email && <p className="text-[#d7c8ad]/70">{order.customer.email}</p>}
                            {order.customer?.phone && <p className="text-[#d7c8ad]/70">{order.customer.phone}</p>}
                          </div>
                        ) : (
                          <p className="mt-2 font-['EB_Garamond'] text-xl text-[#d7c8ad]/60">{copy.noCustomer}</p>
                        )}
                      </section>
                    </div>

                    <div className="py-6 pl-6 md:pl-10">
                      <section>
                        <h2 className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                          {copy.shipping}
                        </h2>
                        {showShippingAddress ? (
                          <div className="mt-2 space-y-1 font-['EB_Garamond'] text-xl leading-7 text-[#d7c8ad]/88">
                            {shippingAddress.line1 && <p>{shippingAddress.line1}</p>}
                            {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                            {(shippingAddress.locality || shippingAddress.province) && (
                              <p>
                                {[shippingAddress.locality, shippingAddress.province].filter(Boolean).join(", ")}
                              </p>
                            )}
                            {shippingAddress.postalCode && <p>{shippingAddress.postalCode}</p>}
                            {shippingAddress.country && <p>{shippingAddress.country}</p>}
                          </div>
                        ) : (
                          <p className="mt-2 font-['EB_Garamond'] text-xl text-[#d7c8ad]/60">{copy.noShipping}</p>
                        )}
                      </section>
                    </div>
                  </div>

                  {/* ARTICLES & FINANCES */}
                  <section className="py-8">
                    <div className="space-y-7">
                      {(order.items || []).map((item, index) => (
                        <article
                          key={`${item.cartKey || item.name}-${index}`}
                          className="border-b border-[#6f5423]/55 pb-7 last:border-b-0"
                        >
                          <div className="grid md:grid-cols-2 md:gap-20">
                            <div>
                              <h3 className="font-['IM_Fell_English_SC'] text-3xl uppercase text-[#fff1d2]">
                                {item.name}
                              </h3>

                              {item.colorName && (
                                <p className="mt-2 font-['EB_Garamond'] text-xl text-[#d7c8ad]/88">
                                  {item.colorName}
                                </p>
                              )}

                              {Array.isArray(item.selectedItems) &&
                                item.selectedItems.length > 0 && (
                                  <p className="mt-3 max-w-2xl font-['EB_Garamond'] text-xl leading-7 text-[#d7c8ad]/88">
                                    {copy.selectedItems} :{" "}
                                    {item.selectedItems
                                      .map((selectedItem) => selectedItem.name)
                                      .join(", ")}
                                  </p>
                                )}

                              <p className="mt-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/88">
                                {copy.quantity} : {item.quantity}
                              </p>
                            </div>

                            <p className="mt-4 font-['IM_Fell_English_SC'] text-2xl uppercase text-[#c89b3c] md:mt-0 md:text-right">
                              {formatMoney(
                                item.totalPriceCents,
                                order.totals.currency,
                                language
                              )}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="mt-8 border-t border-[#6f5423]/70 pt-6">
                      <div className="grid md:grid-cols-2 md:gap-20">
                        <div />

                        <div className="space-y-3 font-['EB_Garamond'] text-xl text-[#d7c8ad]/88">
                          <div className="grid grid-cols-[1fr_auto] gap-8">
                            <span>{copy.subtotal}</span>
                            <span>
                              {formatMoney(
                                order.totals.subtotalCents,
                                order.totals.currency,
                                language
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-[1fr_auto] gap-8">
                            <span>{copy.taxes}</span>
                            <span>
                              {formatMoney(
                                order.totals.taxCents,
                                order.totals.currency,
                                language
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-[1fr_auto] gap-8 border-t border-[#6f5423]/70 pt-4 font-['IM_Fell_English_SC'] text-3xl uppercase text-[#fff1d2]">
                            <span>{copy.total}</span>
                            <span>
                              {formatMoney(
                                order.totals.totalCents,
                                order.totals.currency,
                                language
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {/* BOUTON RETOUR */}
              <div className="mx-auto mt-16 flex max-w-4xl justify-center pt-4 pb-2">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-7 py-4 font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904]"
                >
                  <span className="mr-3">✦</span>
                  {copy.backHome}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default MerciPage;