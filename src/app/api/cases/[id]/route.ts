import { NextResponse } from 'next/server';
import { getCaseById, updateCase, deleteCase } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = getCaseById(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateCase(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteCase(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Case deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
