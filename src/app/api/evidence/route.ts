import { NextResponse } from 'next/server';
import { createEvidence, getEvidenceByCase, getStore } from '@/lib/storage';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    if (caseId) {
      return NextResponse.json({ success: true, data: getEvidenceByCase(caseId) });
    }

    return NextResponse.json({ success: true, data: getStore().evidence });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.caseId || !body.title || !body.evidenceType || !body.sourceDescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'caseId, title, evidenceType, and sourceDescription are required',
        },
        { status: 400 }
      );
    }

    const newItem = createEvidence({
      caseId: body.caseId,
      title: body.title,
      evidenceType: body.evidenceType,
      sourceDescription: body.sourceDescription,
      dateReceived: body.dateReceived || new Date().toISOString(),
      eventTime: body.eventTime || new Date().toISOString(),
      recordedBy: body.recordedBy || 'System Import',
      processingStatus: body.processingStatus || 'processed',
      verificationStatus: body.verificationStatus || 'unverified',
      extractedText: body.extractedText || '',
      originalFileName: body.originalFileName || undefined,
      fileMimeType: body.fileMimeType || undefined,
      fileSize: body.fileSize || undefined,
      fileHash: body.fileHash || undefined,
      sourceProvenance: {
        origin: body.sourceDescription || 'Unknown source',
        collector: body.recordedBy || 'System Import',
        chainOfCustody: [body.recordedBy || 'System Import'],
        collectedAt: body.dateReceived || new Date().toISOString(),
      },
      relatedEntityIds: body.relatedEntityIds || [],
      relatedEventIds: body.relatedEventIds || [],
      claims: body.claims || [],
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
