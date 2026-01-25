import { Mic, MessageSquare, Home } from 'lucide-react';
import { Section } from '../ui/Section';
import styles from './AiAssistant.module.css';

export function AiAssistant() {
  return (
    <Section id="ai-assistant" className={styles.section}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2 className={styles.title}>Meet Vesta. <br />Your Intelligent Home Companion.</h2>
          <p className={styles.description}>
            Vesta isn't just a chatbot. She's a fully integrated agent that understands your home. 
            From managing your pantry inventory to suggesting recipes based on expiration dates, 
            Vesta handles the cognitive load of home management.
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.icon}><Mic /></span>
              <span>"Vesta, what can I cook with the chicken expiring soon?"</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.icon}><MessageSquare /></span>
              <span>"Add milk and eggs to my shopping list."</span>
            </div>
             <div className={styles.featureItem}>
              <span className={styles.icon}><Home /></span>
              <span>"Turn off the kitchen lights."</span>
            </div>
          </div>
        </div>

        <div className={styles.imageContainer}>
          <img 
            src="/assets/vesta.png" 
            alt="Vesta AI Assistant Avatar" 
            className={styles.image}
          />
        </div>
      </div>
    </Section>
  );
}
