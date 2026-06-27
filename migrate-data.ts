import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables manually since this is a standalone script
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function uploadData() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

  const db = getFirestore();
  const dataPath = path.join(process.cwd(), 'data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error('data.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`Found ${data.users.length} users and ${data.applications.length} applications.`);

  // Upload Users
  for (const user of data.users) {
    await db.collection('users').doc(user.id).set(user);
    console.log(`Uploaded user: ${user.email}`);
  }

  // Upload Applications
  for (const app of data.applications) {
    await db.collection('applications').doc(app.id).set(app);
    console.log(`Uploaded application: ${app.company}`);
  }

  console.log('Migration complete!');
  process.exit(0);
}

uploadData().catch(console.error);
