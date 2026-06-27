/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { User, Shield, CreditCard, Bell, LogOut, CheckCircle, AlertCircle, X, QrCode, Eye, EyeOff } from 'lucide-react';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Security State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Billing State
  const [plan, setPlan] = useState<'Intern' | 'Pro'>('Intern');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [ccNumber, setCcNumber] = useState('');
  const [ccExp, setCcExp] = useState('');
  const [ccCvv, setCcCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Notifications State
  const [preferences, setPreferences] = useState({
    reminders: true,
    updates: true,
    weekly: false
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTwoFactorEnabled(user.twoFactorEnabled || false);
      setPlan(user.plan || 'Intern');
      if (user.preferences) {
        setPreferences(user.preferences);
      }
    }
  }, [user]);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updates: any = {};
      if (name !== user?.name) updates.name = name;
      if (email !== user?.email) updates.email = email;

      if (Object.keys(updates).length === 0) {
        showMessage('info', 'No changes to save.');
        setIsSaving(false);
        return;
      }
      const res = await api.put('/api/auth/profile', updates);
      updateUser(res.user);
      showMessage('success', 'Profile updated successfully!');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage('error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      showMessage('error', 'Password must be at least 6 characters.');
      return;
    }
    setIsPasswordSaving(true);
    try {
      const res = await api.put('/api/auth/profile', { password });
      updateUser(res.user);
      setPassword('');
      setConfirmPassword('');
      showMessage('success', 'Password updated successfully!');
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update password.');
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleToggle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length < 6) return;
    setIsSaving(true);
    try {
      const res = await api.put('/api/auth/profile', { twoFactorEnabled: true });
      updateUser(res.user);
      setTwoFactorEnabled(true);
      setShow2FAModal(false);
      setTwoFactorCode('');
      showMessage('success', 'Two-Factor Authentication enabled!');
    } catch (err: any) {
      showMessage('error', 'Failed to enable 2FA.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsSaving(true);
    try {
      const res = await api.put('/api/auth/profile', { twoFactorEnabled: false });
      updateUser(res.user);
      setTwoFactorEnabled(false);
      showMessage('success', 'Two-Factor Authentication disabled.');
    } catch (err: any) {
      showMessage('error', 'Failed to disable 2FA.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network processing for checkout
    setTimeout(async () => {
      try {
        const res = await api.put('/api/auth/profile', { plan: 'Pro' });
        updateUser(res.user);
        setPlan('Pro');
        setShowBillingModal(false);
        setCcNumber('');
        setCcExp('');
        setCcCvv('');
        showMessage('success', 'Successfully upgraded to Pro!');
      } catch (err: any) {
        showMessage('error', 'Payment failed.');
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const handlePreferenceChange = async (key: keyof typeof preferences) => {
    const newPrefs = { ...preferences, [key]: !preferences[key] };
    setPreferences(newPrefs);
    try {
      const res = await api.put('/api/auth/profile', { preferences: newPrefs });
      updateUser(res.user);
      // We don't show a message here so we don't spam the user on every click
    } catch (err) {
      showMessage('error', 'Failed to save preferences.');
      // Revert on failure
      setPreferences(preferences);
    }
  };

  const TABS = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Settings</h1>
          <p>Manage your account preferences and personal information</p>
        </div>
      </header>

      <div className={styles.settingsLayout}>
        {/* Sidebar Tabs */}
        <nav className={styles.tabsMenu}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>
          <button className={`${styles.tabBtn}`} onClick={logout} style={{ color: 'var(--status-rejected)' }}>
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {message.text && (
            <div className={`${styles.alert} ${
              message.type === 'success' ? styles.alertSuccess : 
              message.type === 'error' ? styles.alertError : styles.alertInfo
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <section className={`glass ${styles.section} animate-fade-in-up`}>
              <div className={styles.sectionHeader}>
                <h2>Personal Information</h2>
                <p>Update your name, email, and authentication details.</p>
              </div>
              <form className={styles.form} onSubmit={handleProfileSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input 
                    id="name"
                    type="text" 
                    className={styles.input}
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    className={styles.input}
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.actions}>
                  <button type="submit" className={styles.primaryBtn} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </section>
          )}

          {activeTab === 'security' && (
            <section className={`glass ${styles.section} animate-fade-in-up`}>
              <div className={styles.sectionHeader}>
                <h2>Security Settings</h2>
                <p>Manage your account security and active sessions.</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem' }}>Two-Factor Authentication</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {twoFactorEnabled ? '2FA is active. Your account is secure.' : 'Add an extra layer of security to your account.'}
                    </p>
                  </div>
                  {twoFactorEnabled ? (
                    <button className={styles.dangerBtn} onClick={handleDisable2FA} disabled={isSaving}>
                      Disable 2FA
                    </button>
                  ) : (
                    <button className={styles.primaryBtn} onClick={() => setShow2FAModal(true)}>
                      Enable 2FA
                    </button>
                  )}
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Change Password</h3>
                  <form className={styles.form} onSubmit={handlePasswordSubmit}>
                    <div className={styles.formGroup}>
                      <label htmlFor="new-password">New Password</label>
                      <div className={styles.passwordWrapper}>
                        <input 
                          id="new-password"
                          type={showPassword ? "text" : "password"} 
                          className={styles.input}
                          value={password} 
                          onChange={e => setPassword(e.target.value)}
                          required
                          placeholder="Enter new password"
                        />
                        <button 
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="confirm-password">Confirm Password</label>
                      <div className={styles.passwordWrapper}>
                        <input 
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"} 
                          className={styles.input}
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)}
                          required
                          placeholder="Confirm new password"
                        />
                        <button 
                          type="button"
                          className={styles.passwordToggle}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className={styles.actions} style={{ paddingTop: '1rem' }}>
                      <button type="submit" className={styles.primaryBtn} disabled={isPasswordSaving}>
                        {isPasswordSaving ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'billing' && (
            <section className={`glass ${styles.section} animate-fade-in-up`}>
              <div className={styles.sectionHeader}>
                <h2>Billing & Plan</h2>
                <p>Manage your subscription and billing details.</p>
              </div>
              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <div style={{ 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: plan === 'Intern' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: plan === 'Intern' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)'
                }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Intern Edition</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>$0<span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/mo</span></div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li>Up to 50 applications</li>
                    <li>Basic Analytics</li>
                  </ul>
                  {plan === 'Intern' ? (
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Current Plan</div>
                  ) : (
                    <button className={styles.primaryBtn} style={{ width: '100%' }} disabled>Downgrade</button>
                  )}
                </div>

                <div style={{ 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  border: plan === 'Pro' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: plan === 'Pro' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)'
                }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>Senior Dev Pro</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>$9<span style={{ fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>/mo</span></div>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                    <li>Unlimited applications</li>
                    <li>Advanced AI Prep</li>
                  </ul>
                  {plan === 'Pro' ? (
                    <div style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Current Plan</div>
                  ) : (
                    <button className={styles.primaryBtn} style={{ width: '100%' }} onClick={() => setShowBillingModal(true)}>
                      Upgrade to Pro
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'notifications' && (
            <section className={`glass ${styles.section} animate-fade-in-up`}>
              <div className={styles.sectionHeader}>
                <h2>Notification Preferences</h2>
                <p>Choose what we email you about.</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={preferences.reminders} 
                    onChange={() => handlePreferenceChange('reminders')}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-primary)' }}
                  /> 
                  <div>
                    <div style={{ fontWeight: 500 }}>Application Reminders</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get notified when you haven't heard back in 2 weeks.</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={preferences.updates} 
                    onChange={() => handlePreferenceChange('updates')}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-primary)' }}
                  /> 
                  <div>
                    <div style={{ fontWeight: 500 }}>Product Updates</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Occasional emails about new Nexus features.</div>
                  </div>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={preferences.weekly} 
                    onChange={() => handlePreferenceChange('weekly')}
                    style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--accent-primary)' }}
                  /> 
                  <div>
                    <div style={{ fontWeight: 500 }}>Weekly Analytics Digest</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>A summary of your application pipeline every Monday.</div>
                  </div>
                </label>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShow2FAModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: 'var(--radius-lg)' }} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title-2fa">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 id="modal-title-2fa" style={{ fontSize: '1.25rem' }}>Setup 2FA</h2>
              <button onClick={() => setShow2FAModal(false)} style={{ color: 'var(--text-muted)' }} aria-label="Close 2FA modal"><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Scan this QR code with your authenticator app (like Google Authenticator or Authy).
            </p>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <QrCode size={120} color="black" />
            </div>
            <form onSubmit={handleToggle2FA}>
              <div className={styles.formGroup}>
                <label>Verification Code</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="Enter 6-digit code" 
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  required
                />
              </div>
              <button className={styles.primaryBtn} style={{ width: '100%', marginTop: '1rem' }} disabled={isSaving || twoFactorCode.length < 6}>
                Verify & Enable
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showBillingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowBillingModal(false)}>
          <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: 'var(--radius-lg)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Upgrade to Pro</h2>
              <button onClick={() => setShowBillingModal(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              You will be charged <strong>$9.00</strong> immediately.
            </p>
            <form onSubmit={handleUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="0000 0000 0000 0000" 
                  value={ccNumber}
                  onChange={e => setCcNumber(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="MM/YY" 
                    value={ccExp}
                    onChange={e => setCcExp(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>CVC</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    placeholder="123" 
                    value={ccCvv}
                    onChange={e => setCcCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button className={styles.primaryBtn} style={{ width: '100%', marginTop: '1rem', position: 'relative' }} disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : 'Pay $9.00'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Payments are securely processed by Stripe.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
