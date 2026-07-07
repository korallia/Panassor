import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getOrderSummary, syncSquareOrder } from "../../backend/panassorApi";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

import CornerFrame from "../components/ui/CornerFrame";
import OrnamentDivider from "../components/ui/OrnamentDivider";

const LAST_CHECKOUT_STORAGE_KEY = "panassor_last_checkout";
const LAST_PAID_ORDER_STORAGE_KEY = "panassor_last_paid_order_id";
const CART_STORAGE_KEY = "panassor_cart_v1";

const USE_MOCK_ORDER = false;

const MOCK_ORDER = {
  id: 12,
  status: "paid",
  shipment: {
    recipient: {
      displayName: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "+1 202 555-0143",
    },
    address: {
      line1: "123 rue des Artisans",
      line2: "Appartement 4",
      locality: "Montréal",
      province: "QC",
      postalCode: "H2X 1Y4",
      country: "CA",
    },
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
    abandoned: { fr: "Commande abandonnée", en: "Order abandoned" },
  };

  return labels[status]?.[language] || status;
}

function getOrderAccessFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return {
    orderId: params.get("orderId"),
    key: params.get("key"),
  };
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

function normalizeShipment(shipment) {
  if (!shipment) {
    return {
      recipient: null,
      address: null,
    };
  }

  const recipient = shipment.recipient || {
    displayName:
      shipment.recipientDisplayName ||
      shipment.recipient_display_name ||
      shipment.displayName ||
      null,
    email:
      shipment.recipientEmail ||
      shipment.recipient_email ||
      shipment.email ||
      null,
    phone:
      shipment.recipientPhone ||
      shipment.recipient_phone ||
      shipment.phone ||
      null,
  };

  const address = shipment.address || {
    line1:
      shipment.addressLine1 ||
      shipment.address_line_1 ||
      shipment.line1 ||
      null,
    line2:
      shipment.addressLine2 ||
      shipment.address_line_2 ||
      shipment.line2 ||
      null,
    locality: shipment.locality || null,
    province: shipment.province || null,
    postalCode:
      shipment.postalCode ||
      shipment.postal_code ||
      shipment.postal ||
      null,
    country: shipment.country || null,
  };

  return {
    ...shipment,
    recipient,
    address,
  };
}

