import { z } from 'zod';
import validator from 'validator';

export const sanitizeString = (s) => (typeof s === 'string' ? s.trim() : '');

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Za-z]/, 'Password must contain letters')
    .regex(/\d/, 'Password must contain numbers'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export function normalizeEmail(email) {
  return validator.normalizeEmail(email || '', { gmail_remove_dots: false }) || '';
}
