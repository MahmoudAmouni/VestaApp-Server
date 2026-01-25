import { ChefHat, Zap, Calendar, Bot, ClipboardList, Rocket } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import styles from './Hero.module.css';

export function Hero() {

  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <section className={styles.hero}>
      <div className={styles.bgGlow} />
      
      <div className="section-container">
        <div className={styles.content}>
          <h1>
            Your Home, <br />
            <span className={styles.gradientText}>Intelligently Unified</span>
          </h1>
          
          <p className={styles.subtitle}>
            VestaApp connects your pantry, recipes, and smart devices into a single
            intelligent interface powered by AI.
          </p>
          
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => document.getElementById('download')?.scrollIntoView({behavior: 'smooth'})}>
              Download App
            </Button>
            <Button variant="secondary" onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})}>
              View Features
            </Button>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <div className={styles.vestaContainer}>
            <img src="/assets/vestadesk.png" alt="Vesta Chef" className={styles.vestaDesk} />
            <div className={styles.vestaTooltip}>Hi, I am Vesta! 👋</div>
          </div>
          <div className={styles.bentoGrid}>
            
            <div className={`${styles.card} ${styles.cardRecipes}`}>
              <span className={styles.icon}><ChefHat /></span>
              <div>
                <div className={styles.title}>Smart Database</div>
                <div className={styles.value}>80,000+ Recipes</div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardAssistant}`}>
              <div className={styles.assistantVisual}></div>
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <div className={styles.title}>Voice Assistant</div>
                <div className={styles.value}>Active</div>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.icon}><Zap /></span>
              <div className={styles.title}>IoT Control</div>
              <div className={styles.value}>Connected</div>
            </div>

            <div className={styles.card}>
              <span className={styles.icon}><Calendar /></span>
              <div className={styles.title}>Expiry Tracker</div>
              <div className={styles.value}>On Guard</div>
            </div>

            <div className={styles.card}>
              <span className={styles.icon}><Bot /></span>
              <div className={styles.title}>AI Chat Bot</div>
              <div className={styles.value}>Context Aware</div>
            </div>

             <div className={styles.card}>
              <span className={styles.icon}><ClipboardList /></span>
              <div className={styles.title}>Shopping List</div>
              <div className={styles.value}>Auto-Sync</div>
            </div>

            <div className={`${styles.card} ${styles.cardTheme}`} onClick={toggleTheme} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className={styles.themeToggleVisual}></div>
                <div>
                   <div className={styles.title}>{isDarkMode ? 'Dark' : 'Light'} Mode</div>
                </div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardChef}`}>
              <span className={styles.icon}><ChefHat /></span>
              <div>
                <div className={styles.title}>Chef Assistant</div>
                <div className={styles.value}>Cooking Mode Active</div>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardUpdates}`}>
               <span className={styles.icon}><Rocket /></span>
               <div>
                  <div className={styles.title}>System Updates</div>
                  <div className={styles.value}>New Features Added Daily</div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

