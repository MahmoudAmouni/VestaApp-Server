import { Section } from '../ui/Section';
import { useTheme } from '../../context/ThemeContext';
import styles from './Screenshots.module.css';

export function Screenshots() {
  const { isDarkMode } = useTheme();

  return (
    <Section 
      id="screenshots" 
      title="Experience Vesta" 
      subtitle="A beautiful, intuitive interface designed for efficiency."
      className={styles.section}
    >
      <div className={styles.grid}>
        <div className="screenshot-item">
          <div className={styles.card}>
            <img 
              src={isDarkMode ? "/assets/pantry.png" : "/assets/pantry_light.png"} 
              alt="Smart Pantry Management" 
            />
          </div>
          <p className={styles.caption}>Smart Pantry</p>
        </div>
        
        <div className="screenshot-item">
          <div className={styles.card}>
            <img 
              src={isDarkMode ? "/assets/shopping.png" : "/assets/shopping_light.png"} 
              alt="Intelligent Shopping List" 
            />
          </div>
          <p className={styles.caption}>Shopping Lists</p>
        </div>
        
        <div className="screenshot-item">
          <div className={styles.card}>
            <img 
              src={isDarkMode ? "/assets/recipes.png" : "/assets/rooms_light.png"} 
              alt="AI Recipe Suggestions" 
            />
          </div>
          <p className={styles.caption}>{isDarkMode ? "AI Recipes" : "Room Control"}</p>
        </div>
      </div>
    </Section>
  );
}
