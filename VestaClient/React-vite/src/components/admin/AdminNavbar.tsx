import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './AdminNavbar.module.css';

export function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <a href="/admin" className={styles.logo} onClick={(e) => { e.preventDefault(); navigate('/admin'); }}>
        <img src="/assets/logo.png" alt="Vesta Logo" />
        Vesta<span>Admin</span>
      </a>

      <div className={styles.userMenu}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}
