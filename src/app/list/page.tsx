'use client';

import React, { useState, useMemo, useEffect } from 'react';
import styles from './list.module.css';
import { useApplications } from '@/contexts/ApplicationContext';
import { Application, ApplicationStatus } from '@/lib/db';
import { getLogoUrl } from '@/lib/api';

const statusColors: Record<string, string> = {
  Wishlist: 'var(--status-wishlist)',
  Applied: 'var(--status-applied)',
  Interviewing: 'var(--status-interview)',
  Offer: 'var(--status-offer)',
  Rejected: 'var(--status-rejected)',
};

type SortKey = 'company' | 'position' | 'status' | 'appliedDate' | 'salary';

export default function ListView() {
  const { applications, loading } = useApplications();
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Sorting state
  const [sortKey, setSortKey] = useState<SortKey>('appliedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    // Filter
    let result = applications.filter(app => {
      const matchesSearch = app.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sort
    result = result.sort((a, b) => {
      let aVal = a[sortKey] || '';
      let bVal = b[sortKey] || '';
      
      if (sortKey === 'appliedDate') {
        aVal = new Date(aVal).getTime() as any;
        bVal = new Date(bVal).getTime() as any;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [applications, searchTerm, statusFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>All Applications</h1>
      </header>

      <div className={styles.filters}>
        <input 
          type="text" 
          placeholder="Search by company or position..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {Object.keys(statusColors).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
          {filteredAndSorted.length} records found
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('company')}>
                Company {sortKey === 'company' && <span className={`${styles.sortIcon} ${styles.activeSort}`}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th onClick={() => handleSort('position')}>
                Position {sortKey === 'position' && <span className={`${styles.sortIcon} ${styles.activeSort}`}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th onClick={() => handleSort('status')}>
                Status {sortKey === 'status' && <span className={`${styles.sortIcon} ${styles.activeSort}`}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th onClick={() => handleSort('appliedDate')}>
                Applied Date {sortKey === 'appliedDate' && <span className={`${styles.sortIcon} ${styles.activeSort}`}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
              <th onClick={() => handleSort('salary')}>
                Salary {sortKey === 'salary' && <span className={`${styles.sortIcon} ${styles.activeSort}`}>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>No applications match your filters.</td>
              </tr>
            ) : (
              paginatedData.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className={styles.companyCell}>
                      <div className={styles.logo}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={getLogoUrl(`${app.company.toLowerCase().replace(/\s+/g, '')}.com`)} alt={app.company} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      </div>
                      {app.company}
                    </div>
                  </td>
                  <td>{app.position}</td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{ 
                        backgroundColor: `${statusColors[app.status]}20`, 
                        color: statusColors[app.status] 
                      }}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{app.salary || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length}
            </div>
            <div className={styles.pageButtons}>
              <button 
                className={styles.pageBtn} 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </button>
              <button 
                className={styles.pageBtn} 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
