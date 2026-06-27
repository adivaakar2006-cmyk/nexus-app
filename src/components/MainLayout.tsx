'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from './MainLayout.module.css';
import { Menu } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader">Loading Nexus...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>Nexus</div>
        <button className={styles.menuButton} onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      </header>
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
