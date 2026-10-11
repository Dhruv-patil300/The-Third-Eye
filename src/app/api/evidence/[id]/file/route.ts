import { NextResponse } from 'next/server';
import { getEvidenceItem } from '@/lib/storage';
import { readPrivateEvidenceFile, verifyFileIntegrity } from '@/lib/evidenceStorage';
import { requireAuth, canUserAccessCase } from '@/lib/auth';
import { recordAuditEvent } from '@/lib/audit';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(req);
    if ('errorResponse' in auth) {
      return auth.errorResponse;
    }

    const item = getEvidenceItem(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Evidence record not found' }, { status: 404 });
    }

    if (!canUserAccessCase(auth.user, item.caseId, 'read')) {
      recordAuditEvent({
        caseId: item.caseId,
        actor: `${auth.user.name} (${auth.user.badgeNumber})`,
        action: 'AUTHORIZATION_DENIED',
        details: `Denied file access to evidence ${item.id}`,
        outcome: 'DENIED',
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized to access evidence in this case', code: 'FORBIDDEN' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const verifyOnly = searchParams.get('verify') === 'true';

    // If verification requested
    if (verifyOnly) {
      const storagePath = (item as any).storagePath;
      if (!storagePath) {
        return NextResponse.json({
          success: true,
          data: {
            evidenceId: item.id,
            verified: true,
            method: 'Textual Digest Corroboration',
            fileHash: item.fileHash,
          },
        });
      }
      const integrity = verifyFileIntegrity(storagePath, item.fileHash || '');
      recordAuditEvent({
        caseId: item.caseId,
        actor: `${auth.user.name} (${auth.user.badgeNumber})`,
        action: 'EVIDENCE_HASH_VERIFIED',
        details: `Integrity check for ${item.id}: ${integrity.intact ? 'PASSED' : 'COMPROMISED'}`,
      });
      return NextResponse.json({
        success: true,
        data: {
          evidenceId: item.id,
          verified: integrity.intact,
          computedHash: integrity.computedHash,
          storedHash: item.fileHash,
          error: integrity.error,
        },
      });
    }

    // Read file bytes
    const storagePath = (item as any).storagePath;
    if (!storagePath) {
      // If textual evidence, stream text content
      return new Response(item.extractedText || '', {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${item.originalFileName || 'evidence.txt'}"`,
        },
      });
    }

    const buffer = readPrivateEvidenceFile(storagePath);
    if (!buffer) {
      return NextResponse.json({ success: false, error: 'Evidence file not found in storage vault' }, { status: 404 });
    }

    recordAuditEvent({
      caseId: item.caseId,
      actor: `${auth.user.name} (${auth.user.badgeNumber})`,
      action: 'EVIDENCE_DOWNLOADED',
      details: `Downloaded file for ${item.title} (${item.id})`,
    });

    const contentType = item.fileMimeType || 'application/octet-stream';
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${item.originalFileName || 'evidence_download.bin'}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
