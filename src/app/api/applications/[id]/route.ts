import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const getUserId = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDb();
    
    const index = db.applications.findIndex(app => app.id === id && app.userId === userId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const currentApp = db.applications[index];
    
    db.applications[index] = {
      ...currentApp,
      ...body,
      id: currentApp.id, // Prevent overriding ID
      userId: currentApp.userId, // Prevent overriding User ID
      updatedAt: new Date().toISOString()
    };

    await saveDb(db);
    return NextResponse.json(db.applications[index]);

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDb();
    
    const index = db.applications.findIndex(app => app.id === id && app.userId === userId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    db.applications.splice(index, 1);
    await saveDb(db);
    
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
