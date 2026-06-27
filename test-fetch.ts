import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testFetch() {
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
  const userId = '3c3a3ed7-2e56-480c-9311-6c56c70b28a1'; // Alex Developer's ID
  
  console.log(`Fetching applications for userId: ${userId}`);
  
  const appsRef = db.collection('applications');
  const snapshot = await appsRef.where('userId', '==', userId).get();
  
  const apps = snapshot.docs.map(doc => doc.data());
  console.log(`Found ${apps.length} applications from Firebase!`);
  console.log(apps);
}

testFetch().catch(console.error);
