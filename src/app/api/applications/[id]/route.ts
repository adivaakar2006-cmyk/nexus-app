import { NextResponse } from 'next/server';
import { db, Application } from '@/lib/db';
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
    
    const appRef = db.collection('applications').doc(id);
    const appDoc = await appRef.get();
    
    if (!appDoc.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    const currentApp = appDoc.data() as Application;
    if (currentApp.userId !== userId) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updates = {
      ...body,
      id: currentApp.id, // Prevent overriding ID
      userId: currentApp.userId, // Prevent overriding User ID
      updatedAt: new Date().toISOString()
    };

    await appRef.update(updates);
    
    const updatedApp = { ...currentApp, ...updates };
    return NextResponse.json(updatedApp);

  } catch (error) {
    console.error('Update application error:', error);
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
    
    const appRef = db.collection('applications').doc(id);
    const appDoc = await appRef.get();
    
    if (!appDoc.exists) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    const currentApp = appDoc.data() as Application;
    if (currentApp.userId !== userId) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    await appRef.delete();
    
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
