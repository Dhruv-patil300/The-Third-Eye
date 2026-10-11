import { NextResponse } from 'next/server';
import { createEvidence, getEvidenceByCase, getStore } from '@/lib/storage';
import { computeSha256 } from '@/lib/evidenceStorage';
import { requireAuth, canUserAccessCase } from '@/lib/auth';
import { recordAuditEvent } from '@/lib/audit';

export async function GET(req: Request) {
  try {
    const auth = requireAuth(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    if (caseId) {
      if (!canUserAccessCase(auth.user, caseId, 'read')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized to view evidence for this case', code: 'FORBIDDEN' },
          { status: 403 }
        );
      }
      return NextResponse.json({ success: true, data: getEvidenceByCase(caseId) });
    }

    // Filter evidence by cases the user is authorized to access
    const allEvidence = getStore().evidence.filter((ev) =>
      canUserAccessCase(auth.user, ev.caseId, 'read')
    );

    return NextResponse.json({ success: true, data: allEvidence });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = requireAuth(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

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

    if (!canUserAccessCase(auth.user, body.caseId, 'write')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to ingest evidence for this case', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    // Genuine cryptographic hash from text/payload
    const extractedText = body.extractedText || '';
    const fileHash = body.fileHash || (extractedText ? computeSha256(extractedText) : computeSha256(body.title + body.sourceDescription));
    const recordedBy = body.recordedBy || auth.user.name || 'System Import';

    const newItem = createEvidence({
      caseId: body.caseId,
      title: body.title,
      evidenceType: body.evidenceType,
      sourceDescription: body.sourceDescription,
      dateReceived: body.dateReceived || new Date().toISOString(),
      eventTime: body.eventTime || new Date().toISOString(),
      recordedBy,
      processingStatus: body.processingStatus || 'processed',
      verificationStatus: body.verificationStatus || 'unverified',
      extractedText,
      originalFileName: body.originalFileName || undefined,
      fileMimeType: body.fileMimeType || undefined,
      fileSize: body.fileSize || Buffer.byteLength(extractedText, 'utf-8'),
      fileHash,
      sourceProvenance: {
        origin: body.sourceDescription || 'Unknown source',
        collector: recordedBy,
        chainOfCustody: [`${recordedBy} [Intake]`, `Vault (${fileHash.substring(0, 15)}...)`],
        collectedAt: body.dateReceived || new Date().toISOString(),
        hash: fileHash,
      },
      relatedEntityIds: body.relatedEntityIds || [],
      relatedEventIds: body.relatedEventIds || [],
      claims: body.claims || [],
    });

    recordAuditEvent({
      caseId: body.caseId,
      actor: `${auth.user.name} (${auth.user.badgeNumber})`,
      action: 'EVIDENCE_INGESTED',
      targetId: newItem.id,
      targetType: 'EvidenceItem',
      details: `Created evidence ${newItem.title} - SHA-256: ${fileHash}`,
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
