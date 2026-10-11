import { NextResponse } from 'next/server';
import {
  getEvidenceByCase,
  createEvidence,
  createEntity,
  createEvent,
  getCaseById,
} from '@/lib/storage';
import { extractTextFromBuffer, analyzeDocumentTextDeterministic } from '@/lib/extractor';
import { computeSha256, savePrivateEvidenceFile } from '@/lib/evidenceStorage';
import { requireCaseAccess } from '@/lib/auth';
import { recordAuditEvent } from '@/lib/audit';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = requireCaseAccess(req, params.id, 'read');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const evidence = getEvidenceByCase(params.id);

    // Audit log access to case evidence
    recordAuditEvent({
      caseId: params.id,
      actor: `${auth.user.name} (${auth.user.badgeNumber})`,
      action: 'EVIDENCE_ACCESSED',
      details: `Retrieved ${evidence.length} evidence records for case ${params.id}`,
    });

    return NextResponse.json({ success: true, data: evidence });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = requireCaseAccess(req, params.id, 'write');
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

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
    let fileHash = '';
    let storagePath: string | undefined = undefined;
    let recordedBy = auth.user.name || 'Lead Investigator';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || (file ? file.name : 'Untitled Evidence');
      evidenceType = (formData.get('evidenceType') as string) || 'other';
      sourceDescription = (formData.get('sourceDescription') as string) || 'Uploaded evidence document';
      recordedBy = (formData.get('recordedBy') as string) || auth.user.name || 'Current Investigator';

      if (file) {
        originalFileName = file.name;
        fileMimeType = file.type || 'application/octet-stream';
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Secure intake: calculate genuine SHA-256 and store in private vault
        const saved = await savePrivateEvidenceFile(params.id, originalFileName, buffer);
        fileHash = saved.fileHash;
        fileSize = saved.byteSize;
        storagePath = saved.storagePath;

        extractedText = await extractTextFromBuffer(buffer, fileMimeType, originalFileName);
      } else {
        extractedText = (formData.get('manualText') as string) || '';
        fileHash = computeSha256(extractedText);
        fileSize = Buffer.byteLength(extractedText, 'utf-8');
      }
    } else {
      // JSON body (e.g. manual statement or CCTV observation log entry)
      const body = await req.json();
      title = body.title || 'Manual Evidence Entry';
      evidenceType = body.evidenceType || 'witness_statement';
      sourceDescription = body.sourceDescription || 'Manually recorded by investigator';
      extractedText = body.extractedText || body.text || '';
      recordedBy = body.recordedBy || auth.user.name || 'Current Investigator';
      fileMimeType = 'text/plain';
      fileSize = Buffer.byteLength(extractedText, 'utf-8');
      // Genuine cryptographic hash of the manual statement text
      fileHash = computeSha256(extractedText);
    }

    // Run factual analysis
    const analysis = analyzeDocumentTextDeterministic(extractedText, title);

    // Save evidence item with real cryptographically verified hash
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
      fileHash, // Genuine SHA-256
      sourceProvenance: {
        origin: sourceDescription,
        collector: recordedBy,
        chainOfCustody: [
          `${recordedBy} [Intake]`,
          `Evidence Vault (${fileHash.substring(0, 15)}...)`,
        ],
        collectedAt: new Date().toISOString(),
        hash: fileHash,
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

    // Record immutable audit event
    recordAuditEvent({
      caseId: params.id,
      actor: `${auth.user.name} (${auth.user.badgeNumber})`,
      action: 'EVIDENCE_INGESTED',
      targetId: createdItem.id,
      targetType: 'EvidenceItem',
      details: `Ingested ${title} (${evidenceType}) - Genuine Digest: ${fileHash}`,
    });

    return NextResponse.json({ success: true, data: createdItem }, { status: 201 });
  } catch (err: any) {
    console.error('Evidence creation error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
