// API Client for Next.js Route Handlers

const getAuthHeaders = () => {
  const token = localStorage.getItem('nexus_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  get: async (url: string) => {
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  post: async (url: string, body: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  put: async (url: string, body: any) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  
  delete: async (url: string) => {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export /* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';
export const getLogoUrl = (domain: string) => {
  const apiKey = 'pk_Rp5SraN4RaiLHDvLjPxjpA';
  return `https://img.logo.dev/${domain}?token=${apiKey}`;
};
