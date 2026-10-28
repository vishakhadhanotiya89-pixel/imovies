import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../db/store.ts';
import { AuthRequest, generateToken } from '../middleware/auth.ts';

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = dbStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userRole = role === 'admin' ? 'admin' : 'customer';

    const newUser = dbStore.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: userRole,
    });

    const token = generateToken({
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal registration error.' });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide both email and password.' });
    }

    const user = dbStore.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, (user as any).passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal login error.' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const user = dbStore.findUserById(req.user._id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
}
