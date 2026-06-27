'use client';

import React, { useMemo } from 'react';
import styles from './dashboard.module.css';
import { useApplications } from '@/contexts/ApplicationContext';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getLogoUrl } from '@/lib/api';

const statusColors: Record<string, string> = {
  Wishlist: 'var(--status-wishlist)',
  Applied: 'var(--status-applied)',
  Interviewing: 'var(--status-interview)',
  Offer: 'var(--status-offer)',
  Rejected: 'var(--status-rejected)',
};

export default function Dashboard() {
  const { applications, loading } = useApplications();
  const { user } = useAuth();

  const metrics = useMemo(() => {
    return {
      total: applications.length,
      interviewing: applications.filter(a => a.status === 'Interviewing').length,
      offers: applications.filter(a => a.status === 'Offer').length,
      rejected: applications.filter(a => a.status === 'Rejected').length,
    };
  }, [applications]);

  const chartData = useMemo(() => {
    const data = [
      { name: 'Wishlist', count: applications.filter(a => a.status === 'Wishlist').length },
      { name: 'Applied', count: applications.filter(a => a.status === 'Applied').length },
      { name: 'Interviewing', count: applications.filter(a => a.status === 'Interviewing').length },
      { name: 'Offer', count: applications.filter(a => a.status === 'Offer').length },
      { name: 'Rejected', count: applications.filter(a => a.status === 'Rejected').length },
    ];
    return data;
  }, [applications]);

  const recentApplications = useMemo(() => {
    return [...applications].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 4);
  }, [applications]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p>Here is the status of your job applications</p>
        </div>
      </header>

      <section className={styles.metricsGrid}>
        <div className={`glass ${styles.metricCard}`}>
          <span className={styles.metricTitle}>Total Applications</span>
          <span className={styles.metricValue}>{metrics.total}</span>
        </div>
        <div className={`glass ${styles.metricCard}`}>
          <span className={styles.metricTitle}>Interviewing</span>
          <span className={styles.metricValue} style={{ color: 'var(--status-interview)' }}>{metrics.interviewing}</span>
        </div>
        <div className={`glass ${styles.metricCard}`}>
          <span className={styles.metricTitle}>Offers</span>
          <span className={styles.metricValue} style={{ color: 'var(--status-offer)' }}>{metrics.offers}</span>
        </div>
        <div className={`glass ${styles.metricCard}`}>
          <span className={styles.metricTitle}>Rejected</span>
          <span className={styles.metricValue} style={{ color: 'var(--status-rejected)' }}>{metrics.rejected}</span>
        </div>
      </section>

      <section className={styles.chartsContainer}>
        <div className={`glass ${styles.chartCard}`}>
          <h2>Pipeline Overview</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)' }} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`glass ${styles.chartCard}`}>
          <h2>Recent Updates</h2>
          <div className={styles.recentList}>
            {recentApplications.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No applications yet.</p>
            ) : (
              recentApplications.map(app => {
                // Extract domain from company name roughly (e.g., "Google" -> "google.com")
                const domain = `${app.company.toLowerCase().replace(/\s+/g, '')}.com`;
                return (
                  <div key={app.id} className={styles.recentItem}>
                    <div className={styles.recentInfo}>
                      <div className={styles.companyLogo}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getLogoUrl(domain)} alt={app.company} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      <div className={styles.jobDetails}>
                        <h4>{app.company}</h4>
                        <p>{app.position}</p>
                      </div>
                    </div>
                    <span 
                      className={styles.statusBadge}
                      style={{ 
                        backgroundColor: `${statusColors[app.status]}20`, 
                        color: statusColors[app.status] 
                      }}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
