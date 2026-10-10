import { NextResponse } from 'next/server';
import { getAuditLogsByCase } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const logs = getAuditLogsByCase(params.id);
    return NextResponse.json({ success: true, data: logs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
