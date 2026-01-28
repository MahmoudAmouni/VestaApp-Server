import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import styles from './Navbar.module.css';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="#" className={styles.logo}>
          <img src="/assets/logo.png" alt="Vesta Logo" height="50" />
          Vesta<span>App</span>
        </a>

        <button 
          className={styles.mobileToggle}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>

        <div className={`${styles.links} ${isMobileOpen ? styles.open : ''}`}>
          <a href="#features" className={styles.link} onClick={() => setIsMobileOpen(false)}>Features</a>
          <a href="#ai-assistant" className={styles.link} onClick={() => setIsMobileOpen(false)}>AI Assistant</a>
          <a href="#download" className={styles.link} onClick={() => setIsMobileOpen(false)}>Download</a>
          <div className={styles.cta}>
             <Button variant="primary" onClick={() => document.getElementById('download')?.scrollIntoView({behavior: 'smooth'})}>
                Get Vesta
             </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
