import { NextResponse } from 'next/server';
import { AUTHORIZED_OFFICERS, hashPassword, createSessionToken } from '@/lib/auth';
import { recordAuditEvent } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const officer = AUTHORIZED_OFFICERS.find(
      (o) => o.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (!officer) {
      recordAuditEvent({
        caseId: 'SYSTEM',
        actor: username,
        action: 'AUTHENTICATION_FAILED',
        details: `Failed login attempt for unknown officer username: ${username}`,
        outcome: 'DENIED',
      });
      return NextResponse.json(
        { success: false, error: 'Invalid officer credentials or badge' },
        { status: 401 }
      );
    }

    const computedHash = hashPassword(password, officer.salt);
    if (computedHash !== officer.passwordHash) {
      recordAuditEvent({
        caseId: 'SYSTEM',
        actor: officer.username,
        action: 'AUTHENTICATION_FAILED',
        details: `Incorrect password entered for officer ${officer.badgeNumber}`,
        outcome: 'DENIED',
      });
      return NextResponse.json(
        { success: false, error: 'Invalid officer credentials or badge' },
        { status: 401 }
      );
    }

    // Generate secure session token
    const token = createSessionToken(officer);

    recordAuditEvent({
      caseId: 'SYSTEM',
      actor: `${officer.name} (${officer.badgeNumber})`,
      action: 'AUTHENTICATION_SUCCESS',
      details: `Officer logged in successfully with role ${officer.role}`,
      outcome: 'SUCCESS',
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        officer: {
          id: officer.id,
          username: officer.username,
          name: officer.name,
          role: officer.role,
          badgeNumber: officer.badgeNumber,
          stationUnit: officer.stationUnit,
          assignedCaseIds: officer.assignedCaseIds,
        },
      },
    });

    // Set HTTP-only secure cookie for browser sessions
    response.cookies.set('officer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 12 * 3600, // 12 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
