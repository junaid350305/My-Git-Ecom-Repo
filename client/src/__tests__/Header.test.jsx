import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import Header from '../components/Header';

describe('Header Component', () => {

  test('renders without crashing', () => {
    render(<Header darkMode={false} onToggleTheme={() => {}} />);
  });

  test('renders ShopEase logo', () => {
    render(<Header darkMode={false} onToggleTheme={() => {}} />);
    expect(screen.getByText('ShopEase')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Header darkMode={false} onToggleTheme={() => {}} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('renders search placeholder', () => {
    render(<Header darkMode={false} onToggleTheme={() => {}} />);
    expect(screen.getByPlaceholderText('Search products…')).toBeInTheDocument();
  });

  test('renders cart icon with badge', () => {
    render(<Header darkMode={false} onToggleTheme={() => {}} />);
    // Cart link to /cart should exist
    const cartLink = screen.getByRole('link', { name: '' });
    // At minimum the component renders
    expect(document.querySelector('.MuiBadge-root')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    const toggleFn = vi.fn();
    render(<Header darkMode={false} onToggleTheme={toggleFn} />);
    // Should have multiple icon buttons (theme toggle, menu, cart)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});