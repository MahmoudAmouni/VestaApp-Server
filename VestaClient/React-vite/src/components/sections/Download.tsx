import { Section } from '../ui/Section';
import styles from './Download.module.css';
import { useTheme } from '../../context/ThemeContext';

export function Download() {
  const { isDarkMode } = useTheme();

  return (
    <Section id="download" className={styles.downloadSection}>
      <div className={styles.downloadContent}>
        <div className={styles.downloadInfo}>
          <h2>Get VestaApp Today</h2>
          <p>
            Start transforming your home into an intelligent ecosystem. 
            Available now on Android.
          </p>
          
          <div className={styles.storeButtons}>
            <a href="#" className={styles.storeBtn}>
               <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                 <path d="M3.609 1.814L13.792 12 3.61 22.186a1.006 1.006 0 0 1-1.61-.83V2.644c0-.78.85-1.26 1.609-.83z"/>
                 <path d="M13.792 12L3.609 1.814 17.65 9.94c.85.5 1.45 1.34 1.45 2.31 0 .97-.6 1.81-1.45 2.31l-14.04 8.126L13.792 12z" opacity=".4"/>
               </svg> 
               <span style={{ marginLeft: '8px' }}>Google Play</span>
            </a>
          </div>
        </div>
        
        <div className={styles.downloadImage}>
           <img 
              src={isDarkMode ? "/assets/welcome.png" : "/assets/welcomelight.png"}
              alt="VestaApp Mobile Interface" 
              onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/300x600/15151B/E7523C?text=Mobile+App';
              }}
           />
        </div>
      </div>
    </Section>
  );
};
