import { NextResponse } from 'next/server';
import { getAuthOfficerFromRequest } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = getAuthOfficerFromRequest(req);
    if (!user) {
      return NextResponse.json({ success: false, officer: null }, { status: 401 });
    }
    return NextResponse.json({ success: true, officer: user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
