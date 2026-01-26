import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Features } from './components/sections/Features';
import { Download } from './components/sections/Download';
import { Screenshots } from './components/sections/Screenshots';
import { AiAssistant } from './components/sections/AiAssistant';
// import { AdminDashboard } from './components/admin/AdminDashboard';
// import { UserDetail } from './components/admin/UserDetail';
import styles from './App.module.css';

import { ThemeProvider } from './context/ThemeContext';

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

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        {/* <Route path="/admin/:id" element={<UserDetail />} /> */}
      </Routes>
    </ThemeProvider>
  );
}

export default App;
