import { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher'; // Assuming ThemeSwitcher is the default export

export default function ClientSideThemeSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Or a placeholder if you prefer, to avoid layout shifts
  }

  return <ThemeSwitcher />;
} 