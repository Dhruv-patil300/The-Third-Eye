import { Case, EvidenceItem, Entity, EventItem, ContradictionFinding, InvestigationGap, Citation } from '@/types';
import { DEMO_CASE_ID } from './demoData';

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
  query: string,
  locale: 'en' | 'hi' | 'mr' = 'en'
): Promise<AssistantResponse> {
  if (locale !== 'en' || (caseData.id !== DEMO_CASE_ID && evidence.length === 0)) {
    return summarizeCaseRecord(caseData, evidence, query, locale);
  }

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
  if (caseData.id !== DEMO_CASE_ID) {
    return summarizeCaseRecord(caseData, evidence, query);
  }

  const qLower = query.toLowerCase();
  const citations: Citation[] = [];
  const suggestedFollowUps: string[] = [];

  // Query matching: Alibi / Contradictions / Sachin Gaikwad / Vikram
  if (
    qLower.includes('contradict') ||
    qLower.includes('alibi') ||
    qLower.includes('sachin') ||
    qLower.includes('gaikwad') ||
    qLower.includes('conflict') ||
    qLower.includes('inconsist')
  ) {
    const c1 = contradictions.find((c) => c.id === 'cntr-001') || contradictions[0];
    if (c1) {
      citations.push({
        evidenceId: c1.claimA.evidenceId,
        evidenceTitle: c1.claimA.evidenceTitle,
        excerpt: c1.claimA.excerpt,
        pageOrSection: 'Statement under Section 161 Cr.P.C. / BNSS',
      });
      citations.push({
        evidenceId: c1.claimB.evidenceId,
        evidenceTitle: c1.claimB.evidenceTitle,
        excerpt: c1.claimB.excerpt,
        pageOrSection: 'Reliance Jio LSA CDR Wakad Mast 404-869-38291',
      });
    }

    const content = `### 1. Direct Investigation Assessment
There is a documented, high-severity inconsistency between **Sachin Gaikwad’s claimed dinner alibi in Pimple Saudagar** and objective telecommunication / traffic telemetry records.

### 2. Relevant Evidence & Cross-Referencing
- **Sworn Roommate Statement (EV-002):** Vikram Patwardhan asserts that Sachin Gaikwad remained seated continuously with him inside Govind Garden Restaurant, Pimple Saudagar from 21:20 to 22:45 IST.
- **Telecom Tower CDR (EV-004):** Reliance Jio Cell Mast (CellID: 404-869-38291 Wakad Datta Mandir) recorded active 4G data packet acknowledgment from Gaikwad's primary handset at **22:19:34 IST** with a -72dBm direct line-of-sight signal (~220m from Kothari Jewellers vault).
- **Physical Feasibility Delta:** Pimple Saudagar and Datta Mandir Road, Wakad are **6.8 km apart** across the Mula River. In typical Friday evening traffic, transit requires 20 to 25 minutes. It is physically impossible to be seated continuously in Pimple Saudagar while an active mobile device pings the Wakad cell mast at 22:19.
- **Traffic ANPR Confirmation (EV-003):** PCMC Smart City Camera Pole #WK-44 at Dange Chowk captured Gaikwad’s white Creta (MH-14-GX-8842) heading westbound at 22:36:12 IST.

### 3. Non-Deceptive Alternative Hypotheses Considered
- **Handset Loan / Mule:** Handset carried by an accomplice while Gaikwad stayed back (contradicted by restaurant owner statement that second patron left abruptly at 21:35).
- **RF Boundary Bounce:** Mast propagation bounce across the river (ruled out due to -72dBm signal strength and subsequent sector handover at Hinjawadi).

### 4. Recommended Police Actions for IO Sr. PI Vitthal More
1. Seize full digital DVR recordings from Govind Garden Restaurant and Kokane Chowk junction.
2. Issue formal notice to Royal Palms housing society for basement gate boom-barrier timestamps.
3. Apply for custodial interrogation remand under Section 187 BNSS based on fabricated alibi.`;

    suggestedFollowUps.push(
      'What connects ex-guard Nilesh Shinde to the crime scene?',
      'Track movement of Hyundai Creta MH-14-GX-8842 from Wakad to Somatane.',
      'Who had authorized access to Door 2B Keypad PIN 7291?'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Keypad / PIN / Door 2B / Access
  if (qLower.includes('keypad') || qLower.includes('pin') || qLower.includes('door') || qLower.includes('access') || qLower.includes('7291')) {
    const ev5 = evidence.find((e) => e.id === 'ev-005') || evidence[0];
    const ev1 = evidence.find((e) => e.id === 'ev-001') || evidence[0];

    citations.push({
      evidenceId: ev5.id,
      evidenceTitle: ev5.title,
      excerpt: '2025-10-24 22:18:02 - User Auth Event: EMERGENCY PIN ENTRY [#7291] - MATCH CONFIRMED.',
      pageOrSection: 'OmniLock EEPROM Dump',
    });
    citations.push({
      evidenceId: ev1.id,
      evidenceTitle: ev1.title,
      excerpt: 'Only two individuals possessed this confidential emergency master code: myself and Store Operations Manager Sachin Gaikwad.',
      pageOrSection: 'FIR #0389/2025 Statement',
    });

    const content = `### 1. Direct Answer
Door 2B (Rear Service Entrance) at Kothari Jewellers was unlocked at **22:18:02 IST** on 24-Oct-2025 using emergency credential **PIN #7291**.

### 2. Relevant Forensic Records
- Complainant Rajesh Kothari (**EV-001**) confirmed only two people knew this confidential emergency PIN: himself and Operations Manager Sachin Gaikwad.
- Rajesh Kothari’s physical absence is corroborated by verified attendance at the Rotary Club meeting in Hinjawadi Marriott until 23:30.
- Hardware controller logs (**EV-005**) confirm **zero brute-force failed attempts**. The code was entered correctly on the first attempt.
- Zone 4 Vault Sensor was silenced via internal toggle switch at **22:20:14 IST**, proving internal knowledge of security wiring.

### 3. Open Uncertainties
- Security vendor (OmniLock Pune Office, Shivajinagar) provisioning records have not yet been audited (**Investigation Gap #003**) to rule out default PIN leaks.

### 4. Recommended Action
- Serve notice under Sec 91 CrPC / BNSS on OmniLock Pune Regional Office for original installation engineer records.`;

    suggestedFollowUps.push(
      'What connects ex-guard Nilesh Shinde to the crime scene?',
      'Show ANPR and FASTag tracking of White Creta MH-14-GX-8842.',
      'What are the critical unresolved gaps in this case?'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Nilesh Shinde / Bhosari / Fingerprint
  if (qLower.includes('nilesh') || qLower.includes('shinde') || qLower.includes('fingerprint') || qLower.includes('bhosari')) {
    const ev6 = evidence.find((e) => e.id === 'ev-006') || evidence[0];
    const ev4 = evidence.find((e) => e.id === 'ev-004') || evidence[0];

    citations.push({
      evidenceId: ev6.id,
      evidenceTitle: ev6.title,
      excerpt: 'Latent finger ridge specimen Q-4 lifted from Safe Box #4 handle matches 14 ridge characteristics of suspect Nilesh Baban Shinde.',
      pageOrSection: 'FSL Pune Panchnama Report',
    });
    citations.push({
      evidenceId: ev4.id,
      evidenceTitle: ev4.title,
      excerpt: '22:24:05 IST: Outgoing voice call (38 sec) from Gaikwad to +91-97640-11209 (Nilesh Shinde).',
      pageOrSection: 'Reliance Jio CDR Telemetry',
    });

    const content = `### 1. Direct Answer
Ex-security guard **Nilesh Baban Shinde** (Resident of Indrayani Nagar, Bhosari MIDC) is forensically and digitally linked to the vault heist:

### 2. Forensic & Telecommunication Corroboration
- **Latent Fingerprint Match (EV-006):** FSL Pune identified 14 ridge characteristics on latent print Q-4 lifted from Safe Box #4 handle matching Nilesh Shinde’s biometric record on file at Bhosari PS (Crime No. 214/2023).
- **Direct Phone Communication (EV-004):** Suspect Sachin Gaikwad initiated a 38-second voice call to Nilesh Shinde at **22:24:05 IST** (six minutes after the rear door opened), directly disproving Gaikwad’s claim that they had not spoken in six months.
- **Motorcycle Movement:** Traffic camera feeds captured Shinde’s Yamaha FZ (MH-14-FA-5120) crossing Bhumkar Chowk toward Hinjawadi Phase 2 carrying an unidentified pillion with a heavy dark bag at 22:42 IST.

### 3. Recommended Action
- Crime Branch Unit 2 to conduct search and seizure at Shinde's Bhosari residence for recovery of stolen diamonds and weapon under Sec 27 Evidence Act / Sec 23 BSA.`;

    suggestedFollowUps.push(
      'Track movement of Hyundai Creta MH-14-GX-8842 from Wakad to Somatane.',
      'Show evidence directly disproving Sachin Gaikwad’s alibi.',
      'Generate a comprehensive prosecution case brief.'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Vehicles / Creta / FASTag / ANPR
  if (
    qLower.includes('creta') ||
    qLower.includes('vehicle') ||
    qLower.includes('car') ||
    qLower.includes('anpr') ||
    qLower.includes('fastag') ||
    qLower.includes('somatane')
  ) {
    const ev3 = evidence.find((e) => e.id === 'ev-003') || evidence[0];
    const ev8 = evidence.find((e) => e.id === 'ev-008') || evidence[0];

    citations.push({
      evidenceId: ev3.id,
      evidenceTitle: ev3.title,
      excerpt: '22:36:12 IST: Plate MH-14-GX-8842 (White Hyundai Creta) captured moving westbound past Dange Chowk Pole #WK-44.',
      pageOrSection: 'PCMC Smart City ANPR Feed',
    });
    citations.push({
      evidenceId: ev8.id,
      evidenceTitle: ev8.title,
      excerpt: '23:14:22 IST: Somatane Toll Plaza Lane 04 outbound transaction confirmed via FASTag.',
      pageOrSection: 'NHAI FASTag Telemetry',
    });

    const content = `### 1. Direct Answer
**White Hyundai Creta (MH-14-GX-8842)**, registered to Sachin Gaikwad, served as the primary getaway vehicle from Wakad:

### 2. Verified Optical & Telemetry Transit Chain
- **22:36:12 IST (Dange Chowk - EV-003):** PCMC Smart City ANPR Pole #WK-44 photographed the Creta speeding west toward Hinjawadi. Driver was wearing a blue collared shirt matching Gaikwad’s attire.
- **22:58:40 IST (Bhumkar Chowk - EV-003):** Re-detected turning onto the Mumbai-Bengaluru Highway bypass.
- **23:14:22 IST (Somatane Toll Plaza - EV-008):** NHAI FASTag transaction cleared at Lane 04, establishing exit onto the Mumbai-Pune Expressway outbound corridor.

### 3. Critical Unexplained Period (**Gap #001**)
- The vehicle took **22 minutes** to travel between Dange Chowk and Bhumkar Chowk (normally an 8-minute drive), suggesting a rendezvous stop in Tathawade or Hinjawadi Phase 1 to transfer stolen booty.`;

    suggestedFollowUps.push(
      'What evidence directly contradicts Sachin Gaikwad’s alibi?',
      'What connects ex-guard Nilesh Shinde to the crime scene?',
      'Summarize all investigation gaps remaining.'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Gaps / Missing Information
  if (qLower.includes('gap') || qLower.includes('missing') || qLower.includes('unknown') || qLower.includes('unverified')) {
    const content = `### 1. Direct Answer
The Third Eye has identified **${gaps.length} critical investigation gaps** requiring immediate operational follow-up by PCPC officers:

### 2. High-Priority Gaps
1. **Unaccounted 22-Minute Window for Creta MH-14-GX-8842:** Between Dange Chowk (22:36) and Bhumkar Chowk (22:58). Potential booty offloading point in Tathawade.
2. **Unidentified Pillion on Yamaha FZ (MH-14-FA-5120):** Spotted heading toward Hinjawadi Phase 2 carrying a dark rucksack at 22:42.
3. **OmniLock Master PIN Provisioning Audit:** Pending formal response from security vendor Pune office in Shivajinagar.
4. **Missing Municipal CCTV Pole WK-42:** Datta Mandir rear lane camera was down due to PCMC road digging; private pharmacy DVRs must be seized.

### 3. Immediate Action Plan
Dispatch team to HP Petrol Pump Tathawade for commercial CCTV retrieval, and alert Highway Police at Urse Toll Plaza.`;

    suggestedFollowUps.push(
      'Show evidence directly disproving Sachin Gaikwad’s alibi?',
      'Track movement of Hyundai Creta MH-14-GX-8842.',
      'Show all contradictions found in this case.'
    );

    return { content, citations, suggestedFollowUps };
  }

  // Default Comprehensive Case Synthesis
  const content = `### 1. Direct Investigation Synthesis
Regarding your query: "${query}", here is the synthesized intelligence from all **${evidence.length} evidence items**, **${events.length} timeline events**, and **${entities.length} tracked entities** in **Case ${caseData.referenceNumber}** (Kothari Jewellers Vault Breach, Wakad PS).

### 2. Core Case Findings
- **Breach Modality:** Rear Service Door 2B opened at 22:18:02 IST via valid emergency PIN #7291 without physical force, followed by internal alarm cutoff.
- **Key Suspect:** Sachin Suresh Gaikwad (Store Operations Manager) claimed he was dining at Govind Garden, Pimple Saudagar, but Reliance Jio Cell Mast (Wakad Datta Mandir) and PCMC Smart City ANPR (Dange Chowk) place him and his car directly at the scene.
- **Accomplice Identification:** FSL Pune identified latent prints of ex-guard Nilesh Shinde on Vault Safe Box #4; Gaikwad called Shinde for 38 seconds during the heist.
- **Getaway Vector:** White Creta MH-14-GX-8842 passed Dange Chowk (22:36) and Somatane Toll Plaza (23:14) heading towards Mumbai.

### 3. Statutory Reminder
*The Third Eye generates analytical recommendations for Investigating Officers. Formal chargesheets and arrests require certified Section 65B/BNSS certificate compliance from telecom nodal officers and FSL Pune.*`;

  suggestedFollowUps.push(
    'Show evidence directly disproving Sachin Gaikwad’s alibi.',
    'What connects ex-guard Nilesh Shinde to the crime scene?',
    'Track movement of Hyundai Creta MH-14-GX-8842 from Wakad to Somatane.'
  );

  return { content, citations, suggestedFollowUps };
}

const translatedDemoCases: Record<string, Record<'hi' | 'mr', { title: string; summary: string }>> = {
  'case-pcmc-demo-2026-01': {
    hi: {
      title: 'गुम हुई कार्य फ़ाइल | पिंपरी बाज़ार',
      summary: 'काल्पनिक प्रस्तुति परिदृश्य: बाज़ार आने के बाद एक यात्री को सामान्य कामकाजी कागज़ों वाली फ़ाइल नहीं मिलती। इसमें कोई कीमती वस्तु या पहचान दस्तावेज़ नहीं है। यह रिकॉर्ड शिकायत दर्ज करने, स्थान की जाँच और वस्तु लौटने की स्थिति दर्ज करने का नमूना है।',
    },
    mr: {
      title: 'हरवलेली कामाची फाइल | पिंपरी बाजार',
      summary: 'काल्पनिक सादरीकरण प्रसंग: बाजारात भेट दिल्यानंतर एका प्रवाशाची नियमित कामाची कागदपत्रे असलेली फाइल हरवते. त्यात मौल्यवान वस्तू किंवा ओळखपत्र नाही. ही नोंद तक्रार नोंदणी, ठिकाणाची चौकशी आणि वस्तू परत मिळाल्याची स्थिती दाखवणारा नमुना आहे.',
    },
  },
  'case-pcmc-demo-2026-02': {
    hi: {
      title: 'बिना चोट की मामूली टक्कर | वाकड सर्विस रोड',
      summary: 'काल्पनिक प्रस्तुति परिदृश्य: हल्की बारिश में कम गति से हुई टक्कर की सूचना दो वाहन चालक देते हैं। किसी के घायल होने की सूचना नहीं है। यह तटस्थ विवरण, पास के कैमरे की फुटेज माँगने और दोष तय किए बिना आगे की कार्रवाई दर्ज करने का नमूना है।',
    },
    mr: {
      title: 'किरकोळ बिन-दुखापत धडक | वाकड सर्व्हिस रोड',
      summary: 'काल्पनिक सादरीकरण प्रसंग: हलक्या पावसात कमी वेगाने झालेल्या धडकेची माहिती दोन वाहनचालक देतात. कोणालाही दुखापत झाल्याची नोंद नाही. हा तटस्थ नोंद, जवळील कॅमेऱ्याचे चित्रण मागवणे आणि दोष न ठरवता पुढील स्थिती नोंदवण्याचा नमुना आहे.',
    },
  },
  'case-pcmc-demo-2026-03': {
    hi: {
      title: 'साझे पार्किंग मार्ग की पूछताछ | थेरगाँव',
      summary: 'काल्पनिक प्रस्तुति परिदृश्य: निवासी साझा पार्किंग मार्ग में बार-बार रुकावट की जानकारी दर्ज कराने में सहायता माँगते हैं। किसी व्यक्ति पर आरोप नहीं है। यह तटस्थ टिप्पणियाँ, संपर्क के प्रयास और सामुदायिक समाधान के लिए भेजने की प्रक्रिया का नमूना है।',
    },
    mr: {
      title: 'सामायिक पार्किंग मार्गाबाबत चौकशी | थेरगाव',
      summary: 'काल्पनिक सादरीकरण प्रसंग: सामायिक पार्किंग मार्गात वारंवार अडथळा होत असल्याची नोंद करण्यासाठी रहिवासी मदत मागतात. कोणत्याही व्यक्तीवर आरोप नाही. ही तटस्थ नोंद, संपर्काचे प्रयत्न आणि सामुदायिक तोडग्यासाठी संदर्भ देण्याची नमुना प्रक्रिया आहे.',
    },
  },
  'case-pcmc-demo-2026-04': {
    hi: {
      title: 'खोई वस्तु की पूछताछ | चिंचवड़ स्टेशन',
      summary: 'काल्पनिक प्रस्तुति परिदृश्य: एक यात्री प्रतीक्षास्थल के पास किताब और छतरी वाला पुन: उपयोग योग्य थैला छोड़ने की सूचना देता है। इसमें पहचान दस्तावेज़ या कीमती वस्तु नहीं है। यह खोई वस्तु की पूछताछ और परिवहन सहायता डेस्क से संपर्क का नमूना है; कोई वास्तविक व्यक्ति या शिकायत इसमें शामिल नहीं है।',
    },
    mr: {
      title: 'हरवलेल्या वस्तूबाबत चौकशी | चिंचवड स्थानक',
      summary: 'काल्पनिक सादरीकरण प्रसंग: प्रतीक्षास्थळाजवळ पुस्तक आणि छत्री असलेली पुन्हा वापरता येणारी पिशवी राहिल्याची माहिती एक प्रवासी देतो. त्यात ओळखपत्र किंवा मौल्यवान वस्तू नाही. ही हरवलेल्या वस्तूबाबत चौकशी आणि वाहतूक मदत कक्षाशी संपर्क करण्याची नमुना प्रक्रिया आहे; कोणतीही खरी व्यक्ती किंवा तक्रार यात दर्शवलेली नाही.',
    },
  },
};

function summarizeCaseRecord(caseData: Case, evidence: EvidenceItem[], query: string, locale: 'en' | 'hi' | 'mr' = 'en'): AssistantResponse {
  const citations: Citation[] = evidence.slice(0, 3).map((item) => ({
    evidenceId: item.id,
    evidenceTitle: item.title,
    excerpt: item.claims[0]?.text || item.extractedText.slice(0, 220) || item.sourceDescription,
    pageOrSection: item.sourceProvenance.origin,
  }));
  const isIllustrative = caseData.tags.includes('Illustrative Demo');
  const localizedDemo = locale === 'en' ? undefined : translatedDemoCases[caseData.id]?.[locale];
  const caseTitle = localizedDemo?.title || caseData.title;
  const caseSummary = localizedDemo?.summary || caseData.summary;
  const content = locale === 'hi'
    ? [
        `केस: ${caseTitle}`,
        `${localizedDemo ? 'विवरण' : 'केस का मूल विवरण (मूल भाषा में)'}: ${caseSummary}`,
        isIllustrative ? 'यह केवल काल्पनिक प्रस्तुति परिदृश्य है, वास्तविक शिकायत या एफआईआर नहीं।' : '',
        evidence.length === 0
          ? 'इस केस में अभी कोई साक्ष्य रिकॉर्ड संलग्न नहीं है। इसलिए समयरेखा या निष्कर्ष की पुष्टि नहीं की जा सकती। साक्ष्य-आधारित समीक्षा से पहले स्रोत रिकॉर्ड जोड़ें।'
          : `इस केस में ${evidence.length} साक्ष्य रिकॉर्ड संलग्न हैं। स्रोत अंश समीक्षा के लिए नीचे दिए गए हैं; केवल रिकॉर्ड का होना किसी निष्कर्ष को सिद्ध नहीं करता।`,
        `आपका प्रश्न: ${query}`,
        'किसी भी आकलन को जिम्मेदार जाँच अधिकारी द्वारा मूल रिकॉर्ड से सत्यापित किया जाना चाहिए।',
      ].filter(Boolean).join('\n\n')
    : locale === 'mr'
      ? [
          `केस: ${caseTitle}`,
          `${localizedDemo ? 'तपशील' : 'केसचा मूळ तपशील (मूळ भाषेत)'}: ${caseSummary}`,
          isIllustrative ? 'हा केवळ काल्पनिक सादरीकरण प्रसंग आहे; खरी तक्रार किंवा एफआयआर नाही.' : '',
          evidence.length === 0
            ? 'या केसमध्ये अद्याप कोणताही पुरावा नोंद जोडलेली नाही. त्यामुळे घटनाक्रम किंवा निष्कर्षाची पुष्टी करता येत नाही. पुरावा-आधारित पुनरावलोकनापूर्वी स्रोत नोंदी जोडा.'
            : `या केसमध्ये ${evidence.length} पुरावा नोंदी जोडलेल्या आहेत. स्रोत उतारे पुनरावलोकनासाठी खाली दिले आहेत; केवळ नोंद असणे निष्कर्ष सिद्ध करत नाही.`,
          `तुमचा प्रश्न: ${query}`,
          'कोणतेही मूल्यांकन जबाबदार तपास अधिकाऱ्याने मूळ नोंदींशी पडताळावे.',
        ].filter(Boolean).join('\n\n')
      : [
          caseTitle,
          caseSummary,
          isIllustrative ? 'This is a fictional presentation scenario, not a real complaint or FIR.' : '',
          evidence.length === 0
            ? 'No evidence items are attached to this case yet, so I cannot verify a timeline, identify a person, or draw a finding. Add source records before asking for an evidence-based assessment.'
            : `The case currently contains ${evidence.length} evidence record${evidence.length === 1 ? '' : 's'}. The attached source excerpts are listed below for review; their presence alone does not establish a conclusion.`,
          `Your question: ${query}`,
          'Any assessment should be checked against the original records by the responsible investigator.',
        ].filter(Boolean).join('\n\n');

  return {
    content,
    citations,
    suggestedFollowUps: locale === 'hi'
      ? ['इस केस रिकॉर्ड का सार बताएँ।', 'इस केस में कौन से साक्ष्य जुड़े हैं?', 'कौन सी जानकारी अभी उपलब्ध नहीं है?']
      : locale === 'mr'
        ? ['या केस नोंदीचा सारांश द्या.', 'या केसला कोणते पुरावे जोडले आहेत?', 'कोणती माहिती अजून उपलब्ध नाही?']
        : ['Summarize the current case record.', 'What evidence is attached to this case?', 'What information is still missing?'],
  };
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
  const systemPrompt = `You are The Third Eye case-record assistant for Pimpri Chinchwad, Maharashtra.
Answer only from the case and evidence records provided. Never invent people, evidence, locations, legal sections, or investigative actions. Distinguish reported claims from verified records and state when evidence is absent. Do not imply guilt or make legal conclusions. Use concise plain text with short section labels and bullets; do not use Markdown heading hashes, asterisks, or decorative symbols.`;

  const contextData = {
    case: caseData,
    evidenceCount: evidence.length,
    evidenceSample: evidence.map((e) => ({ id: e.id, title: e.title, claims: e.claims })),
    entities: entities.map((ent) => ({ id: ent.id, name: ent.name, role: ent.role, details: ent.details })),
    contradictions: contradictions.map((c) => ({ id: c.id, title: c.title, claimA: c.claimA, claimB: c.claimB })),
    gaps: gaps.map((g) => ({ id: g.id, title: g.title, severity: g.severity })),
  };

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `CASE CONTEXT:\n${JSON.stringify(contextData, null, 2)}\n\nOFFICER QUERY: ${query}` },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

  return {
    content: text,
    citations: [],
    suggestedFollowUps: [
      'Summarize the current case record.',
      'What evidence is attached to this case?',
      'What information is still missing?',
    ],
  };
}
