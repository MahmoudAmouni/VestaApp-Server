import { Bot, Zap, Apple, ChefHat, Brain, Smartphone } from 'lucide-react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import styles from './Features.module.css';

const featuresList = [
  {
    title: "AI Assistant Vesta",
    description: "Your personal voice-activated assistant. Control devices and manage your home with natural conversation.",
    icon: <Bot />
  },
  {
    title: "IoT Control",
    description: "Direct control of ESP32 hardware. Monitor inventory levels and control appliances from anywhere.",
    icon: <Zap />
  },
  {
    title: "Smart Pantry",
    description: "Track your ingredients automatically. Get notified when you're running low on essentials.",
    icon: <Apple />
  },
  {
    title: "Intelligent Recipes",
    description: "Get personalized recipe suggestions based on what you actually have in your pantry.",
    icon: <ChefHat />
  },
  {
    title: "RAG Memory",
    description: "Vesta remembers your preferences and history to provide context-aware assistance.",
    icon: <Brain />
  },
  {
    title: "Cross-Platform",
    description: "Seamlessly synced across all your devices. Manage your home from your phone or tablet.",
    icon: <Smartphone />
  }
];

export function Features() {
  return (
    <Section 
      id="features" 
      title="Powerful Features" 
      subtitle="Everything you need to manage your modern smart home in one application."
    >
      <div className={styles.grid}>
        {featuresList.map((feature, index) => (
          <Card key={index} title={feature.title}>
            <div className={styles.icon}>{feature.icon}</div>
            <p>{feature.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
