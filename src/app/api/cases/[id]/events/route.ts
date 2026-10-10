import { NextResponse } from 'next/server';
import { getEventsByCase, createEvent, updateEvent } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const list = getEventsByCase(params.id);
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Event title is required' }, { status: 400 });
    }

    const created = createEvent({
      caseId: params.id,
      title: body.title,
      timestamp: body.timestamp || new Date().toISOString(),
      timeDisplay: body.timeDisplay || 'Unspecified Time',
      timePrecision: body.timePrecision || 'reported',
      description: body.description || '',
      location: body.location || '',
      associatedEntityIds: body.associatedEntityIds || [],
      sourceEvidenceId: body.sourceEvidenceId || '',
      verificationStatus: body.verificationStatus || 'unverified',
      confidence: body.confidence ?? 0.8,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 });
    }
    const updated = updateEvent(body.id, body.updates || body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
