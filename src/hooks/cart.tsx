import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import repository from '../repository/Product';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const items = await repository.index();
      if (items) {
        setProducts([...JSON.parse(items)]);
      }
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const updatedProducts = products.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      );
      setProducts(updatedProducts);
      repository.update(JSON.stringify(updatedProducts));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const updatedProducts = products.map(p =>
        p.id === id && p.quantity > 0 ? { ...p, quantity: p.quantity - 1 } : p,
      );
      setProducts(updatedProducts);
      repository.update(JSON.stringify(updatedProducts));
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const foundProduct = products.find(p => p.id === product.id);

      if (foundProduct) {
        increment(product.id);
      } else {
        const updatedProducts = [{ ...product, quantity: 1 }, ...products];
        setProducts(updatedProducts);
        repository.update(JSON.stringify(updatedProducts));
      }
    },
    [increment, products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
