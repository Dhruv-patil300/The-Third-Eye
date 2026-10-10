import { NextResponse } from 'next/server';
import { getEvidenceItem, updateEvidence, deleteEvidence } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = getEvidenceItem(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Evidence item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateEvidence(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Evidence item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteEvidence(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Evidence item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Evidence deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
