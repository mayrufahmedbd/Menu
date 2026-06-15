import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Please provide all required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email }).select('+password');

    if (existingUser) {
      // Check if password matches the existing account's password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password!);
      
      if (isPasswordValid) {
        // Automatically log them in!
        const token = jwt.sign(
          { userId: existingUser._id, role: existingUser.role },
          process.env.JWT_SECRET || 'fallback_secret',
          { expiresIn: '7d' }
        );

        const response = NextResponse.json(
          {
            message: 'Logged in with existing account',
            user: {
              id: existingUser._id,
              name: existingUser.name,
              email: existingUser.email,
              role: existingUser.role,
            },
          },
          { status: 200 }
        );

        response.cookies.set({
          name: 'token',
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: '/',
        });

        return response;
      } else {
        // Password does not match, prompt them to login
        return NextResponse.json(
          { message: 'This email is already registered. Please log in with your existing account.' },
          { status: 409 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
