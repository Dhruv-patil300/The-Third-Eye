import { NextResponse } from 'next/server';
import { resetStorage } from '@/lib/storage';

export async function POST() {
  try {
    const store = resetStorage();
    return NextResponse.json({
      success: true,
      message: 'System database successfully reset to demonstration case benchmark.',
      casesCount: store.cases.length,
      evidenceCount: store.evidence.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
