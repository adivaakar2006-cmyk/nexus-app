import { NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    
    // Check if user exists
    if (db.users.find(u => u.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    
    const newUser = {
      id: uuidv4(),
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    await saveDb(db);

    const token = generateToken(newUser.id);

    return NextResponse.json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
