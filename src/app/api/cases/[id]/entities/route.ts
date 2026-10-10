import { NextResponse } from 'next/server';
import { getEntitiesByCase, createEntity, updateEntity } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const list = getEntitiesByCase(params.id);
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Entity name and category are required' },
        { status: 400 }
      );
    }

    const created = createEntity({
      caseId: params.id,
      name: body.name,
      category: body.category,
      role: body.role || 'neutral',
      details: body.details || {},
      status: body.status || 'unverified',
      notes: body.notes || '',
      sourceEvidenceIds: body.sourceEvidenceIds || [],
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
      return NextResponse.json({ success: false, error: 'Entity ID is required' }, { status: 400 });
    }
    const updated = updateEntity(body.id, body.updates || body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
