import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Secure private evidence directory outside of public web root
function getBaseUploadDir(): string {
  // If running on Vercel or read-only serverless environment, use /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'the-third-eye-evidence');
  }
  // Otherwise use local private uploads folder
  return path.join(process.cwd(), 'private_storage', 'evidence');
}

/**
 * Computes genuine SHA-256 cryptographic digest of raw byte content
 */
export function computeSha256(data: Buffer | string): string {
  const hash = crypto.createHash('sha256');
  if (typeof data === 'string') {
    hash.update(data, 'utf-8');
  } else {
    hash.update(data);
  }
  return `sha256:${hash.digest('hex')}`;
}

/**
 * Sanitizes input filename to prevent directory traversal or malicious characters
 */
export function sanitizeFileName(rawName: string): string {
  // Strip paths, null bytes, and keep only safe alphanumeric/dots/dashes/underscores
  const base = path.basename(rawName).replace(/[^a-zA-Z0-9._-]/g, '_');
  return base || `evidence_${Date.now()}.bin`;
}

/**
 * Securely writes evidence file to private vault and returns metadata + real SHA-256
 */
export async function savePrivateEvidenceFile(
  caseId: string,
  originalFileName: string,
  buffer: Buffer
): Promise<{
  storagePath: string;
  fileHash: string;
  byteSize: number;
  safeName: string;
}> {
  const baseDir = getBaseUploadDir();
  const safeCaseId = caseId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const targetDir = path.join(baseDir, safeCaseId);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const safeName = `${Date.now()}_${sanitizeFileName(originalFileName)}`;
  const fullPath = path.join(targetDir, safeName);

  // Compute real hash from actual bytes
  const fileHash = computeSha256(buffer);
  const byteSize = buffer.length;

  // Write file securely
  fs.writeFileSync(fullPath, buffer);

  return {
    storagePath: fullPath,
    fileHash,
    byteSize,
    safeName,
  };
}

/**
 * Verifies that the file on disk still matches its original cryptographic intake hash
 */
export function verifyFileIntegrity(fullPath: string, expectedHash: string): {
  intact: boolean;
  computedHash: string;
  error?: string;
} {
  try {
    if (!fs.existsSync(fullPath)) {
      return { intact: false, computedHash: '', error: 'File not found on storage vault' };
    }
    const buffer = fs.readFileSync(fullPath);
    const computedHash = computeSha256(buffer);
    return {
      intact: computedHash === expectedHash,
      computedHash,
    };
  } catch (err: any) {
    return { intact: false, computedHash: '', error: err.message };
  }
}

/**
 * Safely reads evidence file bytes with path validation
 */
export function readPrivateEvidenceFile(fullPath: string): Buffer | null {
  try {
    const baseDir = getBaseUploadDir();
    const resolved = path.resolve(fullPath);
    // Ensure file is within baseDir to prevent path traversal
    if (!resolved.startsWith(path.resolve(baseDir))) {
      console.error('Security alert: Path traversal attempt blocked in readPrivateEvidenceFile:', fullPath);
      return null;
    }
    if (!fs.existsSync(resolved)) {
      return null;
    }
    return fs.readFileSync(resolved);
  } catch (err) {
    console.error('Error reading evidence file:', err);
    return null;
  }
}
