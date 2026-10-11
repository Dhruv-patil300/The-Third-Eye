import { NextResponse } from 'next/server';
import { getGapsByCase, updateGap, getStore, saveStore } from '@/lib/storage';
import { InvestigationGap } from '@/types';

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

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const store = getStore();
    const newGap: InvestigationGap = {
      id: `gap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseId: params.id,
      title: body.title || 'Untitled Gap',
      category: body.category || 'missing_record',
      severity: body.severity || 'moderate',
      description: body.description || '',
      whyItMatters: body.whyItMatters || '',
      whatIsUnknown: body.whatIsUnknown || '',
      relatedEvidenceIds: body.relatedEvidenceIds || [],
      relatedEntityIds: body.relatedEntityIds || [],
      suggestedNextStep: body.suggestedNextStep || '',
      status: 'open',
      createdAt: now,
      updatedAt: now,
    };
    store.gaps.unshift(newGap);
    saveStore(store);
    return NextResponse.json({ success: true, data: newGap }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
