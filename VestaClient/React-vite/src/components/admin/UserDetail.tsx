import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, ChefHat, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { AdminNavbar } from './AdminNavbar';
import styles from './UserDetail.module.css';

interface PantryItem {
  id: number;
  item_name: { name: string };
  quantity: number;
  unit?: { abbreviation: string };
  expiry_date?: string;
  deleted_at?: string;
}

interface SavedRecipe {
  id: number;
  recipe_name: string;
  ingredients: string;
  directions: string;
}

interface Device {
  id: number;
  device_name: { name: string };
  is_on: number;
}

interface Home {
  id: number;
  devices: Device[];
  saved_recipes: SavedRecipe[];
}

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  pantry_items: PantryItem[];
  owned_homes: Home[];
}

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    const adminId = localStorage.getItem('vesta_admin_id');

    fetch(`http://localhost:8080/users/${id}`, {
      headers: {
        'X-User-ID': adminId || ''
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('User not found');
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load user details');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>User not found</h2>
          <Button variant="primary" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} /> Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  const activePantryItems = user.pantry_items?.filter(item => !item.deleted_at) || [];
  const allDevices = user.owned_homes?.flatMap(h => h.devices) || [];
  const allRecipes = user.owned_homes?.flatMap(h => h.saved_recipes) || [];

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <Button variant="secondary" onClick={() => navigate('/admin')}>
            <ArrowLeft size={18} /> Back to Admin
          </Button>
          <div className={styles.headerInfo}>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p className={styles.memberSince}>
              Member since: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2><Package size={24} /> Pantry Items ({activePantryItems.length})</h2>
          {activePantryItems.length > 0 ? (
            <div className={styles.itemsGrid}>
              {activePantryItems.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <h3>{item.item_name?.name || 'Unknown Item'}</h3>
                  <p>{item.quantity} {item.unit?.abbreviation || 'units'}</p>
                  {item.expiry_date && <p className={styles.expiry}>Expires: {item.expiry_date}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No pantry items</p>
          )}
        </div>

        <div className={styles.section}>
          <h2><ChefHat size={24} /> Saved Recipes ({allRecipes.length})</h2>
          {allRecipes.length > 0 ? (
            <div className={styles.itemsGrid}>
              {allRecipes.map((recipe) => (
                <div key={recipe.id} className={styles.itemCard}>
                  <h3>{recipe.recipe_name}</h3>
                </div>
              ))}
            </div>
          ) : (
             <p className={styles.emptyState}>No saved recipes</p>
          )}
        </div>

        <div className={styles.section}>
          <h2><Zap size={24} /> Devices ({allDevices.length})</h2>
          {allDevices.length > 0 ? (
            <div className={styles.itemsGrid}>
              {allDevices.map((device) => (
                <div key={device.id} className={styles.itemCard}>
                  <h3>{device.device_name?.name || 'Unknown Device'}</h3>
                  <span className={`${styles.status} ${device.is_on ? styles.statusOn : styles.statusOff}`}>
                    {device.is_on ? 'On' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No devices</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
