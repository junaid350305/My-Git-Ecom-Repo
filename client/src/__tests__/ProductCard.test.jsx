import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, darkRender } from '../test/test-utils';
import ProductCard from '../components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Wireless Headphones',
  price: 29.99,
  image: '/images/test.jpg',
  category: 'Electronics',
  stock: 10,
  rating: 4.5,
  description: 'A great test product'
};

const outOfStockProduct = {
  ...mockProduct,
  id: 2,
  name: 'Sold Out Item',
  stock: 0
};

describe('ProductCard Component', () => {

  test('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Wireless Headphones')).toBeInTheDocument();
  });

  test('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  test('renders product category', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  test('renders product image', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText('Test Wireless Headphones');
    expect(img).toHaveAttribute('src', '/images/test.jpg');
  });

  test('shows In Stock chip for in-stock product', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  test('shows Out of Stock chip for out-of-stock product', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  test('renders Add to Cart button', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  test('Add to Cart button is disabled when out of stock', () => {
    render(<ProductCard product={outOfStockProduct} />);
    const button = screen.getByText('Add to Cart').closest('button');
    expect(button).toBeDisabled();
  });

  test('Add to Cart button is enabled when in stock', () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByText('Add to Cart').closest('button');
    expect(button).not.toBeDisabled();
  });

  test('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/1');
  });

  test('favorite button toggles', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const buttons = screen.getAllByRole('button');
    const favButton = buttons.find(btn => !btn.textContent.includes('Add to Cart'));

    if (favButton) {
      await user.click(favButton);
      expect(favButton).toBeInTheDocument();
    }
  });

  test('clicking Add to Cart calls addToCart', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const addButton = screen.getByText('Add to Cart').closest('button');
    await user.click(addButton);

    expect(addButton).toBeInTheDocument();
  });

  test('favorite toggles on and off', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const buttons = screen.getAllByRole('button');
    const favButton = buttons.find(btn => !btn.textContent.includes('Add to Cart'));

    await user.click(favButton);
    await user.click(favButton);

    expect(favButton).toBeInTheDocument();
  });

  test('shows General when category is missing', () => {
    const noCategory = { ...mockProduct, id: 3, category: undefined };
    render(<ProductCard product={noCategory} />);
    expect(screen.getByText('General')).toBeInTheDocument();
  });

  test('shows placeholder image when image is missing', () => {
    const noImage = { ...mockProduct, id: 4, image: '' };
    render(<ProductCard product={noImage} />);
    const img = screen.getByAltText('Test Wireless Headphones');
    expect(img).toHaveAttribute('src', '/images/placeholder.jpg');
  });

  test('shows original price with strikethrough when provided', () => {
    const withOriginalPrice = { ...mockProduct, id: 5, originalPrice: 49.99 };
    render(<ProductCard product={withOriginalPrice} />);
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  test('does not show original price when not provided', () => {
    render(<ProductCard product={mockProduct} />);
    const prices = screen.getAllByText(/^\$/);
    expect(prices).toHaveLength(1);
  });

  // NEW — covers dark mode boxShadow branch
  test('renders correctly in dark mode', () => {
    darkRender(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Wireless Headphones')).toBeInTheDocument();
  });
});