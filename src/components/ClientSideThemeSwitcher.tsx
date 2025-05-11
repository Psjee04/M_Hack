'use client';

import { useState, useEffect } from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function ClientSideThemeSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return <ThemeSwitcher />;
} 