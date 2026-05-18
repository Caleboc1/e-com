'use client';

import { useEffect, useState } from 'react';
import styles from './CartDrawer.module.css';

/* ============================================================
   MOCK CART ITEMS
   In production this would come from a cart context/store.
   ============================================================ */
const MOCK_ITEMS = [
  {
    id: 'ci-001',
    productId: 'p002',
    name: 'Adire Slip Dress',
    colour: 'Burnt Earth',
    size: 'S',
    price: 42000,
    quantity: 1,
    swatch: { background: '#8B3A2A' },
    pattern: 'hex',
  },
  {
    id: 'ci-002',
    productId: 'p001',
    name: 'The Oyinkan Tee',
    colour: 'Natural',
    size: 'M',
    price: 18500,
    quantity: 2,
    swatch: {
      background: 'linear-gradient(160deg, #DDD4C4 0%, #BEB3A0 100%)',
    },
    pattern: null,
  },
];

/* ============================================================
   CART DRAWER
   - Slides in from the right
   - Backdrop dims the page and closes on click
   - ESC key closes the drawer
   - Body scroll is locked while open
   ============================================================ */
export default function CartDrawer({ isOpen, onClose, items = MOCK_ITEMS }) {
  const [cartItems, setCartItems] = useState(items);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (n) => `₦${n.toLocaleString('en-NG')}`;

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Your Bag</h2>
            <span className={styles.itemCount}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close bag"
          >
            ×
          </button>
        </header>

        {/* ITEMS */}
        <div className={styles.body}>
          {cartItems.length === 0 ? (
            <div className={styles.empty}>
              <p>Your bag is empty.</p>
              <button
                type="button"
                className={styles.continueBtn}
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className={styles.items}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemImage} style={item.swatch}>
                    {item.pattern && (
                      <AdirePattern variant={item.pattern} opacity={0.35} />
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        Remove
                      </button>
                    </div>

                    <div className={styles.itemMeta}>
                      <span>{item.colour}</span>
                      <span aria-hidden="true">·</span>
                      <span>Size {item.size}</span>
                    </div>

                    <div className={styles.itemFooter}>
                      <div className={styles.qtyControl}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalAmount}>
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className={styles.shippingNote}>
              {subtotal >= 150000
                ? 'You qualify for free shipping.'
                : `Add ${formatPrice(150000 - subtotal)} for free shipping.`}
            </p>
            <button type="button" className={styles.checkoutBtn}>
              Checkout
            </button>
            <button
              type="button"
              className={styles.viewBagBtn}
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}

/* ============================================================
   ADIRE PATTERN — shared SVG
   ============================================================ */
function AdirePattern({ variant = 'circle', opacity = 0.35 }) {
  const id = `adire-${variant}-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
      }}
      viewBox="0 0 100 130"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {variant === 'circle' && (
          <pattern id={id} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="8" fill="none" stroke="white" strokeWidth="0.9" />
            <circle cx="11" cy="11" r="3" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="11" cy="11" r="1" fill="white" />
          </pattern>
        )}
        {variant === 'hex' && (
          <pattern id={id} x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <polygon points="9,1 17,5 17,13 9,17 1,13 1,5" fill="none" stroke="white" strokeWidth="0.9" />
            <circle cx="9" cy="9" r="2" fill="white" opacity="0.5" />
          </pattern>
        )}
        {variant === 'grid' && (
          <pattern id={id} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect x="2" y="2" width="12" height="12" fill="none" stroke="white" strokeWidth="0.7" />
            <rect x="6" y="6" width="4" height="4" fill="white" opacity="0.4" />
          </pattern>
        )}
      </defs>
      <rect width="100" height="130" fill={`url(#${id})`} />
    </svg>
  );
}
