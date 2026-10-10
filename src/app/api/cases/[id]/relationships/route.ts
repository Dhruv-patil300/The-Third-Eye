import { NextResponse } from 'next/server';
import { getRelationshipsByCase, createRelationship } from '@/lib/storage';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const list = getRelationshipsByCase(params.id);
    return NextResponse.json({ success: true, data: list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!body.sourceEntityId || !body.targetEntityId || !body.relationshipType) {
      return NextResponse.json(
        { success: false, error: 'Source, target, and relationship type are required' },
        { status: 400 }
      );
    }

    const created = createRelationship({
      caseId: params.id,
      sourceEntityId: body.sourceEntityId,
      targetEntityId: body.targetEntityId,
      relationshipType: body.relationshipType,
      label: body.label || body.relationshipType,
      description: body.description || '',
      supportingEvidenceIds: body.supportingEvidenceIds || [],
      verificationStatus: body.verificationStatus || 'unverified',
      confidence: body.confidence ?? 0.8,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
