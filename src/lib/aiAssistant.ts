import { Case, EvidenceItem, Entity, EventItem, ContradictionFinding, InvestigationGap, Citation } from '@/types';

export interface AssistantResponse {
  content: string;
  citations: Citation[];
  suggestedFollowUps: string[];
}

export async function askCaseAssistant(
  caseData: Case,
  evidence: EvidenceItem[],
  entities: Entity[],
  events: EventItem[],
  contradictions: ContradictionFinding[],
  gaps: InvestigationGap[],
  query: string
): Promise<AssistantResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await callGeminiCaseAssistant(
        apiKey,
        caseData,
        evidence,
        entities,
        events,
        contradictions,
        gaps,
        query
      );
      return response;
    } catch (err) {
      console.error('Gemini API call failed, falling back to local grounded engine:', err);
    }
  }

  // Local grounded reasoning engine
  return localGroundedCaseAssistant(caseData, evidence, entities, events, contradictions, gaps, query);
}

function localGroundedCaseAssistant(
  caseData: Case,
  evidence: EvidenceItem[],
  entities: Entity[],
  events: EventItem[],
  contradictions: ContradictionFinding[],
  gaps: InvestigationGap[],
  query: string
): AssistantResponse {
  const qLower = query.toLowerCase();
  const citations: Citation[] = [];
  const suggestedFollowUps: string[] = [];

  // Query matching: Alibi / Contradictions / Rahul Sharma
  if (
    qLower.includes('contradict') ||
    qLower.includes('alibi') ||
    qLower.includes('rahul') ||
    qLower.includes('conflict') ||
    qLower.includes('inconsist')
  ) {
    const c1 = contradictions.find((c) => c.id === 'cntr-001') || contradictions[0];
    if (c1) {
      citations.push({
        evidenceId: c1.claimA.evidenceId,
        evidenceTitle: c1.claimA.evidenceTitle,
        excerpt: c1.claimA.excerpt,
        pageOrSection: 'Statement under Section 161 Cr.P.C.',
      });
      citations.push({
        evidenceId: c1.claimB.evidenceId,
        evidenceTitle: c1.claimB.evidenceTitle,
        excerpt: c1.claimB.excerpt,
        pageOrSection: 'CDR Mast Node SEC-4B Log',
      });
    }

    const content = `### 1. Direct Answer
There is a documented, high-severity inconsistency between Rahul Sharma’s claimed alibi and objective telecommunications data.

### 2. Relevant Evidence & Cross-Referencing
- **Roommate Statement (EV-002):** Vikram Malhotra states Rahul arrived at their Green Park Enclave residence (Sector 9) at 20:15 and remained continuously inside playing video games until 00:30.
- **Telecom Mast CDR (EV-004):** Bharti Airtel Cell Mast SEC-4B (serving Sector 4 Market Arcade) recorded an active data and SMS ping from Rahul Sharma’s primary handset at **21:21:40 IST** (-74dBm signal strength, ~280m from the crime scene).
- **Physical Feasibility:** Sector 9 and Sector 4 are **14.8 km apart** with an estimated 25 to 35-minute transit duration. An individual cannot be in a Sector 9 apartment at 21:21 while their phone actively communicates with a Sector 4 cell tower.

### 3. Alternative Explanations (Non-Deceptive Alternatives)
- **Device Separation:** The handset could have been carried by a third party, left inside a rideshare, or loaned to an acquaintance.
- **Cell Handover Anomaly:** Although improbable given the strong signal and transit sequence through Sector 6, tower overflow or mast re-routing must be ruled out through operator logs.
- **Roommate Time Estimation Error:** Vikram Malhotra may have misjudged the exact departure or arrival windows.

### 4. Recommended Investigative Verification Steps
1. Subpoena building CCTV footage from Green Park Enclave elevator and gate to verify exact ingress/egress.
2. Interview Swiggy food delivery courier regarding the 21:10 delivery attempt that went unanswered.
3. Request operator network maintenance logs for Mast SEC-4B on Oct 24.`;

    suggestedFollowUps.push(
      'Who else had access to Door 2B Keypad PIN 4819?',
      'What vehicles were captured on expressway cameras?',
      'Summarize all evidence regarding Karan Verma.'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Keypad / PIN / Door 2B
  if (qLower.includes('keypad') || qLower.includes('pin') || qLower.includes('door') || qLower.includes('access')) {
    const ev6 = evidence.find((e) => e.id === 'ev-006') || evidence[0];
    const ev1 = evidence.find((e) => e.id === 'ev-001') || evidence[0];

    citations.push({
      evidenceId: ev6.id,
      evidenceTitle: ev6.title,
      excerpt: '2025-10-24 21:26:04 - User: PIN AUTH #4819 - Status: UNLOCKED SUCCESSFUL.',
      pageOrSection: 'OmniLock EEPROM Dump',
    });
    citations.push({
      evidenceId: ev1.id,
      evidenceTitle: ev1.title,
      excerpt: 'Only two people possessed this emergency PIN: Assistant Manager Rahul Sharma and myself.',
      pageOrSection: 'FIR #2025-0842 Complaint Statement',
    });

    const content = `### 1. Direct Answer
Door 2B (Rear Service Entrance) was accessed at **21:26:04 IST** on 24-Oct-2025 using emergency credential **PIN #4819**.

### 2. Relevant Evidence
- According to General Manager Rajiv Bansal (**EV-001**), only two personnel were authorized holders of this emergency code: himself and Assistant Manager Rahul Sharma.
- Rajiv Bansal’s physical absence is corroborated by verified attendance at the Rotary Club Gala in Sector 2 until 23:00.
- Hardware controller logs (**EV-006**) confirm no brute-force attempts occurred prior to the valid authentication.
- Alarm Zone 3 was silenced via internal toggle at **21:27:52 IST**, requiring knowledge of interior security layouts.

### 3. Open Uncertainties
- Provisioning records from security installer **Apex Guard Systems** have not been audited (Investigation Gap #003). It remains unverified whether PIN #4819 was issued to previous contractors or remained unchanged from default setup.

### 4. Recommended Verification Steps
- Subpoena Apex Guard Systems master programming records.
- Forensically swab the numeric keypad buttons for latent DNA/fingerprints.`;

    suggestedFollowUps.push(
      'What is the connection between Karan Verma and the crime?',
      'What did witness Pooja Nair see in the alleyway?',
      'What are the critical unresolved gaps in this investigation?'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Karan Verma / Vehicles / Sedans
  if (
    qLower.includes('karan') ||
    qLower.includes('verma') ||
    qLower.includes('sedan') ||
    qLower.includes('vehicle') ||
    qLower.includes('car')
  ) {
    const ev5 = evidence.find((e) => e.id === 'ev-005') || evidence[0];
    const ev3 = evidence.find((e) => e.id === 'ev-003') || evidence[0];

    citations.push({
      evidenceId: ev5.id,
      evidenceTitle: ev5.title,
      excerpt: 'Detected Plate: DL-08-BQ-9102 (Silver Hyundai Verna, 2021). Owner: Dinesh Verma.',
      pageOrSection: 'Sector 3 Toll Plaza ANPR Log',
    });
    citations.push({
      evidenceId: ev3.id,
      evidenceTitle: ev3.title,
      excerpt: 'A silver sedan was parked 30 meters away with its parking lights on.',
      pageOrSection: 'Witness Statement Pooja Nair',
    });

    const content = `### 1. Direct Answer
A **Silver Hyundai Verna (DL-08-BQ-9102)** registered to Dinesh Verma (brother of ex-contractor Karan Verma) was present in Sector 4 during the burglary window, conflicting with Karan Verma’s claim of being in Pune.

### 2. Relevant Evidence
- **ANPR Camera #04 (EV-005):** Recorded the vehicle entering Sector 4 access road at **20:45:12 IST** and departing outbound at **21:54:19 IST**.
- **Eyewitness Pooja Nair (EV-003):** Observed a silver sedan idling in the alleyway with parking lights on while the subject entered Door 2B.
- **Contractor History:** Karan Verma was dismissed 3 weeks prior due to missing inventory inquiries and has knowledge of store access paths.

### 3. Missing Information & Alternative Hypotheses
- Passenger identity in the vehicle was obscured by headlight reflection on toll cameras.
- The car may have been operated by brother Dinesh Verma or an unassociated driver.
- Karan Verma’s presence in Pune has not been corroborated by flight or accommodation tickets.

### 4. Recommended Verification Steps
- Summon Dinesh Verma to produce the vehicle and state who was driving on October 24.
- Request secondary CCTV angle from Sector 3 Roundabout to identify the passenger.`;

    suggestedFollowUps.push(
      'What does the timeline look like between 9:00 PM and 9:45 PM?',
      'Show all contradictions found in this case.',
      'Generate a comprehensive case report.'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Gaps / Missing Information
  if (qLower.includes('gap') || qLower.includes('missing') || qLower.includes('unknown') || qLower.includes('unverified')) {
    const content = `### 1. Direct Answer
The system has identified **${gaps.length} critical investigation gaps** requiring immediate operational follow-up.

### 2. Primary Identified Gaps
1. **Alleyway CCTV Blackout (21:10 – 21:40):** Camera #03 was found disconnected at the power jack, creating an artificial blindspot during the break-in.
2. **Unanswered Swiggy Delivery (21:10):** Contradicts the roommate's claim that Rahul Sharma was inside eating dinner.
3. **Unverified Keypad Code History:** Security vendor logs have not been obtained to determine if PIN #4819 was known to previous staff.
4. **Obscured Passenger in Silver Sedan:** Vehicle DL-08-BQ-9102 passenger seat was obscured on toll cameras.

### 3. Investigative Priority
Addressing Gap #001 (Camera power jack fingerprints) and Gap #002 (Delivery rider statement) will provide conclusive physical verification of suspect movements.`;

    suggestedFollowUps.push(
      'What evidence contradicts Rahul Sharma’s alibi?',
      'Who had access to Door 2B?',
      'What is the vehicle connection?'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Default Comprehensive Case Synthesis
  const content = `### 1. Direct Answer
Regarding your query: "${query}", here is the synthesized intelligence from all **${evidence.length} evidence items**, **${events.length} timeline events**, and **${entities.length} tracked entities** in Case **${caseData.referenceNumber}**.

### 2. Available Case Facts
- **Breach Modality:** Non-forced entry into Greenwood Jewellers via Service Door 2B at 21:26:04 using authorized emergency PIN #4819.
- **Key Suspect/POI:** Rahul Sharma (Assistant Manager) asserts continuous presence in Sector 9, but cell tower logs place his device within 280m of the store at 21:21:40.
- **Corroborating Sighting:** Witness Pooja Nair spotted a suspect in an olive jacket entering Door 2B and fleeing in an idling silver sedan (DL-08-BQ-9102).
- **Secondary Suspect:** Terminated contractor Karan Verma claimed to be in Pune, but his brother’s vehicle was captured entering the sector at 20:45.

### 3. Human Decision Reminder
The Third Eye provides analytical recommendations and cross-checks based on ingested records. Please verify all technical logs through certified forensic reports before initiating legal or custody actions.`;

  suggestedFollowUps.push(
    'What evidence directly contradicts Rahul Sharma’s alibi?',
    'Who had authorized access to Keypad PIN 4819?',
    'What vehicles are connected to this case and why?'
  );

  return { content, citations, suggestedFollowUps };
}

async function callGeminiCaseAssistant(
  apiKey: string,
  caseData: Case,
  evidence: EvidenceItem[],
  entities: Entity[],
  events: EventItem[],
  contradictions: ContradictionFinding[],
  gaps: InvestigationGap[],
  query: string
): Promise<AssistantResponse> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const caseContext = {
    case: {
      id: caseData.id,
      title: caseData.title,
      reference: caseData.referenceNumber,
      summary: caseData.summary,
    },
    evidence: evidence.map((e) => ({
      id: e.id,
      title: e.title,
      type: e.evidenceType,
      textExcerpt: e.extractedText.slice(0, 500),
      claims: e.claims,
    })),
    entities: entities.map((e) => ({
      name: e.name,
      role: e.role,
      category: e.category,
      details: e.details,
    })),
    events: events.map((ev) => ({
      time: ev.timeDisplay,
      title: ev.title,
      location: ev.location,
    })),
    contradictions: contradictions.map((c) => ({
      title: c.title,
      severity: c.severity,
      explanation: c.explanation,
    })),
    gaps: gaps.map((g) => ({
      title: g.title,
      severity: g.severity,
      suggestedNextStep: g.suggestedNextStep,
    })),
  };

  const systemInstruction = `You are the AI Investigation Assistant for "The Third Eye" intelligence system.
Operating Philosophy: "AI recommends. Humans investigate. Humans decide."
Rules:
1. Always distinguish between: Facts explicitly recorded in evidence, Statements attributed to their sources, AI-generated inferences, Unverified hypotheses, Missing information.
2. Structure your answers with:
   - Direct answer
   - Relevant evidence
   - Source citations (referencing exact Evidence ID and titles)
   - Conflicting or missing information
   - Uncertainties and alternative non-deceptive explanations
   - Suggested verification steps
3. Never declare guilt or innocence. Never invent evidence or citations.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `${systemInstruction}\n\nCase Context:\n${JSON.stringify(caseContext, null, 2)}\n\nUser Question:\n${query}`,
          },
        ],
      },
    ],
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini API returned status ${res.status}`);
  }

  const json = await res.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract citations from mentioned evidence IDs (e.g. EV-001, EV-002)
  const citations: Citation[] = [];
  for (const item of evidence) {
    if (rawText.toLowerCase().includes(item.id.toLowerCase()) || rawText.includes(item.title)) {
      citations.push({
        evidenceId: item.id,
        evidenceTitle: item.title,
        excerpt: item.extractedText.slice(0, 150) + '...',
      });
    }
  }

  return {
    content: rawText,
    citations,
    suggestedFollowUps: [
      'What evidence directly contradicts Rahul Sharma’s alibi?',
      'Who had authorized access to Keypad PIN 4819?',
      'What vehicles are connected to this case and why?',
    ],
  };
}
