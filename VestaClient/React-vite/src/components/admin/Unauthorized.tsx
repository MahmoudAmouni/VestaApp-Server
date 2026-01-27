import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import styles from './Unauthorized.module.css';
import { ShieldAlert } from 'lucide-react';

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <ShieldAlert className={styles.icon} size={48} />
        </div>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
        <div className={styles.actions}>
          <Button variant="primary" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
