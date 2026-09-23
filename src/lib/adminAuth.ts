import { cookies } from 'next/headers';
import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'stackcost_admin_token';
const DEFAULT_FALLBACK_KEY = 'stackcost2026!';

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_FALLBACK_KEY;
}

export function computeAuthToken(secret: string): string {
  return crypto
    .createHash('sha256')
    .update(`${secret}::stackcost_secure_admin_session_v1`)
    .digest('hex');
}

export async function isAuthenticatedAdmin(request?: Request): Promise<boolean> {
  const secret = getAdminSecret();
  const expectedToken = computeAuthToken(secret);

  // 1. Check Bearer token or x-admin-key header if provided in direct API calls
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token === secret || token === expectedToken) {
        return true;
      }
    }

    const customKeyHeader = request.headers.get('x-admin-key');
    if (customKeyHeader && (customKeyHeader === secret || customKeyHeader === expectedToken)) {
      return true;
    }
  }

  // 2. Check HTTP-only cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  if (sessionCookie && sessionCookie.value === expectedToken) {
    return true;
  }

  return false;
}
