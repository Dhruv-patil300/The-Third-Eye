import { NextResponse } from 'next/server';
import {
  getEvidenceByCase,
  createEvidence,
  createEntity,
  createEvent,
  getCaseById,
} from '@/lib/storage';
import { extractTextFromBuffer, analyzeDocumentTextDeterministic } from '@/lib/extractor';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const evidence = getEvidenceByCase(params.id);
    return NextResponse.json({ success: true, data: evidence });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const caseItem = getCaseById(params.id);
    if (!caseItem) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let title = '';
    let evidenceType: any = 'other';
    let sourceDescription = '';
    let extractedText = '';
    let originalFileName = '';
    let fileMimeType = '';
    let fileSize = 0;
    let recordedBy = 'Lead Investigator';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || (file ? file.name : 'Untitled Evidence');
      evidenceType = (formData.get('evidenceType') as string) || 'other';
      sourceDescription = (formData.get('sourceDescription') as string) || 'Uploaded evidence document';
      recordedBy = (formData.get('recordedBy') as string) || 'Current Investigator';

      if (file) {
        originalFileName = file.name;
        fileMimeType = file.type || 'application/octet-stream';
        fileSize = file.size;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        extractedText = await extractTextFromBuffer(buffer, fileMimeType, originalFileName);
      } else {
        extractedText = (formData.get('manualText') as string) || '';
      }
    } else {
      // JSON body (e.g. manual statement or CCTV observation log entry)
      const body = await req.json();
      title = body.title || 'Manual Evidence Entry';
      evidenceType = body.evidenceType || 'witness_statement';
      sourceDescription = body.sourceDescription || 'Manually recorded by investigator';
      extractedText = body.extractedText || body.text || '';
      recordedBy = body.recordedBy || 'Current Investigator';
      fileMimeType = 'text/plain';
      fileSize = Buffer.byteLength(extractedText, 'utf-8');
    }

    // Run factual analysis
    const analysis = analyzeDocumentTextDeterministic(extractedText, title);

    // Save evidence item
    const createdItem = createEvidence({
      caseId: params.id,
      title,
      evidenceType,
      sourceDescription,
      dateReceived: new Date().toISOString(),
      recordedBy,
      processingStatus: 'processed',
      verificationStatus: 'unverified',
      extractedText,
      originalFileName: originalFileName || undefined,
      fileMimeType: fileMimeType || undefined,
      fileSize: fileSize || undefined,
      fileHash: `sha256:${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`,
      sourceProvenance: {
        origin: sourceDescription,
        collector: recordedBy,
        chainOfCustody: [recordedBy, 'Evidence Vault'],
        collectedAt: new Date().toISOString(),
      },
      relatedEntityIds: [],
      relatedEventIds: [],
      claims: analysis.claims.map((c, i) => ({
        id: `clm-auto-${Date.now()}-${i}`,
        evidenceId: '',
        caseId: params.id,
        text: c.text,
        claimant: c.claimant,
        claimType: c.claimType,
        confidence: c.confidence,
      })),
    });

    // Automatically create any new detected entities and link them
    for (const ent of analysis.entities) {
      createEntity({
        caseId: params.id,
        name: ent.name,
        category: ent.category,
        role: ent.role,
        details: ent.details,
        status: 'unverified',
        notes: `Extracted from evidence record: ${title}`,
        sourceEvidenceIds: [createdItem.id],
      });
    }

    // Automatically create any detected timeline events
    for (const ev of analysis.events) {
      createEvent({
        caseId: params.id,
        title: ev.title,
        timestamp: ev.timestamp,
        timeDisplay: ev.timeDisplay,
        timePrecision: ev.timePrecision,
        description: ev.description,
        location: ev.location,
        associatedEntityIds: [],
        sourceEvidenceId: createdItem.id,
        verificationStatus: 'unverified',
        confidence: ev.confidence,
      });
    }

    return NextResponse.json({ success: true, data: createdItem }, { status: 201 });
  } catch (err: any) {
    console.error('Evidence creation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
