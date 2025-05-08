import '../styles/globals.css';
import { RideProvider } from '../contexts/RideContext';
import { ThemeProvider } from 'next-themes';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RideProvider>
        <Component {...pageProps} />
      </RideProvider>
    </ThemeProvider>
  );
}
