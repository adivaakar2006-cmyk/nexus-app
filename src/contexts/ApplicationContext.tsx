/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { Application } from '@/lib/db';
import { useAuth } from './AuthContext';

interface ApplicationContextType {
  applications: Application[];
  loading: boolean;
  fetchApplications: () => Promise<void>;
  createApplication: (app: Partial<Application>) => Promise<void>;
  updateApplication: (id: string, app: Partial<Application>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchApplications = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await api.get('/api/applications');
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const createApplication = async (app: Partial<Application>) => {
    const data = await api.post('/api/applications', app);
    setApplications(prev => [data, ...prev]);
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    const data = await api.put(`/api/applications/${id}`, updates);
    setApplications(prev => prev.map(app => app.id === id ? data : app));
  };

  const deleteApplication = async (id: string) => {
    await api.delete(`/api/applications/${id}`);
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <ApplicationContext.Provider 
      value={{ applications, loading, fetchApplications, createApplication, updateApplication, deleteApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
