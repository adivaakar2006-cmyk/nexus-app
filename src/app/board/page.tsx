'use client';

import React, { useState, useEffect } from 'react';
import styles from './board.module.css';
import { useApplications } from '@/contexts/ApplicationContext';
import { Application, ApplicationStatus } from '@/lib/db';
import { Plus, X, Trash2, Calendar, DollarSign, Sparkles, MessageSquare } from 'lucide-react';
import { getLogoUrl } from '@/lib/api';

const COLUMNS: ApplicationStatus[] = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const statusColors: Record<string, string> = {
  Wishlist: 'var(--status-wishlist)',
  Applied: 'var(--status-applied)',
  Interviewing: 'var(--status-interview)',
  Offer: 'var(--status-offer)',
  Rejected: 'var(--status-rejected)',
};

export default function Board() {
  const { applications, createApplication, updateApplication, deleteApplication, loading } = useApplications();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'ai'>('details');
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // AI Prep State
  const [aiText, setAiText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiHasGenerated, setAiHasGenerated] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: 'Wishlist' as ApplicationStatus,
    appliedDate: new Date().toISOString().split('T')[0],
    salary: '',
    notes: ''
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const target = e.target as HTMLElement;
      target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedAppId(null);
    setDragOverCol(null);
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent, col: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== col) {
      setDragOverCol(col);
    }
  };

  const handleDrop = async (e: React.DragEvent, col: string) => {
    e.preventDefault();
    if (draggedAppId) {
      await updateApplication(draggedAppId, { status: col as ApplicationStatus });
    }
    setDragOverCol(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createApplication(formData);
    setIsNewModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      status: 'Wishlist',
      appliedDate: new Date().toISOString().split('T')[0],
      salary: '',
      notes: ''
    });
  };

  const handleAppClick = (app: Application) => {
    setSelectedApp(app);
    setActiveTab('details');
    setAiText('');
    setAiHasGenerated(false);
  };

  const generateAiPrep = async () => {
    if (!selectedApp) return;
    setIsGenerating(true);
    setAiText('');
    setAiHasGenerated(true);

    const mockResponse = `Based on the ${selectedApp.position} role at ${selectedApp.company}, here are 3 technical questions you should prepare for:

1. How would you design the state management architecture for a highly interactive real-time dashboard similar to our core product?
2. Can you explain the trade-offs between Server-Side Rendering (SSR) and Client-Side Rendering (CSR), specifically in the context of Next.js?
3. Walk me through a scenario where you had to heavily optimize the performance of a React application. What profiling tools did you use?

Tip: Make sure to emphasize your recent work on full-stack projects and your ability to build production-ready APIs!`;

    // Simulate streaming UI
    let i = 0;
    const interval = setInterval(() => {
      setAiText(mockResponse.slice(0, i));
      i++;
      if (i > mockResponse.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  if (loading) return <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center'}}>Loading board...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Application Pipeline</h1>
        <button className={styles.addButton} onClick={() => setIsNewModalOpen(true)}>
          <Plus size={20} /> Add Application
        </button>
      </header>

      <div className={styles.board}>
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col);
          return (
            <div 
              key={col} 
              className={`${styles.column} ${dragOverCol === col ? styles.columnDragOver : ''}`}
              onDragOver={(e) => handleDragOver(e, col)}
              onDrop={(e) => handleDrop(e, col)}
            >
              <div className={styles.columnHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: statusColors[col] }}></div>
                  {col}
                </div>
                <span className={styles.count}>{colApps.length}</span>
              </div>

              <div className={styles.cardList}>
                {colApps.map(app => {
                  const domain = `${app.company.toLowerCase().replace(/\s+/g, '')}.com`;
                  return (
                    <div 
                      key={app.id} 
                      className={`glass ${styles.card}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => {
                        // Don't trigger if they clicked the delete button
                        if ((e.target as Element).closest(`.${styles.deleteBtn}`)) return;
                        handleAppClick(app);
                      }}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.companyInfo}>
                          <div className={styles.logo}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getLogoUrl(domain)} alt={app.company} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          </div>
                          <div>
                            <div className={styles.companyName}>{app.company}</div>
                            <div className={styles.position}>{app.position}</div>
                          </div>
                        </div>
                        <button 
                          className={styles.deleteBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteApplication(app.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className={styles.cardFooter}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} />
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                        {app.salary && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <DollarSign size={12} />
                            {app.salary}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Application Modal */}
      {isNewModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsNewModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>New Application</h2>
              <button className={styles.closeBtn} onClick={() => setIsNewModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input 
                  type="text" 
                  required 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. Google"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Position</label>
                <input 
                  type="text" 
                  required 
                  value={formData.position}
                  onChange={e => setFormData({...formData, position: e.target.value})}
                  placeholder="e.g. Frontend Software Engineer Intern"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ApplicationStatus})}
                  >
                    {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Applied Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.appliedDate}
                    onChange={e => setFormData({...formData, appliedDate: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Salary (Optional)</label>
                <input 
                  type="text" 
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                  placeholder="e.g. $120k"
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.addButton}>
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* App Details / AI Modal */}
      {selectedApp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedApp(null)}>
          <div className={styles.modal} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={styles.logo} style={{ width: '48px', height: '48px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={getLogoUrl(`${selectedApp.company.toLowerCase().replace(/\s+/g, '')}.com`)} alt={selectedApp.company} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>{selectedApp.company}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>{selectedApp.position}</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedApp(null)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.detailTabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'details' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'ai' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('ai')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Sparkles size={16} /> AI Interview Prep
              </button>
            </div>

            {activeTab === 'details' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</label>
                    <div style={{ fontWeight: 600, color: statusColors[selectedApp.status] }}>{selectedApp.status}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Applied Date</label>
                    <div style={{ fontWeight: 500 }}>{new Date(selectedApp.appliedDate).toLocaleDateString()}</div>
                  </div>
                  {selectedApp.salary && (
                    <div>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Salary</label>
                      <div style={{ fontWeight: 500 }}>{selectedApp.salary}</div>
                    </div>
                  )}
                </div>
                {selectedApp.notes && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Notes</label>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                      {selectedApp.notes}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className={styles.aiContainer}>
                <div className={styles.aiHeader}>
                  <Sparkles size={20} />
                  <span>Nexus AI Assistant</span>
                </div>
                
                {!aiHasGenerated ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <MessageSquare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                      Generate custom technical interview questions based on this specific role and company.
                    </p>
                    <button className={styles.aiBtn} onClick={generateAiPrep}>
                      <Sparkles size={18} /> Generate Prep
                    </button>
                  </div>
                ) : (
                  <div className={styles.aiContent}>
                    {aiText}
                    {isGenerating && <span className={styles.cursor}></span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
