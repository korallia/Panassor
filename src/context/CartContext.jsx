import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "panassor_cart_v1";

function getStoredCartItems() {
  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function normalizeAddQuantity(quantity) {
  const parsedQuantity = Number(quantity);

  if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
    return 1;
  }

  return Math.floor(parsedQuantity);
}

function sortSelectedItems(selectedItems = []) {
  return [...selectedItems].sort(
    (a, b) => Number(a.productId) - Number(b.productId)
  );
}

function buildSelectedItemsKey(selectedItems = []) {
  return sortSelectedItems(selectedItems)
    .map((item) => item.productId)
    .join("-");
}

function buildCartKey(item) {
  const selectedItemsKey = buildSelectedItemsKey(item.selectedItems);

  return [
    item.type || "product",
    item.productId,
    item.colorKey || "no-color",
    item.optionId ?? "no-option",
    selectedItemsKey || "no-selected-items",
  ].join("__");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [selectedShipping, setSelectedShipping] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const addItem = (item) => {
    const normalizedItem = {
      ...item,
      quantity: normalizeAddQuantity(item.quantity),
      selectedItems: sortSelectedItems(item.selectedItems || []),
    };

    const cartKey = buildCartKey(normalizedItem);

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.cartKey === cartKey
      );

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.cartKey === cartKey
            ? {
                ...currentItem,
                quantity:
                  normalizeAddQuantity(currentItem.quantity) +
                  normalizedItem.quantity,
              }
            : currentItem
        );
      }

      return [
        ...currentItems,
        {
          ...normalizedItem,
          cartKey,
        },
      ];
    });

    openCart();
  };

  const updateQuantity = (cartKey, quantity) => {
    const parsedQuantity = Number(quantity);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      removeItem(cartKey);
      return;
    }

    const normalizedQuantity = Math.floor(parsedQuantity);

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartKey === cartKey
          ? {
              ...item,
              quantity: normalizedQuantity,
            }
          : item
      )
    );
  };

  const removeItem = (cartKey) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.cartKey !== cartKey)
    );
  };

const clearCart = () => {
  setItems([]);
  setOrderNote("");
  setSelectedShipping(null);

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // ignore localStorage errors
  }
};
  const subtotalCents = items.reduce((total, item) => {
    return (
      total +
      (item.displaySnapshot?.priceCents || 0) *
        normalizeAddQuantity(item.quantity)
    );
  }, 0);

  const itemCount = items.reduce((total, item) => {
    return total + normalizeAddQuantity(item.quantity);
  }, 0);

  const shippingCents = selectedShipping?.priceCents || 0;
  const estimatedTotalCents = subtotalCents + shippingCents;

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotalCents,

      orderNote,
      setOrderNote,

      selectedShipping,
      setSelectedShipping,
      shippingCents,
      estimatedTotalCents,

      isCartOpen,
      openCart,
      closeCart,

      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      itemCount,
      subtotalCents,
      orderNote,
      selectedShipping,
      shippingCents,
      estimatedTotalCents,
      isCartOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}