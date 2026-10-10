import { NextResponse } from 'next/server';
import { getGapsByCase, updateGap } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const list = getGapsByCase(params.id);
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Gap ID is required' }, { status: 400 });
    }

    const updated = updateGap(body.id, body.updates || body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Gap not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
