import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      isDrawerOpen: false,
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      // --- ADD TO CART (Updated to handle custom quantities) ---
      addToCart: (product) => set((state) => {
        const isItemInCart = state.cart.find((item) => item._id === product._id);
        
        // Normalize the image path (Keeping your logic)
        const productImage = Array.isArray(product.images) ? product.images[0] : (product.image || product.images);

        // Get the quantity to add (default to 1 if not specified)
        const quantityToAdd = product.qty || 1;

        if (isItemInCart) {
          return {
            cart: state.cart.map((item) =>
              item._id === product._id 
                ? { ...item, qty: (item.qty || 1) + quantityToAdd } 
                : item
            ),
            isDrawerOpen: true 
          };
        }

        // Add new item with normalized image and the selected quantity
        return { 
          cart: [...state.cart, { ...product, image: productImage, qty: quantityToAdd }],
          isDrawerOpen: true 
        };
      }),

      // --- NEW: UPDATE QUANTITY (Used for +/- buttons in Drawer) ---
      updateQty: (productId, newQty) => set((state) => ({
        cart: state.cart.map((item) => 
          item._id === productId 
            ? { ...item, qty: Math.max(1, newQty) } 
            : item
        )
      })),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
      })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: 'sporsho-cart-storage' }
  )
);