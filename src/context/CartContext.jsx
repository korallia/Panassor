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

function sortSelectedItems(selectedItems = []) {
  return [...selectedItems].sort((a, b) => Number(a.productId) - Number(b.productId));
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
    selectedItemsKey || "no-selected-items",
  ].join("__");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getStoredCartItems);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");

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
      quantity: item.quantity || 1,
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
                quantity: currentItem.quantity + normalizedItem.quantity,
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
    if (quantity <= 0) {
      removeItem(cartKey);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.cartKey === cartKey ? { ...item, quantity } : item
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
  };

  const subtotalCents = items.reduce((total, item) => {
    return total + (item.displaySnapshot?.priceCents || 0) * item.quantity;
  }, 0);

  const itemCount = items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotalCents,

      orderNote,
      setOrderNote,

      isCartOpen,
      openCart,
      closeCart,

      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, itemCount, subtotalCents, orderNote, isCartOpen]
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