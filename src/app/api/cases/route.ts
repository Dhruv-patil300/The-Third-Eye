import { NextResponse } from 'next/server';
import { getAllCases, createCase } from '@/lib/storage';

export async function GET() {
  try {
    const cases = getAllCases();
    return NextResponse.json({ success: true, data: cases });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.referenceNumber) {
      return NextResponse.json(
        { success: false, error: 'Case title and reference number are required' },
        { status: 400 }
      );
    }

    const newCase = createCase({
      id: `case-${Date.now()}`,
      title: body.title,
      referenceNumber: body.referenceNumber,
      caseType: body.caseType || 'General Investigation',
      incidentDate: body.incidentDate || new Date().toISOString(),
      incidentLocation: body.incidentLocation || 'Unspecified Location',
      summary: body.summary || '',
      status: body.status || 'active',
      priority: body.priority || 'medium',
      leadInvestigator: body.leadInvestigator || 'Current Investigator',
      tags: body.tags || [],
    });

    return NextResponse.json({ success: true, data: newCase }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
