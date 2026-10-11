import { NextResponse } from 'next/server';
import { getContradictionsByCase, updateContradiction, getStore, saveStore } from '@/lib/storage';
import { ContradictionFinding } from '@/types';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const list = getContradictionsByCase(params.id);
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Contradiction ID is required' }, { status: 400 });
    }

    const updated = updateContradiction(body.id, body.updates || body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Contradiction not found' }, { status: 404 });
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
    const newContradiction: ContradictionFinding = {
      id: `cntr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      caseId: params.id,
      title: body.title || 'Untitled Inconsistency',
      severity: body.severity || 'medium',
      category: body.category || 'statement_inconsistency',
      claimA: body.claimA || { evidenceId: '', evidenceTitle: 'Statement A', excerpt: body.claimAText || '', speakerOrSource: body.claimASpeaker || 'Unknown' },
      claimB: body.claimB || { evidenceId: '', evidenceTitle: 'Statement B', excerpt: body.claimBText || '', speakerOrSource: body.claimBSpeaker || 'Unknown' },
      explanation: body.explanation || '',
      alternativeExplanations: body.alternativeExplanations || [],
      suggestedVerificationSteps: body.suggestedVerificationSteps || [],
      reviewStatus: 'unreviewed',
      investigatorNotes: '',
      updatedAt: now,
    };
    store.contradictions.unshift(newContradiction);
    saveStore(store);
    return NextResponse.json({ success: true, data: newContradiction }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
