const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const DB_FILE_PATH = path.join(__dirname, 'data.json');
  
  let db = { users: [], applications: [] };
  if (fs.existsSync(DB_FILE_PATH)) {
    db = JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
  }

  // Remove existing fake profile if it exists
  const existingIndex = db.users.findIndex(u => u.email === 'alex.intern@example.com');
  if (existingIndex !== -1) {
    db.users.splice(existingIndex, 1);
  }

  const userId = uuidv4();
  const passwordHash = await bcrypt.hash('google2026', 10);

  const fakeUser = {
    id: userId,
    name: 'Alex Developer',
    email: 'alex.intern@example.com',
    passwordHash: passwordHash,
    createdAt: new Date().toISOString()
  };

  db.users.push(fakeUser);

  // Add some fake applications for this user
  const fakeApps = [
    {
      id: uuidv4(),
      userId: userId,
      company: 'Google',
      position: 'Software Engineering Intern',
      status: 'Interviewing',
      appliedDate: '2026-06-01',
      salary: '$9,000/mo',
      notes: 'First round technical interview went well.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: userId,
      company: 'Microsoft',
      position: 'Frontend Developer Intern',
      status: 'Applied',
      appliedDate: '2026-06-15',
      salary: '',
      notes: 'Applied through university portal.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: uuidv4(),
      userId: userId,
      company: 'Vercel',
      position: 'React Engineer Intern',
      status: 'Wishlist',
      appliedDate: '2026-06-27',
      salary: '$100/hr',
      notes: 'Need to finish this portfolio project first!',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  db.applications.push(...fakeApps);

  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), 'utf-8');
  console.log('Fake profile created successfully!');
  console.log('Email: alex.intern@example.com');
  console.log('Password: google2026');
}

seed();
