import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { 
  ADMIN_COOKIE_NAME, 
  getAdminSecret, 
  computeAuthToken, 
  isAuthenticatedAdmin 
} from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const isAuthed = await isAuthenticatedAdmin(request);
    return NextResponse.json({ authenticated: isAuthed });
  } catch (error) {
    console.error('Admin Auth Check Error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_COOKIE_NAME, '', {
        path: '/',
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return NextResponse.json({ success: true, message: 'Logged out' });
    }

    if (action === 'login') {
      const providedPassword = (body.password || '').trim();
      const actualSecret = getAdminSecret().trim();

      if (!providedPassword || providedPassword !== actualSecret) {
        return NextResponse.json(
          { success: false, error: 'Hatalı şifre veya yetkisiz erişim.' },
          { status: 401 }
        );
      }

      const token = computeAuthToken(actualSecret);
      const cookieStore = await cookies();
      cookieStore.set(ADMIN_COOKIE_NAME, token, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days session
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return NextResponse.json({ success: true, message: 'Authenticated' });
    }

    return NextResponse.json({ success: false, error: 'Geçersiz işlem.' }, { status: 400 });
  } catch (error) {
    console.error('Admin Auth POST Error:', error);
    return NextResponse.json({ success: false, error: 'Kimlik doğrulama hatası.' }, { status: 500 });
  }
}
