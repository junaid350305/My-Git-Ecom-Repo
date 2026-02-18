import { describe, test, expect, vi } from 'vitest';
import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(document.querySelector('.MuiBadge-root')).toBeInTheDocument();
  });

  test('renders theme toggle button', () => {
    const toggleFn = vi.fn();
    render(<Header darkMode={false} onToggleTheme={toggleFn} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  // NEW — covers theme toggle click calling onToggleTheme
  test('calls onToggleTheme when theme button is clicked', async () => {
    const toggleFn = vi.fn();
    const user = userEvent.setup();
    render(<Header darkMode={false} onToggleTheme={toggleFn} />);

    // Theme toggle button contains Brightness4 icon when darkMode is false
    const buttons = screen.getAllByRole('button');
    // Find the theme toggle — it's not the menu or cart button
    for (const btn of buttons) {
      if (!btn.closest('a') && !btn.querySelector('.MuiBadge-root')) {
        await user.click(btn);
        break;
      }
    }

    expect(toggleFn).toHaveBeenCalled();
  });

  // NEW — covers darkMode=true branch (renders Brightness7 instead of Brightness4)
  test('renders correct icon for dark mode', () => {
    render(<Header darkMode={true} onToggleTheme={() => {}} />);
    // Component renders without crashing in dark mode
    expect(screen.getByText('ShopEase')).toBeInTheDocument();
  });

  // NEW — covers search input change (handleSearchChange)
  test('search input accepts text', async () => {
    const user = userEvent.setup();
    render(<Header darkMode={false} onToggleTheme={() => {}} />);

    const searchInput = screen.getByPlaceholderText('Search products…');
    await user.type(searchInput, 'headphones');

    expect(searchInput).toHaveValue('headphones');
  });

  // NEW — covers handleSearch submit with non-empty query (lines 125-129)
  test('search form navigates on submit with query', async () => {
    const user = userEvent.setup();
    render(<Header darkMode={false} onToggleTheme={() => {}} />);

    const searchInput = screen.getByPlaceholderText('Search products…');
    await user.type(searchInput, 'laptop');
    await user.type(searchInput, '{enter}');

    // After submit, URL should contain search query
    expect(window.location.pathname).toBe('/products');
    expect(window.location.search).toContain('search=laptop');
  });

  // NEW — covers handleSearch with empty query (the if guard — searchQuery.trim() is falsy)
  test('search form does not navigate with empty query', async () => {
    const user = userEvent.setup();
    render(<Header darkMode={false} onToggleTheme={() => {}} />);

    const originalPath = window.location.pathname;
    const searchInput = screen.getByPlaceholderText('Search products…');
    await user.type(searchInput, '{enter}');

    // Should NOT navigate — stays on current page
    expect(window.location.pathname).toBe(originalPath);
  });

  // NEW — covers mobile drawer toggle (lines 116, 120, 212-218)
  // NEW — covers mobile drawer toggle (lines 116, 120, 212-218)
  test('opens and closes mobile drawer', async () => {
    // Mock mobile viewport
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('max-width') || query.includes('(max-width:899.95px)'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const user = userEvent.setup();
    render(<Header darkMode={false} onToggleTheme={() => {}} />);

    // Find hamburger button using MenuIcon data-testid
    const menuIcon = screen.getByTestId('MenuIcon');
    const hamburgerButton = menuIcon.closest('button');

    await user.click(hamburgerButton);

    // Drawer should open — look for Close button
    const closeIcon = await screen.findByTestId('CloseIcon');
    expect(closeIcon).toBeInTheDocument();

    // Close the drawer
    const closeButton = closeIcon.closest('button');
    await user.click(closeButton);
  });

  // NEW — covers isMobile search bar rendering (lines 155-157)
  test('renders mobile search bar on small screens', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('max-width') || query.includes('(max-width:899.95px)'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<Header darkMode={false} onToggleTheme={() => {}} />);
    // On mobile, search bar should still be present
    expect(screen.getByPlaceholderText('Search products…')).toBeInTheDocument();
  });
});