import React from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
