import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Download } from './components/sections/Download';
import { Screenshots } from './components/sections/Screenshots';
import { AiAssistant } from './components/sections/AiAssistant';
import styles from './App.module.css';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <main className={styles.main}>
        <Navbar />
        <Hero />
        <Features />
        <AiAssistant />
        <Screenshots />
        <Download />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
