import { NextResponse } from 'next/server';
import { db, User } from '@/lib/db';
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
    
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data() as User;

    // Check if new email is already taken by someone else
    if (email && email !== userData.email) {
      const emailCheck = await db.collection('users').where('email', '==', email).get();
      if (!emailCheck.empty) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
      }
    }

    const updates: any = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (password) {
      updates.passwordHash = await hashPassword(password);
    }
    if (twoFactorEnabled !== undefined) updates.twoFactorEnabled = twoFactorEnabled;
    if (plan !== undefined) updates.plan = plan;
    if (preferences !== undefined) {
      updates.preferences = {
        ...(userData.preferences || {}),
        ...preferences
      };
    }

    await userRef.update(updates);

    const updatedUser = { ...userData, ...updates };

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
