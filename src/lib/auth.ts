import { headers, cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
// NOTE: Assuming dbConnect and User model are correctly located
import dbConnect from './dbConnect';
import User from '@/models/User';

// -----------------------------------------------------------------
// NAMED EXPORTS (FOR OTHER UTILITIES)
// -----------------------------------------------------------------

export async function getSession() {
  try {
    await dbConnect();
    
    const headersList = headers();
    const cookieStore = cookies();
    
    // Try to get token from Authorization header first
    let token = headersList.get('authorization');
    
    if (token?.startsWith('Bearer ')) {
      token = token.slice(7);
    } else {
      // Fallback to cookie
      token = cookieStore.get('token')?.value;
    }

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    const user = await User.findById(decoded.userId).select('-password');
    return user ? { user: user.toObject() } : null;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
}


// -----------------------------------------------------------------
// DEFAULT EXPORT (THE FIX)
// -----------------------------------------------------------------

// The core function logic remains the same.
async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Exports the getCurrentUser function as the module's default export.
 * This ensures maximum compatibility when importing into Next.js API Routes.
 */
export default getCurrentUser;