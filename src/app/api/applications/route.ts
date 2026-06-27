import { NextResponse } from 'next/server';
import { getDb, saveDb, Application } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

const getUserId = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const userApplications = db.applications.filter(app => app.userId === userId);
    
    // Sort by updated date descending
    userApplications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json(userApplications);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { company, position, status, appliedDate, salary, notes } = body;

    if (!company || !position || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Optional: fetch logo from logo.dev (can also be done on frontend)
    // For now we store the domain or let frontend handle it.

    const newApp: Application = {
      id: uuidv4(),
      userId,
      company,
      position,
      status,
      appliedDate: appliedDate || new Date().toISOString().split('T')[0],
      salary,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const db = await getDb();
    db.applications.push(newApp);
    await saveDb(db);

    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
