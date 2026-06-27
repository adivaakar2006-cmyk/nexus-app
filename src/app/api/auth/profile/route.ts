import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { verifyToken, hashPassword } from '@/lib/auth';

const getUserId = (request: Request): string | null => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
};

export async function PUT(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, twoFactorEnabled, plan, preferences } = await request.json();
    const db = await getDb();
    
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if new email is already taken by someone else
    if (email && email !== db.users[userIndex].email) {
      if (db.users.find(u => u.email === email)) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    const updatedUser = { ...db.users[userIndex] };

    if (name !== undefined) updatedUser.name = name;
    if (email !== undefined) updatedUser.email = email;
    if (password) {
      updatedUser.passwordHash = await hashPassword(password);
    }
    if (twoFactorEnabled !== undefined) updatedUser.twoFactorEnabled = twoFactorEnabled;
    if (plan !== undefined) updatedUser.plan = plan;
    if (preferences !== undefined) {
      updatedUser.preferences = {
        ...updatedUser.preferences,
        ...preferences
      };
    }

    db.users[userIndex] = updatedUser;
    await saveDb(db);

    return NextResponse.json({
      user: { 
        id: updatedUser.id, 
        name: updatedUser.name, 
        email: updatedUser.email,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
        plan: updatedUser.plan,
        preferences: updatedUser.preferences
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