function clearStoredCartAndCheckout() {
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    window.sessionStorage.removeItem(LAST_CHECKOUT_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

function storeLastPaidOrderId(orderId) {
  try {
    window.localStorage.setItem(LAST_PAID_ORDER_STORAGE_KEY, String(orderId));
  } catch {
    // ignore storage errors
  }
}

function MerciPage() {
  const { language, setLanguage } = useLanguage();
  const { clearCart } = useCart();

  const isEnglishPath = window.location.pathname === "/thank-you";
  const isFrenchPath = window.location.pathname === "/merci";
  const pageLanguage = isEnglishPath ? "en" : isFrenchPath ? "fr" : language;

  const [order, setOrder] = useState(USE_MOCK_ORDER ? MOCK_ORDER : null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_ORDER);

  useEffect(() => {
    if (isEnglishPath) {
      setLanguage?.("en");
      return;
    }

    if (isFrenchPath) {
      setLanguage?.("fr");
    }
  }, [isEnglishPath, isFrenchPath, setLanguage]);

  const copy = useMemo(
    () =>
      pageLanguage === "en"
        ? {
            eyebrow: "Panassor",
            title: "Thank you",
            subtitle: "We have received your order.",
            loading: "Loading order...",
            emptyTitle: "Thank you",
            emptyText: "No order summary is available for this link.",
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
              "Aucun résumé de commande n’est disponible pour ce lien.",
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
    [pageLanguage]
  );

  useEffect(() => {
    if (USE_MOCK_ORDER) return;

    let isMounted = true;

    async function loadOrderSummary() {
      const { orderId, key } = getOrderAccessFromUrl();

      if (!orderId || !key) {
        if (!isMounted) return;
        setIsLoading(false);
        return;
      }

      try {
        await syncSquareOrder(orderId, key).catch((error) => {
          console.warn("Square sync on thank-you page failed:", error);
        });

        const orderSummary = await getOrderSummary(orderId, key);

        if (!isMounted) return;

        setOrder(orderSummary);

        if (orderSummary?.status === "paid") {
          storeLastPaidOrderId(orderSummary.id);
        }

        const storedCheckout = getStoredCheckout();

        const shouldClearCart =
          orderSummary?.status === "paid" &&
          String(storedCheckout?.localOrderId) === String(orderSummary.id);

        if (shouldClearCart) {
          clearCart();
          clearStoredCartAndCheckout();
        }
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
  }, [clearCart]);

  const shipment = normalizeShipment(order?.shipment);
  const recipient = shipment.recipient;
  const shippingAddress = shipment.address;

  const hasCustomerInfo = Boolean(
    recipient?.displayName || recipient?.email || recipient?.phone
  );

  const showShippingAddress = hasShippingAddress(shippingAddress);

  return (
    <main className="bg-[#080504] text-[#f3e7cf]">
      <section className="relative overflow-hidden px-3 py-6 md:px-6 md:py-14">
        <div className="relative mx-auto max-w-[88rem]">
          <div className="relative overflow-hidden border border-[#6f5423]/80 bg-[#120c07] shadow-[0_18px_60px_rgba(0,0,0,0.6)]">
            <CornerFrame size="lg" />

            <div className="relative z-10 px-4 py-8 md:px-16 md:py-16">
              <div className="mx-auto max-w-4xl text-center">
                <p className="mb-3 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.22em] text-[#c89b3c] md:text-sm">
                  {copy.eyebrow}
                </p>

                <h1 className="font-['IM_Fell_English_SC'] text-4xl uppercase leading-none text-[#fff1d2] md:text-7xl">
                  {order ? copy.title : copy.emptyTitle}
                </h1>

                <div className="mx-auto mt-5 h-px w-56 max-w-full bg-gradient-to-r from-transparent via-[#c89b3c]/85 to-transparent md:mt-6 md:w-72" />

                <p className="mx-auto mt-6 max-w-2xl font-['EB_Garamond'] text-xl leading-8 text-[#d7c8ad]/86 md:mt-7 md:text-2xl md:leading-9">
                  {isLoading
                    ? copy.loading
                    : order
                      ? copy.subtitle
                      : copy.emptyText}
                </p>

                <OrnamentDivider
                  className="mt-7 md:mt-9"
                  width={112}
                  opacity={0.65}
                />
              </div>

              {order && (
                <div className="mx-auto mt-9 max-w-4xl md:mt-12">
                  <div className="grid border-t border-[#6f5423]/70 md:grid-cols-2 md:divide-x md:divide-[#6f5423]/40">
                    <div className="border-b border-[#6f5423]/40 py-5 md:border-b-0 md:pr-10">
                      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                        {copy.order}
                      </p>

                      <p className="mt-1 font-['IM_Fell_English_SC'] text-3xl uppercase text-[#fff1d2]">
                        #{order.id}
                      </p>
                    </div>

                    <div className="py-5 md:pl-10">
                      <p className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                        {copy.status}
                      </p>

                      <p className="mt-1 font-['IM_Fell_English_SC'] text-2xl uppercase text-[#fff1d2] md:text-3xl">
                        {getStatusLabel(order.status, pageLanguage)}
                      </p>
                    </div>
                  </div>

                  <div className="grid border-y border-[#6f5423]/70 border-t-[#6f5423]/40 md:grid-cols-2 md:divide-x md:divide-[#6f5423]/40">
                    <div className="border-b border-[#6f5423]/40 py-5 md:border-b-0 md:pr-10">
                      <section>
                        <h2 className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                          {copy.customer}
                        </h2>

                        {hasCustomerInfo ? (
                          <div className="mt-2 space-y-1 font-['EB_Garamond'] text-lg leading-7 text-[#d7c8ad]/88 md:text-xl">
                            {recipient?.displayName && (
                              <p className="font-medium text-[#fff1d2]">
                                {recipient.displayName}
                              </p>
                            )}

                            {recipient?.email && (
                              <p className="text-[#d7c8ad]/70">
                                {recipient.email}
                              </p>
                            )}

                            {recipient?.phone && (
                              <p className="text-[#d7c8ad]/70">
                                {recipient.phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 font-['EB_Garamond'] text-lg text-[#d7c8ad]/60 md:text-xl">
                            {copy.noCustomer}
                          </p>
                        )}
                      </section>
                    </div>

                    <div className="py-5 md:pl-10">
                      <section>
                        <h2 className="font-['IM_Fell_English_SC'] text-sm uppercase tracking-[0.22em] text-[#c89b3c]">
                          {copy.shipping}
                        </h2>

                        {showShippingAddress ? (
                          <div className="mt-2 space-y-1 font-['EB_Garamond'] text-lg leading-7 text-[#d7c8ad]/88 md:text-xl">
                            {shippingAddress.line1 && (
                              <p>{shippingAddress.line1}</p>
                            )}

                            {shippingAddress.line2 && (
                              <p>{shippingAddress.line2}</p>
                            )}

                            {(shippingAddress.locality ||
                              shippingAddress.province) && (
                              <p>
                                {[
                                  shippingAddress.locality,
                                  shippingAddress.province,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}

                            {shippingAddress.postalCode && (
                              <p>{shippingAddress.postalCode}</p>
                            )}

                            {shippingAddress.country && (
                              <p>{shippingAddress.country}</p>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 font-['EB_Garamond'] text-lg text-[#d7c8ad]/60 md:text-xl">
                            {copy.noShipping}
                          </p>
                        )}
                      </section>
                    </div>
                  </div>

                  <section className="py-6 md:py-8">
                    <div className="space-y-6 md:space-y-7">
                      {(order.items || []).map((item, index) => (
                        <article
                          key={`${item.cartKey || item.name}-${index}`}
                          className="border-b border-[#6f5423]/55 pb-6 md:pb-7"
                        >
                          <div className="grid gap-4 md:grid-cols-2 md:gap-20">
                            <div>
                              <h3 className="font-['IM_Fell_English_SC'] text-2xl uppercase text-[#fff1d2] md:text-3xl">
                                {item.name}
                              </h3>

                              {item.colorName && (
                                <p className="mt-2 font-['EB_Garamond'] text-lg text-[#d7c8ad]/88 md:text-xl">
                                  {item.colorName}
                                </p>
                              )}

                              {Array.isArray(item.selectedItems) &&
                                item.selectedItems.length > 0 && (
                                  <p className="mt-3 max-w-2xl font-['EB_Garamond'] text-lg leading-7 text-[#d7c8ad]/88 md:text-xl">
                                    {copy.selectedItems} :{" "}
                                    {item.selectedItems
                                      .map((selectedItem) => selectedItem.name)
                                      .join(", ")}
                                  </p>
                                )}

                              <p className="mt-3 font-['EB_Garamond'] text-lg text-[#d7c8ad]/88 md:text-xl">
                                {copy.quantity} : {item.quantity}
                              </p>
                            </div>

                            <p className="font-['IM_Fell_English_SC'] text-2xl uppercase text-[#c89b3c] md:text-right">
                              {formatMoney(
                                item.totalPriceCents,
                                order.totals.currency,
                                pageLanguage
                              )}
                            </p>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="mt-7 border-t border-[#6f5423]/70 pt-5 md:mt-8 md:pt-6">
                      <div className="grid md:grid-cols-2 md:gap-20">
                        <div />

                        <div className="space-y-3 font-['EB_Garamond'] text-lg text-[#d7c8ad]/88 md:text-xl">
                          <div className="grid grid-cols-[1fr_auto] gap-6 md:gap-8">
                            <span>{copy.subtotal}</span>
                            <span>
                              {formatMoney(
                                order.totals.subtotalCents,
                                order.totals.currency,
                                pageLanguage
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-[1fr_auto] gap-6 md:gap-8">
                            <span>{copy.taxes}</span>
                            <span>
                              {formatMoney(
                                order.totals.taxCents,
                                order.totals.currency,
                                pageLanguage
                              )}
                            </span>
                          </div>

                          <div className="grid grid-cols-[1fr_auto] gap-6 border-t border-[#6f5423]/70 pt-4 font-['IM_Fell_English_SC'] text-2xl uppercase text-[#fff1d2] md:gap-8 md:text-3xl">
                            <span>{copy.total}</span>
                            <span>
                              {formatMoney(
                                order.totals.totalCents,
                                order.totals.currency,
                                pageLanguage
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              <div className="mx-auto mt-10 flex max-w-4xl justify-center pb-2 pt-2 md:mt-16 md:pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center border border-[#c89b3c] bg-[#8b5e1a] px-6 py-4 font-['IM_Fell_English_SC'] text-xs uppercase tracking-[0.08em] text-[#f8edd3] shadow-[0_0_24px_rgba(0,0,0,0.45)] transition hover:bg-[#d4a64a] hover:text-[#120904] md:px-7 md:text-sm"
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