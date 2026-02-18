import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { CartProvider } from '../context/CartContext';

const theme = createTheme();
const darkTheme = createTheme({ palette: { mode: 'dark' } });

const AllProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const DarkProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

const darkRender = (ui, options) =>
  render(ui, { wrapper: DarkProviders, ...options });

export * from '@testing-library/react';
export { customRender as render, darkRender };