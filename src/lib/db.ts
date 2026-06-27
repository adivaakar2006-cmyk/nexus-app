import fs from 'fs';
import path from 'path';

// Define our types
export type ApplicationStatus = 'Wishlist' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: string;
  notes?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
  plan?: 'Intern' | 'Pro';
  preferences?: {
    reminders: boolean;
    updates: boolean;
    weekly: boolean;
  };
}

interface DatabaseSchema {
  users: User[];
  applications: Application[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data.json');

// Initialize database file if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const initialData: DatabaseSchema = { users: [], applications: [] };
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
};

initDb();

export const getDb = async (): Promise<DatabaseSchema> => {
  try {
    const data = await fs.promises.readFile(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error('Failed to parse database, resetting to empty state:', error);
    // If the database is corrupted, reset it to prevent the entire app from crashing
    const initialData: DatabaseSchema = { users: [], applications: [] };
    await saveDb(initialData);
    return initialData;
  }
};

export const saveDb = async (data: DatabaseSchema): Promise<void> => {
  await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
};
