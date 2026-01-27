import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Download } from './components/sections/Download';
import { Screenshots } from './components/sections/Screenshots';
import { AiAssistant } from './components/sections/AiAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDetail } from './components/admin/UserDetail';
import { Login } from './components/admin/Login';
import { Unauthorized } from './components/admin/Unauthorized';
import styles from './App.module.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function LandingPage() {
  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      <Features />
      <AiAssistant />
      <Screenshots />
      <Download />
      <Footer />
    </main>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/:id" 
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
