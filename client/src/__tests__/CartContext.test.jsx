import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../context/CartContext';

const wrapper = ({ children }) => (
  <BrowserRouter>
    <CartProvider>{children}</CartProvider>
  </BrowserRouter>
);

const mockProduct = {
  id: 1,
  name: 'Test Product',
  price: 29.99,
  image: '/images/test.jpg'
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('CartContext', () => {

  test('starts with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cart).toEqual([]);
  });

  test('addToCart adds a new item with quantity 1', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].name).toBe('Test Product');
    expect(result.current.cart[0].quantity).toBe(1);
  });

  test('addToCart increments quantity for duplicate item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(2);
  });

  test('removeFromCart removes an item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.removeFromCart(mockProduct.id);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test('updateQuantity changes item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  test('clearCart empties the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2, name: 'Product 2' });
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });

  test('cart persists to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const stored = JSON.parse(window.localStorage.getItem('cart'));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Test Product');
  });

  test('loads cart from localStorage on mount', () => {
    const savedCart = [{ id: 1, name: 'Saved Product', price: 10, quantity: 3 }];
    window.localStorage.setItem('cart', JSON.stringify(savedCart));

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].name).toBe('Saved Product');
    expect(result.current.cart[0].quantity).toBe(3);
  });

  test('updateQuantity does not affect other items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2, name: 'Other Product' });
    });
    act(() => {
      result.current.updateQuantity(1, 10);
    });

    expect(result.current.cart[0].quantity).toBe(10);
    expect(result.current.cart[1].quantity).toBe(1);
  });

  test('removeFromCart with non-existent id does nothing', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });
    act(() => {
      result.current.removeFromCart(999);
    });

    expect(result.current.cart).toHaveLength(1);
  });

  test('handles non-array localStorage data gracefully', () => {
    window.localStorage.setItem('cart', JSON.stringify({ not: 'an array' }));

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toEqual([]);
  });

  // NEW — covers the non-matching item branch in addToCart map (line 25)
  test('addToCart increments quantity without affecting other items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.addToCart({ ...mockProduct, id: 2, name: 'Other Product' });
    });
    act(() => {
      // Add mockProduct again — map will match id:1, skip id:2
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart).toHaveLength(2);
    expect(result.current.cart[0].quantity).toBe(2);
    expect(result.current.cart[1].quantity).toBe(1);
  });
});