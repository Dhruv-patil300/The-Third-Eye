import { NextResponse } from 'next/server';
import {
  getCaseById,
  getEvidenceByCase,
  getEntitiesByCase,
  getEventsByCase,
  getContradictionsByCase,
  getGapsByCase,
  getAssistantMessages,
  addAssistantMessage,
  addAuditLog,
} from '@/lib/storage';
import { askCaseAssistant } from '@/lib/aiAssistant';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const messages = getAssistantMessages(params.id);
    return NextResponse.json({ success: true, data: messages });
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

    const body = await req.json();
    const query = body.query || body.message;
    const locale = body.locale === 'hi' || body.locale === 'mr' ? body.locale : 'en';
    if (!query) {
      return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    // Save user message
    addAssistantMessage({
      caseId: params.id,
      role: 'user',
      content: query,
    });

    const evidence = getEvidenceByCase(params.id);
    const entities = getEntitiesByCase(params.id);
    const events = getEventsByCase(params.id);
    const contradictions = getContradictionsByCase(params.id);
    const gaps = getGapsByCase(params.id);

    // Call grounded investigation engine
    const response = await askCaseAssistant(
      caseItem,
      evidence,
      entities,
      events,
      contradictions,
      gaps,
      query,
      locale
    );

    // Save assistant message
    const assistantMsg = addAssistantMessage({
      caseId: params.id,
      role: 'assistant',
      content: response.content,
      citations: response.citations,
      suggestedFollowUps: response.suggestedFollowUps,
    });

    addAuditLog(
      params.id,
      'AI_ASSISTANT_QUERY',
      `Investigator queried: "${query.slice(0, 80)}..."`,
      'Investigator & AI'
    );

    return NextResponse.json({
      success: true,
      data: assistantMsg,
    });
  } catch (err: any) {
    console.error('AI assistant route error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
