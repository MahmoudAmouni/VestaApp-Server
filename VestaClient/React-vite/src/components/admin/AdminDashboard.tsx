import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { AdminNavbar } from './AdminNavbar';
import styles from './AdminDashboard.module.css';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adminId = localStorage.getItem('vesta_admin_id');
    
    fetch('http://localhost:8080/users', {
      headers: {
        'X-User-ID': adminId || ''
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Make sure the Go backend is running.');
        setLoading(false);
      });
  }, []);

  const handleViewUser = (userId: number) => {
    navigate(`/admin/${userId}`);
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
          <p>Manage your VestaApp data</p>
        </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Users Management</h2>
          </div>
          <div className={styles.tableContainer}>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className={styles.actions}>
                        <button 
                          className={styles.actionBtn} 
                          title="View"
                          onClick={() => handleViewUser(user.id)}
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

