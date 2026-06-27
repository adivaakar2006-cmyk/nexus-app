'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, KanbanSquare, Calendar as CalendarIcon, List, Settings, LogOut, Briefcase, X } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Board', path: '/board', icon: KanbanSquare },
    { name: 'List', path: '/list', icon: List },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoHeader}>
          <Link href="/dashboard" className={styles.logo}>
            <Briefcase size={24} color="var(--accent-primary)" />
            Nexus
          </Link>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close sidebar">
            <X size={24} />
          </button>
        </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={clsx(styles.navItem, isActive && styles.active)}
              aria-label={`Navigate to ${item.name}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar} aria-hidden="true">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>{user?.name}</div>
            <div className={styles.userEmail}>{user?.email}</div>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} aria-label="Sign out of your account">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
