import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>Vesta App</h3>
            <p>Your intelligent home assistant. Manage inventory, control devices, and simplify your life with AI.</p>
          </div>
          
          <div className={styles.column}>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#ai">AI Assistant</a></li>
              <li><a href="#download">Download</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.column}>
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} VestaApp. All rights reserved.</p>
          <p>Designed for Smart Homes</p>
        </div>
      </div>
    </footer>
  );
}
