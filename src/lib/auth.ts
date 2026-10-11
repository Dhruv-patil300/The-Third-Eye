import crypto from 'crypto';
import { NextResponse } from 'next/server';

export type UserRole = 'SUPERVISOR' | 'INVESTIGATOR' | 'ANALYST' | 'AUDITOR';

export interface OfficerUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  badgeNumber: string;
  stationUnit: string;
  assignedCaseIds: string[]; // empty array means access to all cases (e.g. for SUPERVISOR / AUDITOR)
}

// Built-in authorized officers for initial operational configuration
export const AUTHORIZED_OFFICERS: Array<OfficerUser & { passwordHash: string; salt: string }> = [
  {
    id: 'off-patil-001',
    username: 'patil.acp',
    name: 'S. R. Patil, IPS',
    role: 'SUPERVISOR',
    badgeNumber: 'PCPC-IPS-001',
    stationUnit: 'Crime Branch Headquarters, PCPC',
    assignedCaseIds: [], // All cases
    salt: 'pcpc_salt_8921',
    passwordHash: hashPassword('Patil@PCPC2026', 'pcpc_salt_8921'),
  },
  {
    id: 'off-shinde-4819',
    username: 'shinde.pi',
    name: 'Vikram Shinde, PI',
    role: 'INVESTIGATOR',
    badgeNumber: 'PCPC-CRIME-4819',
    stationUnit: 'Wakad Police Station / Forensic Unit',
    assignedCaseIds: ['case-pcpc-wakad-2025', 'case-pcpc-chakan-2025'],
    salt: 'pcpc_salt_4819',
    passwordHash: hashPassword('Shinde@Crime2026', 'pcpc_salt_4819'),
  },
  {
    id: 'off-deshmukh-104',
    username: 'deshmukh.fsl',
    name: 'Neha Deshmukh',
    role: 'ANALYST',
    badgeNumber: 'PCPC-FSL-104',
    stationUnit: 'Regional Forensic Science Laboratory, Pune',
    assignedCaseIds: ['case-pcpc-wakad-2025', 'case-pcpc-chakan-2025'],
    salt: 'pcpc_salt_1042',
    passwordHash: hashPassword('Neha@Forensics2026', 'pcpc_salt_1042'),
  },
  {
    id: 'off-kulkarni-088',
    username: 'kulkarni.prosecutor',
    name: 'Adv. Ramesh Kulkarni',
    role: 'AUDITOR',
    badgeNumber: 'PCPC-LEGAL-088',
    stationUnit: 'Directorate of Public Prosecutions, Pune',
    assignedCaseIds: [], // All cases read-only
    salt: 'pcpc_salt_0884',
    passwordHash: hashPassword('Prosecutor@2026', 'pcpc_salt_0884'),
  },
];

function getAuthSecret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'third-eye-secure-officer-session-secret-key-2026';
}

export function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

/**
 * Creates a signed JWT-like session token with HMAC-SHA256 signature
 */
export function createSessionToken(user: OfficerUser, expiresInHours = 12): string {
  const secret = getAuthSecret();
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const payload = {
    sub: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    badgeNumber: user.badgeNumber,
    stationUnit: user.stationUnit,
    assignedCaseIds: user.assignedCaseIds,
    exp,
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  return `${b64Header}.${b64Payload}.${signature}`;
}

/**
 * Validates and decodes session token
 */
export function verifySessionToken(token: string): OfficerUser | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [b64Header, b64Payload, signature] = parts;
    const secret = getAuthSecret();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${b64Header}.${b64Payload}`)
      .digest('base64url');

    // Constant-time comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return {
      id: payload.sub,
      username: payload.username,
      name: payload.name,
      role: payload.role,
      badgeNumber: payload.badgeNumber,
      stationUnit: payload.stationUnit,
      assignedCaseIds: payload.assignedCaseIds || [],
    };
  } catch (err) {
    return null;
  }
}

/**
 * Extracts authenticated officer from request headers or cookie
 */
export function getAuthOfficerFromRequest(req: Request): OfficerUser | null {
  // 1. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const user = verifySessionToken(token);
    if (user) return user;
  }

  // 2. Check cookie: officer_session
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/officer_session=([^;]+)/);
  if (match && match[1]) {
    const user = verifySessionToken(match[1]);
    if (user) return user;
  }

  // 3. In non-production testing/development, allow default PI Shinde fallback if header indicates dev mode
  if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_ANONYMOUS === 'true') {
    return AUTHORIZED_OFFICERS[1]; // PI Shinde
  }

  return null;
}

/**
 * Checks whether user has permission to view/modify the specified case (IDOR defense)
 */
export function canUserAccessCase(user: OfficerUser, caseId: string, action: 'read' | 'write' | 'admin' = 'read'): boolean {
  // Supervisors can access all cases with full privileges
  if (user.role === 'SUPERVISOR') return true;

  // Auditors have read-only access to all cases
  if (user.role === 'AUDITOR') {
    return action === 'read';
  }

  // If specific assigned cases are defined for this investigator/analyst
  if (user.assignedCaseIds && user.assignedCaseIds.length > 0) {
    if (!user.assignedCaseIds.includes(caseId)) {
      return false;
    }
  }

  // Analysts have read/analysis access, but cannot delete or reassign cases
  if (user.role === 'ANALYST') {
    return action === 'read' || action === 'write';
  }

  // Investigators have read & write access to assigned cases
  if (user.role === 'INVESTIGATOR') {
    return action === 'read' || action === 'write';
  }

  return false;
}

/**
 * Helper to enforce authentication on server routes
 */
export function requireAuth(req: Request): { user: OfficerUser } | { errorResponse: NextResponse } {
  const user = getAuthOfficerFromRequest(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Missing or invalid officer credentials.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Helper to enforce case-level authorization on server routes
 */
export function requireCaseAccess(
  req: Request,
  caseId: string,
  action: 'read' | 'write' | 'admin' = 'read'
): { user: OfficerUser } | { errorResponse: NextResponse } {
  const auth = requireAuth(req);
  if ('errorResponse' in auth) {
    return auth;
  }

  if (!canUserAccessCase(auth.user, caseId, action)) {
    return {
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Access denied. Officer ${auth.user.badgeNumber} is not authorized for case ${caseId} (${action}).`,
          code: 'FORBIDDEN',
        },
        { status: 403 }
      ),
    };
  }

  return { user: auth.user };
}
