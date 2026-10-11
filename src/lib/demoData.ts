import {
  Case,
  EvidenceItem,
  Entity,
  EventItem,
  EntityRelationship,
  ContradictionFinding,
  InvestigationGap,
  AIMessage,
  AuditLog,
  CaseStore,
  EvidenceType,
} from '@/types';

export const DEMO_CASE_ID = 'case-pcpc-wakad-2025';

export const demoCase: Case = {
  id: DEMO_CASE_ID,
  title: 'Armed Vault Breach & Digital Access Bypass at Kothari Jewellers',
  referenceNumber: 'FIR No. 0389/2025 (Wakad Police Station)',
  caseType: 'Commercial Dacoity & Digital Bypass (BNS 309(4), 310(2), 61(2) & IT Act 66C)',
  incidentDate: '2025-10-24T22:15:00Z',
  incidentLocation: 'Kothari Jewellers & Vault Facility, Datta Mandir Road, Wakad, Pimpri Chinchwad, Pune 411057',
  summary:
    'Vault safe room breached resulting in theft of certified diamonds and 24K bullion valued at ₹4.62 Crores. Rear service entrance (Door 2B) disarmed via valid PIN #7291 at 22:18 IST followed by manual siren relay cutoff. Multiple critical discrepancies detected: primary suspect Sachin Gaikwad claimed dining at Govind Garden, Pimple Saudagar between 21:15 and 23:00, but Jio cellular mast logs (Cell ID 404-869-38291 Wakad) and PCMC Smart City ANPR cameras (Dange Chowk & Bhumkar Chowk) prove his active presence within 280m of the crime scene.',
  status: 'active',
  priority: 'high',
  leadInvestigator: 'Sr. PI Vitthal More (Badge #MH-PCPC-4412, Wakad PS)',
  createdAt: '2025-10-25T06:30:00Z',
  updatedAt: '2025-10-25T15:45:00Z',
  tags: [
    'Pimpri Chinchwad Police',
    'Wakad Police Station',
    'Armed Vault Breach',
    'Conflicting Alibi',
    'ANPR Match',
    'High Priority',
  ],
};

export const demoCases: Case[] = [
  {
    id: 'case-pcpc-chakan-2025',
    title: 'Chakan MIDC Industrialist Armed Ambush & Murder Conspiracy',
    referenceNumber: 'FIR No. 0118/2025 (Chakan Police Station)',
    caseType: 'Attempted Murder & Criminal Conspiracy (BNS 109, 61(2) & Arms Act 3/25)',
    incidentDate: '2025-01-20T15:40:00Z',
    incidentLocation: 'Chakan MIDC Phase II, Mahalunge Road, Pimpri Chinchwad, Pune 410501',
    summary: 'Armed shooting orchestrated against steel firm manager Ajay Vikram Singh inside Kailas Steel premises in Chakan MIDC. Investigation by PCPC Crime Branch and Anti-Gunda squad revealed victim cousin Sangram (alias Chandan) Anant Singh hired hitmen from Uttar Pradesh for ₹12 Lakhs over business rivalry. Technical surveillance, Airtel cell mast triangulation (Cell ID 404-869-21943), and CCTV tracking led to apprehension of Sangram Anant Singh and aide Rohit Pandey with seized firearms.',
    status: 'active',
    priority: 'high',
    leadInvestigator: 'PI Pramod Sawant (Crime Branch Unit 3, PCPC)',
    createdAt: '2025-01-20T18:00:00Z',
    updatedAt: '2025-02-12T16:30:00Z',
    tags: ['PCPC Crime Branch', 'Chakan MIDC', 'Accused Apprehended', 'Ballistics Matched', 'Airtel Tower Triangulation', 'High Priority'],
  },
  {
    id: 'case-pcpc-cyber-2025',
    title: 'Hinjawadi IT Corridor Multi-Crore Digital Arrest & Share Trading Syndicate',
    referenceNumber: 'FIR No. 0542/2025 (PCPC Cyber Crime PS)',
    caseType: 'Organized Cyber Fraud & Extortion (BNS 318(4), 316(2), 61(2) & IT Act 66D, 43)',
    incidentDate: '2025-06-11T11:20:00Z',
    incidentLocation: 'Phase 1 Tech Park, Hinjawadi, Pimpri Chinchwad, Pune 411057',
    summary: 'Sophisticated international cyber syndicate executed an extortionate "digital arrest" and fraudulent institutional equity trading scheme against a senior tech executive in Hinjawadi IT Park. Perpetrators impersonated enforcement directorate and telecom officers over spoofed video calls, routing ₹4.85 Crores through 14 layered mule accounts in Gujarat and Maharashtra. PCPC Cyber Crime Squad froze ₹2.10 Crores and traced IP gateways via Telegram and VPN logs.',
    status: 'active',
    priority: 'high',
    leadInvestigator: 'Sr. PI Ravikiran Nale (Cyber Crime Police Station, PCPC)',
    createdAt: '2025-06-12T09:15:00Z',
    updatedAt: '2025-06-25T18:00:00Z',
    tags: ['Cyber Crime Cell', 'Hinjawadi IT Park', 'Mule Bank Trail', 'Digital Forensics', 'High Priority'],
  },
  {
    id: 'case-pcpc-bhosari-2025',
    title: 'Bhosari MIDC Scrap Merchant Abduction & Armed Ransom Demand',
    referenceNumber: 'FIR No. 0284/2025 (Bhosari Police Station)',
    caseType: 'Kidnapping for Ransom & Armed Dacoity (BNS 140(2), 310(2), 115(2) & MCOCA)',
    incidentDate: '2025-04-03T20:15:00Z',
    incidentLocation: 'Sector 7, Bhosari MIDC, Pimpri Chinchwad, Pune 411026',
    summary: 'A scrap merchant was intercepted and abducted at gunpoint by members of a local organized crime syndicate in Bhosari MIDC. The perpetrators demanded ₹50 Lakhs ransom via encrypted calls. PCPC Anti-Extortion Cell mobilized technical cell tracking on tower triangulation between Moshi and Alandi, rescuing the victim safely within 14 hours and impounding the getaway Mahindra Scorpio and illegal country-made firearms.',
    status: 'closed',
    priority: 'high',
    leadInvestigator: 'API Ganesh Patil (Anti-Extortion Cell, PCPC)',
    createdAt: '2025-04-03T22:30:00Z',
    updatedAt: '2025-04-10T14:00:00Z',
    tags: ['Anti-Extortion Squad', 'Bhosari MIDC', 'Tower Triangulation', 'Rescued in 14h', 'Weapon Seizure'],
  },
  {
    id: 'case-pcpc-chikhali-2025',
    title: 'Kudalwadi Commercial Bank ATM Gas-Cutter Breach & Arson Heist',
    referenceNumber: 'FIR No. 0419/2025 (Chikhali Police Station)',
    caseType: 'Commercial Burglary & Mischief by Fire (BNS 305, 331(4), 326(f) & Damage to Public Property Act)',
    incidentDate: '2025-08-09T03:10:00Z',
    incidentLocation: 'Kudalwadi Main Chowk, Chikhali, Pimpri Chinchwad, Pune 411062',
    summary: 'Inter-state gang utilized industrial oxy-acetylene gas cutters to breach the cash vault of an HDFC Bank ATM booth in Kudalwadi, Chikhali. Intense flame triggered currency combustion and secondary fire destroying ₹18.5 Lakhs in cash cassette assemblies. Forensics retrieved discarded oxygen cylinders, CCTV sensor spray paint residue, and tyre tread impressions matching a Bolero pickup tracked across Chakan-Nashik highway.',
    status: 'active',
    priority: 'high',
    leadInvestigator: 'Sr. PI Dnyaneshwar Katkar (Chikhali PS, PCPC)',
    createdAt: '2025-08-09T05:30:00Z',
    updatedAt: '2025-08-15T11:45:00Z',
    tags: ['Chikhali PS', 'Gas-Cutter Heist', 'CCTV Tampering', 'FSL Chem Analysis', 'Inter-state Syndicate'],
  },
];

export const DEFAULT_ACTIVE_CASE_ID = demoCases[0].id;

export const demoEvidence: EvidenceItem[] = [
  {
    id: 'ev-001',
    caseId: DEMO_CASE_ID,
    title: 'First Information Report (FIR No. 0389/2025, Wakad PS)',
    evidenceType: 'fir_document',
    sourceDescription: 'Official FIR lodged by Proprietor Rajesh Kothari under Section 154 CrPC / BNSS at Wakad Police Station',
    dateReceived: '2025-10-25T06:45:00Z',
    eventTime: '2025-10-24T22:15:00Z',
    recordedBy: 'Sr. PI Vitthal More, Wakad PS',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'FIR_0389_2025_Wakad_Kothari_Jewellers.pdf',
    fileMimeType: 'application/pdf',
    fileSize: 312400,
    fileHash: 'sha256:4a98bf817c12e520de389a01f893cb998124eaf1923',
    sourceProvenance: {
      origin: 'Wakad Police Station Station Diary & Crime Register (PCPC)',
      collector: 'Sr. PI Vitthal More',
      chainOfCustody: ['Station Duty Officer PSI Jadhav', 'Investigating Officer Sr. PI More', 'Cyber Cell PCPC'],
      collectedAt: '2025-10-25T06:45:00Z',
    },
    extractedText: `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C. / BNSS)
Police Station: Wakad | Commissionerate: Pimpri Chinchwad Police (PCPC) | FIR No: 0389/2025 | Date: 25-Oct-2025
Complainant: Rajesh Nemichand Kothari (Age 52), Resident of Kaspate Vasti, Wakad.
Business: Kothari Jewellers, Plot 14, Datta Mandir Road, Wakad, Pimpri Chinchwad.

Statement of Complainant:
"On the morning of 25th October 2025 at 06:15 hours, during daily morning prayer and shutter opening, the supervisor found the heavy vault safe door wide open. Safe Locker #4 containing certified loose diamonds and hallmarked wedding jewellery worth ₹4.62 Crores had been cleared out. There are no signs of lock breaking, cutter marks, or exterior shutter tampering. The rear service gate (Door 2B facing Datta Mandir back lane) electronic keypad was unlocked using valid credential PIN 7291 at 22:18 hours on 24-Oct-2025. Only two individuals possessed this confidential emergency master code: myself and Store Operations Manager Sachin Gaikwad."`,
    relatedEntityIds: ['ent-rajesh-kothari', 'ent-sachin-gaikwad', 'ent-kothari-store', 'ent-door-2b'],
    relatedEventIds: ['evt-004', 'evt-005'],
    claims: [
      {
        id: 'clm-001',
        evidenceId: 'ev-001',
        caseId: DEMO_CASE_ID,
        text: 'Vault locker #4 was looted without any physical cutter or pry marks on exterior shutters.',
        claimant: 'Rajesh Kothari',
        timestamp: '2025-10-24T22:15:00Z',
        location: 'Kothari Jewellers Vault Room, Wakad',
        claimType: 'record',
        confidence: 0.99,
      },
      {
        id: 'clm-002',
        evidenceId: 'ev-001',
        caseId: DEMO_CASE_ID,
        text: 'Only Rajesh Kothari and Sachin Gaikwad held the secret emergency PIN 7291 for Door 2B.',
        claimant: 'Rajesh Kothari',
        claimType: 'assertion',
        confidence: 0.92,
      },
    ],
    createdAt: '2025-10-25T07:00:00Z',
    updatedAt: '2025-10-25T07:30:00Z',
  },
  {
    id: 'ev-002',
    caseId: DEMO_CASE_ID,
    title: 'Sworn Alibi Statement of Vikram Patwardhan (Roommate)',
    evidenceType: 'witness_statement',
    sourceDescription: 'Statement recorded under Section 161 Cr.P.C. / Sec 180 BNSS at Kunal Icon Road, Pimple Saudagar',
    dateReceived: '2025-10-25T11:00:00Z',
    eventTime: '2025-10-24T21:15:00Z',
    recordedBy: 'API Sagar Patil (Cyber & Tech Cell PCPC)',
    processingStatus: 'processed',
    verificationStatus: 'disputed',
    originalFileName: 'Witness_Statement_Vikram_Patwardhan.docx',
    fileMimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 48300,
    fileHash: 'sha256:d128ec9901b2a47e19fc3a2010487192bcfa82',
    sourceProvenance: {
      origin: 'Flat 402, Royal Palms, Kunal Icon Road, Pimple Saudagar',
      collector: 'API Sagar Patil',
      chainOfCustody: ['Recording Officer API Patil', 'Lead IO Sr. PI Vitthal More'],
      collectedAt: '2025-10-25T11:00:00Z',
    },
    extractedText: `STATEMENT OF WITNESS (Under Section 161 Cr.P.C. / Sec 180 BNSS)
Name: Vikram Sudhakar Patwardhan, Age: 29, Occupation: Senior IT Engineer, Hinjawadi Phase 1.
Address: Flat 402, Royal Palms, Kunal Icon Road, Pimple Saudagar.

Statement:
"Sachin Gaikwad has been my flatmate for 18 months. On Friday, 24th October 2025, Sachin returned from Wakad store at around 20:45 hours. He was wearing formal blue shirt and trousers. At 21:15 hours, both of us walked to Govind Garden Restaurant near Kokane Chowk, Pimple Saudagar for dinner. We ordered starters and main course and were seated continuously inside the AC section from 21:20 to 22:45 hours. We returned to our flat by 23:05 hours and Sachin did not leave the room all night. His white Hyundai Creta (MH-14-GX-8842) remained parked in our basement slot B-14."`,
    relatedEntityIds: ['ent-vikram-patwardhan', 'ent-sachin-gaikwad', 'ent-pimple-saudagar', 'ent-creta-car'],
    relatedEventIds: ['evt-002', 'evt-007'],
    claims: [
      {
        id: 'clm-003',
        evidenceId: 'ev-002',
        caseId: DEMO_CASE_ID,
        text: 'Sachin Gaikwad was seated continuously inside Govind Garden Restaurant, Pimple Saudagar from 21:20 to 22:45.',
        claimant: 'Vikram Patwardhan',
        timestamp: '2025-10-24T21:20:00Z',
        location: 'Govind Garden Restaurant, Pimple Saudagar',
        claimType: 'alibi',
        confidence: 0.88,
      },
      {
        id: 'clm-004',
        evidenceId: 'ev-002',
        caseId: DEMO_CASE_ID,
        text: 'White Hyundai Creta MH-14-GX-8842 stayed parked in Pimple Saudagar basement all evening.',
        claimant: 'Vikram Patwardhan',
        timestamp: '2025-10-24T21:00:00Z',
        location: 'Royal Palms Basement B-14, Pimple Saudagar',
        claimType: 'alibi',
        confidence: 0.85,
      },
    ],
    createdAt: '2025-10-25T11:15:00Z',
    updatedAt: '2025-10-25T11:30:00Z',
  },
  {
    id: 'ev-003',
    caseId: DEMO_CASE_ID,
    title: 'PCMC Smart City ANPR & ICCC Nigdi Optical Camera Feed Log',
    evidenceType: 'cctv_observation',
    sourceDescription: 'Digital optical logs from PCMC Integrated Command & Control Centre (ICCC), Nigdi Pradhikaran',
    dateReceived: '2025-10-25T12:30:00Z',
    eventTime: '2025-10-24T22:36:12Z',
    recordedBy: 'Sub-Inspector R. Gaikwad, Traffic Control & Smart City Cell',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'PCMC_ANPR_DANGE_CHOWK_WK44_LOGS.csv',
    fileMimeType: 'text/csv',
    fileSize: 184500,
    fileHash: 'sha256:88bc201419a4e92a47814bca9921bc3802e9fa12',
    sourceProvenance: {
      origin: 'PCMC Smart City ICCC Nigdi Server Hub, Pole #WK-44 (Dange Chowk North-East)',
      collector: 'PSI Gaikwad',
      chainOfCustody: ['ICCC Systems Engineer Shinde', 'Traffic Monitoring Cell', 'Lead IO Sr. PI Vitthal More'],
      collectedAt: '2025-10-25T12:30:00Z',
    },
    extractedText: `PCMC SMART CITY INTEGRATED COMMAND & CONTROL CENTRE (ICCC NIGDI)
AUTOMATIC NUMBER PLATE RECOGNITION (ANPR) & JUNCTION SURVEILLANCE LOGS
Location: Dange Chowk Junction, Camera Pole #WK-44 (Direction: Wakad to Hinjawadi Flyover)
Timestamp: 2025-10-24 22:36:12 IST
Plate Captured: MH-14-GX-8842 (Match Confidence: 99.4%)
Vehicle Classification: Hyundai Creta (White, Alloy Wheels, Black Roof Rails)
Movement Vector: Heading Westbound past Dange Chowk towards Bhumkar Chowk / Hinjawadi Phase 1.
Driver Camera Annotation: Male driver, black baseball cap, blue collared shirt. Front passenger sun visor lowered, obscuring passenger face.
Secondary ANPR Log: At 22:58:40 IST, same vehicle re-detected at Bhumkar Chowk Bypass junction turning toward Mumbai-Bengaluru Highway.`,
    relatedEntityIds: ['ent-creta-car', 'ent-sachin-gaikwad', 'ent-dange-chowk', 'ent-bhumkar-chowk'],
    relatedEventIds: ['evt-006', 'evt-008'],
    claims: [
      {
        id: 'clm-005',
        evidenceId: 'ev-003',
        caseId: DEMO_CASE_ID,
        text: 'White Hyundai Creta MH-14-GX-8842 passed Dange Chowk at 22:36:12 heading toward Hinjawadi.',
        claimant: 'PCMC Smart City ANPR System',
        timestamp: '2025-10-24T22:36:12Z',
        location: 'Dange Chowk Junction Pole #WK-44',
        claimType: 'record',
        confidence: 0.99,
      },
      {
        id: 'clm-006',
        evidenceId: 'ev-003',
        caseId: DEMO_CASE_ID,
        text: 'Driver was wearing a blue collared shirt matching clothing described in suspect profile.',
        claimant: 'PCMC ICCC Video Analytics',
        timestamp: '2025-10-24T22:36:12Z',
        location: 'Dange Chowk',
        claimType: 'observation',
        confidence: 0.91,
      },
    ],
    createdAt: '2025-10-25T12:45:00Z',
    updatedAt: '2025-10-25T13:00:00Z',
  },
  {
    id: 'ev-004',
    caseId: DEMO_CASE_ID,
    title: 'Reliance Jio Cellular Tower CDR & Cell ID Mast Records',
    evidenceType: 'digital_record',
    sourceDescription: 'Subpoenaed Call Detail Records and 4G/5G data session pings from Reliance Jio LSA Pune/Maharashtra',
    dateReceived: '2025-10-25T13:45:00Z',
    eventTime: '2025-10-24T22:19:34Z',
    recordedBy: 'API Sagar Patil (Cyber Crime Police Station, PCPC)',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'JIO_CDR_SUBSCRIBER_9822409182_WAKAD.xlsx',
    fileMimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 412000,
    fileHash: 'sha256:ef320912bc4501a2873491baec90823419bb01e3',
    sourceProvenance: {
      origin: 'Reliance Jio Infocomm Ltd Nodal Office, Kalyani Nagar Pune',
      collector: 'API Sagar Patil',
      chainOfCustody: ['Nodal Officer Telecom', 'Cyber Crime Cell PCPC', 'Sr. PI More'],
      collectedAt: '2025-10-25T13:45:00Z',
    },
    extractedText: `CYBER CRIME POLICE STATION, PIMPRI CHINCHWAD POLICE (PCPC)
TELECOM SUBSCRIBER CDR & PACKET DATA AUDIT REPORT
Subscriber MSISDN: +91-98224-09182 | Registered Name: Sachin Suresh Gaikwad
Handset IMEI: 864910041289410 | IMSI: 404869102941029

KEY RECORDINGS DURING INCIDENT TIMEFRAME (24-OCT-2025):
- 20:54:12 IST: Tower Sector: Royal Palms Kunal Icon Rd (CellID: 404-869-21049, Pimple Saudagar). Signal -82dBm.
- 21:42:01 IST: Handset transitions across Kalewadi Phata / Dange Chowk Cell Mast (CellID: 404-869-31002).
- 22:19:34 IST: Active 4G Data Packet & SMS Delivery Acknowledgment on TOWER WAKAD DATTA MANDIR (CellID: 404-869-38291, Azimuth 120 deg).
  Signal Strength: -72 dBm (Extremely strong signal indicating device within 220-280m radius of Kothari Jewellers).
- 22:24:05 IST: Outgoing voice call (duration: 38 sec) to +91-97640-11209 (Registered to Nilesh Baban Shinde, Bhosari MIDC).
- 22:48:19 IST: Tower Sector: Hinjawadi Phase 1 Infotech Ring Road (CellID: 404-869-49102).`,
    relatedEntityIds: ['ent-sachin-gaikwad', 'ent-nilesh-shinde', 'ent-kothari-store', 'ent-wakad-tower'],
    relatedEventIds: ['evt-004', 'evt-005', 'evt-007'],
    claims: [
      {
        id: 'clm-007',
        evidenceId: 'ev-004',
        caseId: DEMO_CASE_ID,
        text: 'Sachin Gaikwad’s handset was connected to Wakad Datta Mandir Tower at 22:19:34 with -72dBm signal (~250m from vault).',
        claimant: 'Reliance Jio CDR Telemetry',
        timestamp: '2025-10-24T22:19:34Z',
        location: 'Wakad Datta Mandir Tower (CellID: 404-869-38291)',
        claimType: 'record',
        confidence: 0.99,
      },
      {
        id: 'clm-008',
        evidenceId: 'ev-004',
        caseId: DEMO_CASE_ID,
        text: 'Sachin Gaikwad placed a 38-second voice call to Nilesh Shinde at 22:24:05 from the Wakad crime radius.',
        claimant: 'Reliance Jio CDR Telemetry',
        timestamp: '2025-10-24T22:24:05Z',
        location: 'Wakad',
        claimType: 'record',
        confidence: 0.98,
      },
    ],
    createdAt: '2025-10-25T14:00:00Z',
    updatedAt: '2025-10-25T14:15:00Z',
  },
  {
    id: 'ev-005',
    caseId: DEMO_CASE_ID,
    title: 'OmniLock Biometric & PIN Digital Keypad EEPROM Controller Dump',
    evidenceType: 'digital_record',
    sourceDescription: 'Digital memory extraction from Door 2B OmniLock biometric/keypad terminal by Cyber Cell PCPC',
    dateReceived: '2025-10-25T14:30:00Z',
    eventTime: '2025-10-24T22:18:02Z',
    recordedBy: 'API Sagar Patil & Technical Forensics Team',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'OmniLock_Door2B_EEPROM_Dump_Kothari.bin',
    fileMimeType: 'application/octet-stream',
    fileSize: 65536,
    fileHash: 'sha256:1a79ef098234be1029384bb12093481239102834',
    sourceProvenance: {
      origin: 'Door 2B Service Entry Keypad, Kothari Jewellers Wakad',
      collector: 'API Sagar Patil',
      chainOfCustody: ['Crime Scene Seal Officer', 'Cyber Forensics Unit Nigdi', 'Lead IO Sr. PI More'],
      collectedAt: '2025-10-25T14:30:00Z',
    },
    extractedText: `OMNILOCK SECURE-PASS 9000 EEPROM CONTROLLER MEMORY AUDIT
Device ID: OMNI-WK-2B | Firmware: v4.12.08 | Location: Service Entrance Door 2B

EVENT AUDIT TRAIL (24-OCT-2025):
- 21:00:00 IST: Normal perimeter lock engage. Status: ARMED.
- 22:18:02 IST: User Auth Event: EMERGENCY PIN ENTRY [#7291] - MATCH CONFIRMED.
- 22:18:05 IST: Solenoid Relay 1 Activated. Door 2B Physical Latch Disengaged.
- 22:20:14 IST: Interior Alarm Override Toggle Switched OFF (Zone 4 Vault Sensor Bypassed).
- 22:31:40 IST: Door 2B Latch Re-engaged (Magnetic Contact Closed).
No brute-force invalid code attempts registered. Master PIN was entered correctly on first attempt without error.`,
    relatedEntityIds: ['ent-door-2b', 'ent-sachin-gaikwad', 'ent-rajesh-kothari'],
    relatedEventIds: ['evt-004', 'evt-005'],
    claims: [
      {
        id: 'clm-009',
        evidenceId: 'ev-005',
        caseId: DEMO_CASE_ID,
        text: 'Door 2B was unlocked at 22:18:02 via master PIN 7291 without any prior failed attempts.',
        claimant: 'OmniLock Controller EEPROM',
        timestamp: '2025-10-24T22:18:02Z',
        location: 'Kothari Jewellers Door 2B, Wakad',
        claimType: 'record',
        confidence: 0.99,
      },
      {
        id: 'clm-010',
        evidenceId: 'ev-005',
        caseId: DEMO_CASE_ID,
        text: 'Zone 4 Vault Alarm was manually disabled via internal toggle switch at 22:20:14.',
        claimant: 'OmniLock Controller EEPROM',
        timestamp: '2025-10-24T22:20:14Z',
        location: 'Kothari Jewellers Interior',
        claimType: 'record',
        confidence: 0.99,
      },
    ],
    createdAt: '2025-10-25T14:45:00Z',
    updatedAt: '2025-10-25T15:00:00Z',
  },
  {
    id: 'ev-006',
    caseId: DEMO_CASE_ID,
    title: 'Spot Panchnama & Forensic Science Lab (FSL Pune) Scene Report',
    evidenceType: 'forensic_report',
    sourceDescription: 'Panchnama executed under Section 100 Cr.P.C. / BNSS in presence of two independent Panchas',
    dateReceived: '2025-10-25T15:15:00Z',
    eventTime: '2025-10-25T08:30:00Z',
    recordedBy: 'Sr. PI Vitthal More & FSL Scientific Officer Dr. S. Kulkarni',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'FSL_Pune_Panchnama_Kothari_Wakad.pdf',
    fileMimeType: 'application/pdf',
    fileSize: 524000,
    fileHash: 'sha256:912384a1029348bc12093481209348bcaef19230',
    sourceProvenance: {
      origin: 'Regional Forensic Science Laboratory (FSL Pune) & Wakad PS Crime Unit',
      collector: 'Dr. S. Kulkarni, Assistant Director FSL Pune',
      chainOfCustody: ['FSL Evidence Locker', 'Lead IO Sr. PI Vitthal More', 'Court Malkhana Officer'],
      collectedAt: '2025-10-25T15:15:00Z',
    },
    extractedText: `FORENSIC SCIENCE LABORATORY (FSL PUNE) & PIMPRI CHINCHWAD POLICE
CRIME SCENE INVESTIGATION & SPOT PANCHNAMA REPORT
Location: Kothari Jewellers, Datta Mandir Road, Wakad.
Panch Witnesses: 1) Pramod Jadhav, Resident of Wakad. 2) Nilesh Thorat, Resident of Pimple Saudagar.

KEY OBSERVATIONS & LATENT FINGERPRINT EXAMINATION:
1. No evidence of physical force on glass shutters or heavy vault steel doors.
2. Door 2B rubber gasket shows traces of grease; numeric keypad button #7, #2, #9, and #1 showed latent powder ridge impressions.
3. Latent finger ridge specimen Q-4 lifted from Safe Box #4 handle matches 14 ridge characteristics of suspect Nilesh Baban Shinde (Ex-guard, on record at Bhosari PS under Crime No. 214/2023).
4. Shoe tread impression (Size 9, patterned diamond sole matching Woodland casual shoes) photographed on rear alley mud track.`,
    relatedEntityIds: ['ent-nilesh-shinde', 'ent-kothari-store', 'ent-door-2b'],
    relatedEventIds: ['evt-004', 'evt-005'],
    claims: [
      {
        id: 'clm-011',
        evidenceId: 'ev-006',
        caseId: DEMO_CASE_ID,
        text: 'Latent print Q-4 on Safe Box #4 matches ex-security guard Nilesh Baban Shinde with 14 ridge points.',
        claimant: 'FSL Pune Forensic Examiner',
        timestamp: '2025-10-25T08:30:00Z',
        location: 'Kothari Jewellers Vault Room',
        claimType: 'record',
        confidence: 0.96,
      },
      {
        id: 'clm-012',
        evidenceId: 'ev-006',
        caseId: DEMO_CASE_ID,
        text: 'Numeric keypad buttons #7, #2, #9, and #1 exhibited fresh fingerprint powder reaction.',
        claimant: 'FSL Pune Forensic Examiner',
        timestamp: '2025-10-25T08:30:00Z',
        location: 'Door 2B Keypad',
        claimType: 'record',
        confidence: 0.95,
      },
    ],
    createdAt: '2025-10-25T15:30:00Z',
    updatedAt: '2025-10-25T15:45:00Z',
  },
  {
    id: 'ev-007',
    caseId: DEMO_CASE_ID,
    title: 'Interrogation Transcription of Sachin Gaikwad (Recorded at Wakad PS)',
    evidenceType: 'witness_statement',
    sourceDescription: 'Formal police questioning conducted in Interrogation Room #2, Wakad Police Station',
    dateReceived: '2025-10-25T16:00:00Z',
    eventTime: '2025-10-25T14:30:00Z',
    recordedBy: 'Sr. PI Vitthal More & API Sagar Patil',
    processingStatus: 'processed',
    verificationStatus: 'disputed',
    originalFileName: 'Interrogation_Transcript_Sachin_Gaikwad.pdf',
    fileMimeType: 'application/pdf',
    fileSize: 198000,
    fileHash: 'sha256:3091248102934812093481239012830912830912',
    sourceProvenance: {
      origin: 'Wakad Police Station Interrogation Room #2 (Audio-Video Recorded under BNSS)',
      collector: 'Sr. PI Vitthal More',
      chainOfCustody: ['IO Sr. PI More', 'DCP Crime PCPC'],
      collectedAt: '2025-10-25T16:00:00Z',
    },
    extractedText: `WAKAD POLICE STATION, PIMPRI CHINCHWAD POLICE COMMISSIONERATE
TRANSCRIPTION OF ACCUSED INTERROGATION (AUDIO-VIDEO RECORDED)
Interrogator: Sr. PI Vitthal More | Interrogatee: Sachin Suresh Gaikwad

Q: Where were you between 21:30 and 23:00 on Friday night?
A: I was having dinner with Vikram at Govind Garden Restaurant in Pimple Saudagar. We arrived at 21:15 and left after 22:45. I never went anywhere near Wakad.
Q: Why did your phone ping on the Datta Mandir cell tower in Wakad at 22:19?
A: That must be a network glitch by Jio. Sometimes the tower signals from Wakad reach across the river to Pimple Saudagar.
Q: Did you speak to Nilesh Shinde on Friday night?
A: No, I haven't talked to Nilesh since he was fired six months ago.
Q: PCMC ANPR cameras captured your white Creta MH-14-GX-8842 crossing Dange Chowk at 22:36. Who was driving?
A: My car was parked in my apartment basement. Nobody had the keys.`,
    relatedEntityIds: ['ent-sachin-gaikwad', 'ent-nilesh-shinde', 'ent-creta-car', 'ent-pimple-saudagar'],
    relatedEventIds: ['evt-002', 'evt-006', 'evt-007'],
    claims: [
      {
        id: 'clm-013',
        evidenceId: 'ev-007',
        caseId: DEMO_CASE_ID,
        text: 'Sachin Gaikwad denied placing any call to Nilesh Shinde on the night of the incident.',
        claimant: 'Sachin Gaikwad',
        timestamp: '2025-10-25T14:30:00Z',
        location: 'Wakad PS',
        claimType: 'assertion',
        confidence: 0.85,
      },
      {
        id: 'clm-014',
        evidenceId: 'ev-007',
        caseId: DEMO_CASE_ID,
        text: 'Sachin Gaikwad maintained his car MH-14-GX-8842 was untouched in his basement all night.',
        claimant: 'Sachin Gaikwad',
        timestamp: '2025-10-25T14:30:00Z',
        location: 'Wakad PS',
        claimType: 'assertion',
        confidence: 0.82,
      },
    ],
    createdAt: '2025-10-25T16:15:00Z',
    updatedAt: '2025-10-25T16:30:00Z',
  },
  {
    id: 'ev-008',
    caseId: DEMO_CASE_ID,
    title: 'Highway FASTag & Toll Plaza Telemetry (Somatane & Bhumkar Chowk)',
    evidenceType: 'movement_record',
    sourceDescription: 'National Payments Corporation of India (NPCI) FASTag gateway records via NHAI Pune Division',
    dateReceived: '2025-10-25T16:45:00Z',
    eventTime: '2025-10-24T23:14:22Z',
    recordedBy: 'PSI K. Shinde (Highway & Traffic Cell)',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    originalFileName: 'FASTAG_NPCI_MH14GX8842_LOGS.pdf',
    fileMimeType: 'application/pdf',
    fileSize: 142000,
    fileHash: 'sha256:7789012498120349812034981203948120394812',
    sourceProvenance: {
      origin: 'NPCI Central FASTag Clearing House / Somatane Toll Plaza',
      collector: 'PSI K. Shinde',
      chainOfCustody: ['Highway Police Pune', 'Lead IO Sr. PI More'],
      collectedAt: '2025-10-25T16:45:00Z',
    },
    extractedText: `NATIONAL HIGHWAY AUTHORITY OF INDIA (NHAI) - FASTAG TRANSACTION AUDIT
Vehicle Registration: MH-14-GX-8842 | Tag ID: 34161FA820914820 | Class: VC4 (Light Motor Vehicle)
Toll Plaza: Somatane Toll Plaza (Mumbai-Pune Expressway Spur, Kiwale/Dehu Road)
Lane ID: Lane 04 (Expressway Outbound towards Talegaon/Mumbai)
Transaction Timestamp: 2025-10-24 23:14:22 IST
Status: SUCCESS | Fee Deducted: ₹95.00
Optical Camera Snapshot: Confirms white Hyundai Creta MH-14-GX-8842 passing boom barrier at 23:14:22.`,
    relatedEntityIds: ['ent-creta-car', 'ent-sachin-gaikwad', 'ent-bhumkar-chowk'],
    relatedEventIds: ['evt-008'],
    claims: [
      {
        id: 'clm-015',
        evidenceId: 'ev-008',
        caseId: DEMO_CASE_ID,
        text: 'White Creta MH-14-GX-8842 passed Somatane Toll Plaza heading toward Mumbai at 23:14:22.',
        claimant: 'NPCI FASTag Telemetry',
        timestamp: '2025-10-24T23:14:22Z',
        location: 'Somatane Toll Plaza, Kiwale',
        claimType: 'record',
        confidence: 0.99,
      },
    ],
    createdAt: '2025-10-25T17:00:00Z',
    updatedAt: '2025-10-25T17:15:00Z',
  },
];

export const demoEntities: Entity[] = [
  {
    id: 'ent-sachin-gaikwad',
    caseId: DEMO_CASE_ID,
    name: 'Sachin Suresh Gaikwad',
    category: 'person',
    role: 'suspect',
    details: {
      designation: 'Operations & Vault Manager, Kothari Jewellers',
      contact: '+91-98224-09182',
      address: 'Flat 402, Royal Palms, Kunal Icon Road, Pimple Saudagar',
      keypadAccess: 'Possessed Master PIN #7291',
      vehicle: 'Hyundai Creta (MH-14-GX-8842)',
      aadhaar: 'XXXX-XXXX-4912',
    },
    status: 'flagged',
    notes: 'Keypad emergency PIN holder. Disproven alibi. Cell tower CDR and ANPR cameras place him directly at crime scene.',
    sourceEvidenceIds: ['ev-001', 'ev-002', 'ev-004', 'ev-007'],
    createdAt: '2025-10-25T07:15:00Z',
    updatedAt: '2025-10-25T16:30:00Z',
  },
  {
    id: 'ent-nilesh-shinde',
    caseId: DEMO_CASE_ID,
    name: 'Nilesh Baban Shinde',
    category: 'person',
    role: 'suspect',
    details: {
      pastRole: 'Dismissed Security Guard (Kothari Jewellers)',
      contact: '+91-97640-11209',
      address: 'Near Indrayani Nagar, Bhosari MIDC, Pimpri Chinchwad',
      criminalRecord: 'Bhosari PS Crime No. 214/2023 (Breach of trust & theft)',
      vehicle: 'Yamaha FZ (MH-14-FA-5120)',
    },
    status: 'flagged',
    notes: 'Fingerprint match Q-4 lifted from safe box handle. 38-second phone call received from Sachin Gaikwad during heist window.',
    sourceEvidenceIds: ['ev-004', 'ev-006'],
    createdAt: '2025-10-25T14:15:00Z',
    updatedAt: '2025-10-25T15:45:00Z',
  },
  {
    id: 'ent-rajesh-kothari',
    caseId: DEMO_CASE_ID,
    name: 'Rajesh Nemichand Kothari',
    category: 'person',
    role: 'victim',
    details: {
      role: 'Proprietor & Complainant',
      business: 'Kothari Jewellers, Datta Mandir Road, Wakad',
      residence: 'Kaspate Vasti, Wakad',
      verifiedAlibi: 'Present at Rotary Club Dinner, Hinjawadi Marriott until 23:30',
    },
    status: 'verified',
    notes: 'Complainant. Confirmed only he and Sachin Gaikwad knew the vault keypad PIN.',
    sourceEvidenceIds: ['ev-001'],
    createdAt: '2025-10-25T07:00:00Z',
    updatedAt: '2025-10-25T07:00:00Z',
  },
  {
    id: 'ent-vikram-patwardhan',
    caseId: DEMO_CASE_ID,
    name: 'Vikram Sudhakar Patwardhan',
    category: 'person',
    role: 'person_of_interest',
    details: {
      occupation: 'Senior IT Software Engineer, Hinjawadi Phase 1',
      relationship: 'Flatmate to Sachin Gaikwad',
      residence: 'Flat 402, Royal Palms, Pimple Saudagar',
    },
    status: 'flagged',
    notes: 'Provided sworn alibi that Gaikwad was dining with him at Govind Garden. Subpoenaed restaurant CCTV reveals he was dining alone.',
    sourceEvidenceIds: ['ev-002'],
    createdAt: '2025-10-25T11:15:00Z',
    updatedAt: '2025-10-25T16:00:00Z',
  },
  {
    id: 'ent-creta-car',
    caseId: DEMO_CASE_ID,
    name: 'White Hyundai Creta (MH-14-GX-8842)',
    category: 'vehicle',
    role: 'person_of_interest',
    details: {
      registration: 'MH-14-GX-8842',
      registeredOwner: 'Sachin Suresh Gaikwad',
      rto: 'Pimpri Chinchwad RTO (MH-14)',
      anprCaptures: 'Dange Chowk (22:36), Bhumkar Chowk (22:58), Somatane Toll (23:14)',
    },
    status: 'verified',
    notes: 'Getaway vehicle. Fastag and ANPR confirm transit from Wakad across Dange Chowk and Somatane Toll Plaza.',
    sourceEvidenceIds: ['ev-002', 'ev-003', 'ev-008'],
    createdAt: '2025-10-25T12:45:00Z',
    updatedAt: '2025-10-25T17:00:00Z',
  },
  {
    id: 'ent-kothari-store',
    caseId: DEMO_CASE_ID,
    name: 'Kothari Jewellers & Vault Facility',
    category: 'location',
    role: 'neutral',
    details: {
      address: 'Plot 14, Datta Mandir Road, Wakad, Pimpri Chinchwad',
      pin: '411057',
      psJurisdiction: 'Wakad Police Station (Zone 2, PCPC)',
    },
    status: 'verified',
    notes: 'Scene of crime. Vault Room #4 breached via rear service door 2B.',
    sourceEvidenceIds: ['ev-001', 'ev-005', 'ev-006'],
    createdAt: '2025-10-25T07:00:00Z',
    updatedAt: '2025-10-25T07:00:00Z',
  },
  {
    id: 'ent-door-2b',
    caseId: DEMO_CASE_ID,
    name: 'Service Entrance Door 2B & OmniLock Terminal',
    category: 'device',
    role: 'neutral',
    details: {
      model: 'OmniLock Secure-Pass 9000',
      bypassCode: 'PIN #7291',
      accessTimestamp: '2025-10-24 22:18:02 IST',
    },
    status: 'verified',
    notes: 'Keypad terminal forensically audited. Master PIN entered without prior error.',
    sourceEvidenceIds: ['ev-001', 'ev-005', 'ev-006'],
    createdAt: '2025-10-25T14:45:00Z',
    updatedAt: '2025-10-25T14:45:00Z',
  },
  {
    id: 'ent-dange-chowk',
    caseId: DEMO_CASE_ID,
    name: 'Dange Chowk Smart City Junction',
    category: 'location',
    role: 'neutral',
    details: {
      cameraPole: 'Pole #WK-44 (PCMC Smart City ICCC Nigdi)',
      corridor: 'BRTS Corridor / Wakad to Hinjawadi Connector',
    },
    status: 'verified',
    notes: 'High-speed ANPR camera captured suspect Creta at 22:36:12 heading toward Hinjawadi.',
    sourceEvidenceIds: ['ev-003'],
    createdAt: '2025-10-25T12:45:00Z',
    updatedAt: '2025-10-25T12:45:00Z',
  },
  {
    id: 'ent-bhumkar-chowk',
    caseId: DEMO_CASE_ID,
    name: 'Bhumkar Chowk Highway Bypass',
    category: 'location',
    role: 'neutral',
    details: {
      junction: 'Mumbai-Bengaluru Highway (NH-48) bypass junction',
      jurisdiction: 'Hinjawadi / Wakad PS Border',
    },
    status: 'verified',
    notes: 'Vehicle MH-14-GX-8842 crossed at 22:58 towards expressway spur.',
    sourceEvidenceIds: ['ev-003', 'ev-008'],
    createdAt: '2025-10-25T13:00:00Z',
    updatedAt: '2025-10-25T13:00:00Z',
  },
  {
    id: 'ent-pimple-saudagar',
    caseId: DEMO_CASE_ID,
    name: 'Govind Garden / Kunal Icon Rd, Pimple Saudagar',
    category: 'location',
    role: 'neutral',
    details: {
      locality: 'Pimple Saudagar, Pimpri Chinchwad',
      distanceFromCrime: '6.8 km (approx. 20 mins drive in night traffic)',
    },
    status: 'verified',
    notes: 'Claimed alibi location. Disproven by telecom tower and traffic camera timestamps.',
    sourceEvidenceIds: ['ev-002', 'ev-007'],
    createdAt: '2025-10-25T11:15:00Z',
    updatedAt: '2025-10-25T11:15:00Z',
  },
  {
    id: 'ent-wakad-tower',
    caseId: DEMO_CASE_ID,
    name: 'Jio Cell Tower Datta Mandir (CellID 404-869-38291)',
    category: 'device',
    role: 'neutral',
    details: {
      operator: 'Reliance Jio Infocomm Ltd',
      coverageRadius: '350 meters',
      crimeSceneDistance: '220 meters from Kothari Jewellers',
    },
    status: 'verified',
    notes: 'Logged active data ping and phone call from Gaikwad at 22:19 and 22:24.',
    sourceEvidenceIds: ['ev-004'],
    createdAt: '2025-10-25T14:00:00Z',
    updatedAt: '2025-10-25T14:00:00Z',
  },
];

export const demoEvents: EventItem[] = [
  {
    id: 'evt-001',
    caseId: DEMO_CASE_ID,
    title: 'Store Operations Closed & Security Shutter Lowered',
    timestamp: '2025-10-24T20:30:00Z',
    timeDisplay: '8:30 PM',
    timePrecision: 'exact',
    description: 'Kothari Jewellers retail showroom locked by staff. Sachin Gaikwad oversees staff departure and sets perimeter lock.',
    location: 'Kothari Jewellers, Datta Mandir Road, Wakad',
    associatedEntityIds: ['ent-sachin-gaikwad', 'ent-kothari-store'],
    sourceEvidenceId: 'ev-001',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T07:30:00Z',
  },
  {
    id: 'evt-002',
    caseId: DEMO_CASE_ID,
    title: 'Claimed Dinner Arrival at Govind Garden, Pimple Saudagar',
    timestamp: '2025-10-24T21:15:00Z',
    timeDisplay: '9:15 PM',
    timePrecision: 'reported',
    description: 'Flatmate Vikram Patwardhan claims he and Sachin Gaikwad arrived at Govind Garden Restaurant and remained seated.',
    location: 'Govind Garden Restaurant, Pimple Saudagar',
    associatedEntityIds: ['ent-sachin-gaikwad', 'ent-vikram-patwardhan', 'ent-pimple-saudagar'],
    sourceEvidenceId: 'ev-002',
    verificationStatus: 'disputed',
    confidence: 0.35,
    createdAt: '2025-10-25T11:30:00Z',
  },
  {
    id: 'evt-003',
    caseId: DEMO_CASE_ID,
    title: 'Handset Mobility Ping across Kalewadi Phata / Dange Chowk',
    timestamp: '2025-10-24T21:42:01Z',
    timeDisplay: '9:42 PM',
    timePrecision: 'exact',
    description: 'Jio CDR records Sachin Gaikwad handset transiting westbound across Kalewadi Phata mast towards Wakad.',
    location: 'Kalewadi Phata / Dange Chowk corridor',
    associatedEntityIds: ['ent-sachin-gaikwad', 'ent-dange-chowk'],
    sourceEvidenceId: 'ev-004',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T14:00:00Z',
  },
  {
    id: 'evt-004',
    caseId: DEMO_CASE_ID,
    title: 'Service Door 2B Keypad Unlocked with Master PIN 7291',
    timestamp: '2025-10-24T22:18:02Z',
    timeDisplay: '10:18 PM',
    timePrecision: 'exact',
    description: 'OmniLock Door 2B keypad successfully opened using confidential emergency master PIN 7291.',
    location: 'Kothari Jewellers Rear Service Door 2B, Wakad',
    associatedEntityIds: ['ent-door-2b', 'ent-kothari-store', 'ent-sachin-gaikwad'],
    sourceEvidenceId: 'ev-005',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T14:45:00Z',
  },
  {
    id: 'evt-005',
    caseId: DEMO_CASE_ID,
    title: 'Active Cellular Ping & Call to Accomplice Nilesh Shinde',
    timestamp: '2025-10-24T22:19:34Z',
    timeDisplay: '10:19 PM',
    timePrecision: 'exact',
    description: 'Gaikwad’s handset connects to Datta Mandir Wakad Tower (-72dBm, 220m from vault) and dials Nilesh Shinde (38s call).',
    location: 'Datta Mandir Road, Wakad',
    associatedEntityIds: ['ent-sachin-gaikwad', 'ent-nilesh-shinde', 'ent-wakad-tower'],
    sourceEvidenceId: 'ev-004',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T14:00:00Z',
  },
  {
    id: 'evt-006',
    caseId: DEMO_CASE_ID,
    title: 'PCMC Smart City ANPR Detection at Dange Chowk Junction',
    timestamp: '2025-10-24T22:36:12Z',
    timeDisplay: '10:36 PM',
    timePrecision: 'exact',
    description: 'Camera Pole #WK-44 captures White Hyundai Creta MH-14-GX-8842 speeding west past Dange Chowk toward Hinjawadi.',
    location: 'Dange Chowk Smart City Junction Pole #WK-44',
    associatedEntityIds: ['ent-creta-car', 'ent-dange-chowk'],
    sourceEvidenceId: 'ev-003',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T12:45:00Z',
  },
  {
    id: 'evt-007',
    caseId: DEMO_CASE_ID,
    title: 'Claimed Departure from Pimple Saudagar Restaurant',
    timestamp: '2025-10-24T22:45:00Z',
    timeDisplay: '10:45 PM',
    timePrecision: 'reported',
    description: 'Vikram Patwardhan claims Gaikwad was still seated inside Govind Garden Restaurant finishing dessert.',
    location: 'Govind Garden Restaurant, Pimple Saudagar',
    associatedEntityIds: ['ent-sachin-gaikwad', 'ent-vikram-patwardhan', 'ent-pimple-saudagar'],
    sourceEvidenceId: 'ev-002',
    verificationStatus: 'debunked',
    confidence: 0.1,
    createdAt: '2025-10-25T11:30:00Z',
  },
  {
    id: 'evt-008',
    caseId: DEMO_CASE_ID,
    title: 'FASTag Detection at Somatane Toll Plaza Outbound to Mumbai',
    timestamp: '2025-10-24T23:14:22Z',
    timeDisplay: '11:14 PM',
    timePrecision: 'exact',
    description: 'White Hyundai Creta MH-14-GX-8842 pays electronic toll in Lane 04 at Somatane Plaza traveling onto Mumbai Expressway.',
    location: 'Somatane Toll Plaza, Kiwale Expressway Entry',
    associatedEntityIds: ['ent-creta-car', 'ent-bhumkar-chowk'],
    sourceEvidenceId: 'ev-008',
    verificationStatus: 'verified',
    confidence: 0.99,
    createdAt: '2025-10-25T17:00:00Z',
  },
];

export const demoRelationships: EntityRelationship[] = [
  {
    id: 'rel-001',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-sachin-gaikwad',
    targetEntityId: 'ent-kothari-store',
    relationshipType: 'associate',
    label: 'Operations & Vault Manager',
    description: 'Employed at Kothari Jewellers for 4 years. Held master keypad code PIN #7291.',
    supportingEvidenceIds: ['ev-001', 'ev-007'],
    verificationStatus: 'verified',
    confidence: 0.99,
  },
  {
    id: 'rel-002',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-sachin-gaikwad',
    targetEntityId: 'ent-nilesh-shinde',
    relationshipType: 'phone_call',
    label: 'Collusion & Direct Call',
    description: 'Placed 38-second voice call to Nilesh Shinde at 22:24 during the vault entry window.',
    supportingEvidenceIds: ['ev-004'],
    verificationStatus: 'verified',
    confidence: 0.98,
  },
  {
    id: 'rel-003',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-nilesh-shinde',
    targetEntityId: 'ent-door-2b',
    relationshipType: 'present_at',
    label: 'Forensic Latent Print Match',
    description: 'FSL Pune identified Nilesh Shinde’s latent finger ridge impression Q-4 on Safe Box #4 handle.',
    supportingEvidenceIds: ['ev-006'],
    verificationStatus: 'verified',
    confidence: 0.96,
  },
  {
    id: 'rel-004',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-sachin-gaikwad',
    targetEntityId: 'ent-creta-car',
    relationshipType: 'owner_of',
    label: 'Registered Owner & Driver',
    description: 'Registered owner of Creta MH-14-GX-8842. Captured driving across Dange Chowk at 22:36.',
    supportingEvidenceIds: ['ev-003', 'ev-008'],
    verificationStatus: 'verified',
    confidence: 0.99,
  },
  {
    id: 'rel-005',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-vikram-patwardhan',
    targetEntityId: 'ent-sachin-gaikwad',
    relationshipType: 'alibi_provider',
    label: 'Fabricated Alibi Provider',
    description: 'Provided sworn statement claiming Gaikwad was dining with him at Govind Garden until 22:45.',
    supportingEvidenceIds: ['ev-002', 'ev-007'],
    verificationStatus: 'disputed',
    confidence: 0.9,
  },
  {
    id: 'rel-006',
    caseId: DEMO_CASE_ID,
    sourceEntityId: 'ent-sachin-gaikwad',
    targetEntityId: 'ent-wakad-tower',
    relationshipType: 'present_at',
    label: 'Cell Tower Triangulation',
    description: 'Handset actively connected to Datta Mandir Wakad Tower at 22:19 with -72dBm signal strength.',
    supportingEvidenceIds: ['ev-004'],
    verificationStatus: 'verified',
    confidence: 0.99,
  },
];

export const demoContradictions: ContradictionFinding[] = [
  {
    id: 'cntr-001',
    caseId: DEMO_CASE_ID,
    title: 'Critical Alibi Clash: Sworn Dining Claim vs Wakad Cell Tower CDR Ping',
    severity: 'high',
    category: 'location_impossibility',
    claimA: {
      evidenceId: 'ev-002',
      evidenceTitle: 'Sworn Witness Statement of Vikram Patwardhan (Sec 161 CrPC)',
      excerpt:
        '“We ordered starters and main course and were seated continuously inside Govind Garden Restaurant, Pimple Saudagar from 21:20 to 22:45 hours.”',
      speakerOrSource: 'Vikram Patwardhan (Roommate)',
      timestamp: '2025-10-24T21:20:00Z',
      location: 'Govind Garden Restaurant, Pimple Saudagar',
    },
    claimB: {
      evidenceId: 'ev-004',
      evidenceTitle: 'Reliance Jio Cellular Tower CDR & Cell ID Mast Records',
      excerpt:
        '“22:19:34 IST: Active 4G Data Packet & SMS Delivery on Tower Wakad Datta Mandir (CellID: 404-869-38291). Signal -72dBm (~250m from vault).”',
      speakerOrSource: 'Reliance Jio Nodal CDR Telemetry',
      timestamp: '2025-10-24T22:19:34Z',
      location: 'Datta Mandir Road, Wakad (CellID: 404-869-38291)',
    },
    explanation:
      'Govind Garden in Pimple Saudagar and Kothari Jewellers on Datta Mandir Road, Wakad are separated by 6.8 kilometers (approx. 20–25 minutes driving time in Friday night traffic across the Mula river). An individual cannot be seated continuously inside a restaurant in Pimple Saudagar at 22:19 while their handset exchanges packet data via the Datta Mandir Wakad mast with a -72dBm signal.',
    alternativeExplanations: [
      'Handset was carried by an accomplice while Gaikwad remained at the restaurant (requires interrogating Vikram Patwardhan on whether Gaikwad had his phone in hand).',
      'Tower overshoot/reflection anomaly across the river (highly improbable given -72dBm direct line-of-sight signal strength).',
    ],
    suggestedVerificationSteps: [
      'Subpoena CCTV DVR from Govind Garden Restaurant cashier and dining area for 24-Oct-2025 (21:00 to 23:00).',
      'Examine UPI / credit card payment slips for food billing at Govind Garden to establish exact payer identity.',
      'Check cell tower antenna azimuth and sector coverage angles for Wakad Datta Mandir Tower 404-869-38291.',
    ],
    reviewStatus: 'confirmed_inconsistency',
    investigatorNotes:
      'Sr. PI Vitthal More: Subpoena served on Govind Garden owner. Cashier states only Vikram was seated in AC room; second patron left abruptly at 21:35.',
    reviewedBy: 'Sr. PI Vitthal More (Lead IO)',
    updatedAt: '2025-10-25T16:00:00Z',
  },
  {
    id: 'cntr-002',
    caseId: DEMO_CASE_ID,
    title: 'Vehicle Mobility Contradiction: Creta MH-14-GX-8842 Basement Claim vs Dange Chowk ANPR',
    severity: 'high',
    category: 'alibi_discrepancy',
    claimA: {
      evidenceId: 'ev-007',
      evidenceTitle: 'Interrogation Transcription of Sachin Gaikwad (Wakad PS)',
      excerpt:
        '“My white Creta (MH-14-GX-8842) was parked in my apartment basement in Pimple Saudagar all night. Nobody had the keys.”',
      speakerOrSource: 'Sachin Suresh Gaikwad',
      timestamp: '2025-10-25T14:30:00Z',
      location: 'Wakad Police Station Interrogation Room #2',
    },
    claimB: {
      evidenceId: 'ev-003',
      evidenceTitle: 'PCMC Smart City ANPR & ICCC Nigdi Optical Camera Feed Log',
      excerpt:
        '“22:36:12 IST: Plate MH-14-GX-8842 (White Hyundai Creta) captured moving westbound past Dange Chowk Pole #WK-44 towards Hinjawadi. Driver wearing blue collared shirt.”',
      speakerOrSource: 'PCMC Smart City ANPR System',
      timestamp: '2025-10-24T22:36:12Z',
      location: 'Dange Chowk Junction Smart City Pole #WK-44',
    },
    explanation:
      'Gaikwad asserts under interrogation that his vehicle remained stationary in Royal Palms basement slot B-14. However, PCMC Smart City high-speed ANPR camera Pole #WK-44 at Dange Chowk recorded plate MH-14-GX-8842 transiting at 22:36:12, followed by NHAI FASTag electronic toll clearance at Somatane Toll Plaza at 23:14:22 heading toward Mumbai.',
    alternativeExplanations: [
      'Cloned or counterfeit number plate on identical white Creta (unlikely given matching aftermarket black roof rails and alloy wheels photographed at Somatane).',
      'Vehicle was taken by a third party without Gaikwad’s knowledge.',
    ],
    suggestedVerificationSteps: [
      'Retrieve Royal Palms society gate security boom-barrier logs and basement CCTV for egress timestamp.',
      'Requisition high-resolution facial crop from Somatane Toll Plaza Lane 04 optical camera.',
      'Impound vehicle MH-14-GX-8842 upon intercept and swab steering wheel / gear lever for DNA.',
    ],
    reviewStatus: 'confirmed_inconsistency',
    investigatorNotes:
      'API Sagar Patil: Royal Palms security log confirms Creta MH-14-GX-8842 exited basement gate at 21:38. Gaikwad’s claim is demonstrably false.',
    reviewedBy: 'API Sagar Patil',
    updatedAt: '2025-10-25T16:30:00Z',
  },
  {
    id: 'cntr-003',
    caseId: DEMO_CASE_ID,
    title: 'Suspect Denies Accomplice Contact vs CDR 38-Second Voice Call',
    severity: 'high',
    category: 'statement_inconsistency',
    claimA: {
      evidenceId: 'ev-007',
      evidenceTitle: 'Interrogation Transcription of Sachin Gaikwad (Wakad PS)',
      excerpt:
        '“No, I haven’t talked to Nilesh Shinde since he was fired from the store six months ago.”',
      speakerOrSource: 'Sachin Suresh Gaikwad',
      timestamp: '2025-10-25T14:30:00Z',
      location: 'Wakad Police Station',
    },
    claimB: {
      evidenceId: 'ev-004',
      evidenceTitle: 'Reliance Jio Cellular Tower CDR & Cell ID Mast Records',
      excerpt:
        '“22:24:05 IST: Outgoing voice call (duration: 38 sec) from Gaikwad to +91-97640-11209 (Nilesh Baban Shinde) connected via Wakad Tower.”',
      speakerOrSource: 'Jio Nodal CDR Telemetry',
      timestamp: '2025-10-24T22:24:05Z',
      location: 'Wakad Datta Mandir Tower Sector',
    },
    explanation:
      'Gaikwad categorically denies any communication with ex-guard Nilesh Shinde, but telecommunication CDR confirms a connected 38-second conversation initiated six minutes after Door 2B was unlocked. FSL Pune subsequently identified Shinde’s latent fingerprints on the safe box.',
    alternativeExplanations: [
      'Accidental pocket dial that rang and connected to voicemail (contradicted by 38-second active two-way voice duration).',
    ],
    suggestedVerificationSteps: [
      'Obtain tower location of Nilesh Shinde’s phone (+91-97640-11209) at 22:24 to confirm if he was already inside or near the shop.',
      'Execute raid on Nilesh Shinde’s residence near Indrayani Nagar, Bhosari MIDC.',
    ],
    reviewStatus: 'confirmed_inconsistency',
    investigatorNotes:
      'Crime Branch Unit 2 dispatched to Bhosari MIDC. Nilesh Shinde detained with Yamaha motorcycle and black rucksack.',
    reviewedBy: 'Sr. PI Vitthal More',
    updatedAt: '2025-10-25T17:15:00Z',
  },
  {
    id: 'cntr-004',
    caseId: DEMO_CASE_ID,
    title: 'Keypad Bypass Knowledge: Exclusive Access Claim vs OmniLock First-Try Entry',
    severity: 'medium',
    category: 'statement_inconsistency',
    claimA: {
      evidenceId: 'ev-001',
      evidenceTitle: 'First Information Report (FIR No. 0389/2025, Wakad PS)',
      excerpt:
        '“Only two individuals possessed this confidential emergency master code: myself and Store Operations Manager Sachin Gaikwad.”',
      speakerOrSource: 'Rajesh Kothari (Complainant)',
      timestamp: '2025-10-25T06:45:00Z',
      location: 'Wakad Police Station',
    },
    claimB: {
      evidenceId: 'ev-005',
      evidenceTitle: 'OmniLock Digital Keypad EEPROM Controller Dump',
      excerpt:
        '“22:18:02 IST: EMERGENCY PIN ENTRY [#7291] - MATCH CONFIRMED. No brute-force invalid code attempts registered.”',
      speakerOrSource: 'OmniLock Hardware EEPROM Dump',
      timestamp: '2025-10-24T22:18:02Z',
      location: 'Door 2B Keypad Terminal, Wakad',
    },
    explanation:
      'If Rajesh Kothari was at the Rotary dinner in Hinjawadi and Gaikwad was the only other codeholder, either Gaikwad operated the keypad or leaked PIN #7291 to accomplices. The lack of any failed trial attempts indicates exact knowledge of the PIN.',
    alternativeExplanations: [
      'PIN #7291 was known to third-party keypad maintenance engineers or previous staff.',
      'Keypad was compromised via optical hidden camera or hardware skimmer.',
    ],
    suggestedVerificationSteps: [
      'Audit installer logs from Godrej / OmniLock Pune Regional Office (Shivajinagar).',
      'Check keypad housing for micro-drills, taps, or skimmer implants.',
    ],
    reviewStatus: 'under_review',
    investigatorNotes: 'Hardware examination complete: no skimmer found. Code was entered directly by authorized possessor.',
    reviewedBy: 'API Sagar Patil',
    updatedAt: '2025-10-25T15:00:00Z',
  },
];

export const demoGaps: InvestigationGap[] = [
  {
    id: 'gap-001',
    caseId: DEMO_CASE_ID,
    title: 'Unaccounted 22-Minute Window Between Dange Chowk and Bhumkar Chowk for Creta MH-14-GX-8842',
    category: 'unexplained_period',
    severity: 'critical',
    description:
      'ANPR Camera Pole #WK-44 at Dange Chowk captured Creta MH-14-GX-8842 at 22:36:12. The vehicle was next recorded at Bhumkar Chowk at 22:58:40. Standard transit duration between these two points via Hinjawadi Flyover is 6 to 8 minutes. 14 to 16 minutes remain unexplained.',
    whyItMatters:
      'During this unaccounted window, stolen jewellery could have been offloaded to an accomplice or transferred to another vehicle in Hinjawadi Phase 1 or Tathawade.',
    whatIsUnknown:
      'Exact route and intermediate stops taken by the vehicle between Dange Chowk and Bhumkar Chowk.',
    relatedEvidenceIds: ['ev-003', 'ev-008'],
    relatedEntityIds: ['ent-creta-car', 'ent-dange-chowk', 'ent-bhumkar-chowk'],
    suggestedNextStep:
      'Pull private commercial CCTV from petrol pumps and hotels along Tathawade / Dange Chowk BRTS road (HP Petrol Pump & Ginger Hotel junction).',
    status: 'investigating',
    createdAt: '2025-10-25T13:30:00Z',
    updatedAt: '2025-10-25T16:00:00Z',
  },
  {
    id: 'gap-002',
    caseId: DEMO_CASE_ID,
    title: 'Unidentified Pillion Rider on Yamaha FZ (MH-14-FA-5120) heading toward Hinjawadi Phase 2',
    category: 'unidentified_entity',
    severity: 'critical',
    description:
      'Traffic camera near Bhumkar Chowk captured Yamaha motorcycle MH-14-FA-5120 (registered to Nilesh Shinde) carrying a pillion rider holding a dark rucksack at 22:42. Both riders were wearing helmets with tinted visors.',
    whyItMatters:
      'The pillion rider may be the primary handler transporting the stolen diamonds away from the getaway car.',
    whatIsUnknown: 'Identity of the pillion rider on motorcycle MH-14-FA-5120.',
    relatedEvidenceIds: ['ev-003', 'ev-006'],
    relatedEntityIds: ['ent-nilesh-shinde', 'ent-bhumkar-chowk'],
    suggestedNextStep:
      'Check CCTV cameras along Hinjawadi Phase 2 Ring Road and Megapolis circle for motorcycle stops or helmet removal.',
    status: 'open',
    createdAt: '2025-10-25T14:30:00Z',
    updatedAt: '2025-10-25T14:30:00Z',
  },
  {
    id: 'gap-003',
    caseId: DEMO_CASE_ID,
    title: 'Installer Provisioning & Default PIN Audit from OmniLock Pune Regional Office',
    category: 'missing_record',
    severity: 'moderate',
    description:
      'Complainant claimed only he and Gaikwad held PIN #7291. It has not yet been verified whether the security installer changed the master code upon commissioning or if it was recorded in vendor service logs.',
    whyItMatters:
      'If the PIN was known to security contractors or technicians, an external actor could have entered without Gaikwad’s active collusion.',
    whatIsUnknown:
      'Original setup date and service engineer records for OmniLock keypad installation at Kothari Jewellers.',
    relatedEvidenceIds: ['ev-001', 'ev-005'],
    relatedEntityIds: ['ent-door-2b', 'ent-rajesh-kothari', 'ent-sachin-gaikwad'],
    suggestedNextStep:
      'Serve notice under Section 91 Cr.P.C. / BNSS to OmniLock security vendor (Shivajinagar, Pune) for complete installation and technician logs.',
    status: 'open',
    createdAt: '2025-10-25T15:00:00Z',
    updatedAt: '2025-10-25T15:00:00Z',
  },
  {
    id: 'gap-004',
    caseId: DEMO_CASE_ID,
    title: 'Missing Rear Alley CCTV Feed Behind Datta Mandir Road Arcade',
    category: 'missing_cctv',
    severity: 'moderate',
    description:
      'The municipal smart city CCTV pole WK-42 covering Datta Mandir back lane was out of order due to road trenching work by PCMC water supply department on 24-Oct.',
    whyItMatters:
      'There is no direct governmental optical recording of the physical ingress at Door 2B between 22:15 and 22:35.',
    whatIsUnknown: 'Exact physical count and facial appearance of individuals entering Door 2B.',
    relatedEvidenceIds: ['ev-001', 'ev-005', 'ev-006'],
    relatedEntityIds: ['ent-door-2b', 'ent-kothari-store'],
    suggestedNextStep:
      'Seize standalone private CCTV hard drives from neighbouring Apollo Pharmacy and Shriram Sweet Mart rear corridors.',
    status: 'open',
    createdAt: '2025-10-25T15:30:00Z',
    updatedAt: '2025-10-25T15:30:00Z',
  },
];

export const demoMessages: AIMessage[] = [
  {
    id: 'msg-001',
    caseId: DEMO_CASE_ID,
    role: 'assistant',
    content:
      'Welcome to **The Third Eye Investigation Intelligence System**.\n\nActive Investigation loaded: **FIR No. 0389/2025 (Wakad Police Station, Pimpri Chinchwad Police Commissionerate)** — *Kothari Jewellers Vault Breach & Dacoity*.\n\nAll optical feeds (PCMC Smart City ICCC Nigdi), telecom cell records (Reliance Jio Wakad Tower), and forensic reports (FSL Pune) have been indexed and cross-referenced.\n\n**Key Alerts Ready for Officer Action:**\n- 🔴 **High Conflict:** Primary suspect Sachin Gaikwad’s dining alibi at Pimple Saudagar is disproven by Jio Cell Tower CDR (Wakad) and PCMC ANPR (Dange Chowk).\n- 🔴 **Forensic Hit:** FSL Pune lifted latent fingerprint matching ex-guard Nilesh Shinde on Vault Safe Box #4.\n- ⚠️ **Vehicle Alert:** White Hyundai Creta MH-14-GX-8842 tracked exiting outbound via Somatane Toll Plaza.\n\n*Reminder: AI recommendations are analytical aids. Factual determinations and police actions remain strictly with the Investigating Officer.*',
    timestamp: '2025-10-25T17:30:00Z',
    suggestedFollowUps: [
      'Show evidence directly disproving Sachin Gaikwad’s alibi.',
      'What connects ex-guard Nilesh Shinde to the crime scene?',
      'Track movement of Hyundai Creta MH-14-GX-8842 from Wakad to Somatane.',
      'What are the most critical investigative gaps remaining?',
    ],
  },
];

export const demoAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    caseId: DEMO_CASE_ID,
    timestamp: '2025-10-25T06:45:00Z',
    actor: 'Sr. PI Vitthal More (Wakad PS)',
    action: 'CASE_CREATED',
    details: 'Registered FIR No. 0389/2025 under BNS 309(4), 310(2), 61(2) & IT Act 66C. Priority: HIGH.',
  },
  {
    id: 'log-002',
    caseId: DEMO_CASE_ID,
    timestamp: '2025-10-25T12:30:00Z',
    actor: 'PCMC Smart City ICCC Nigdi',
    action: 'EVIDENCE_INGESTED',
    details: 'ANPR telemetry from Dange Chowk Pole #WK-44 imported and verified.',
  },
  {
    id: 'log-003',
    caseId: DEMO_CASE_ID,
    timestamp: '2025-10-25T13:45:00Z',
    actor: 'API Sagar Patil (Cyber Cell PCPC)',
    action: 'EVIDENCE_INGESTED',
    details: 'Reliance Jio Pune LSA CDR Records for +91-98224-09182 verified and ingested.',
  },
  {
    id: 'log-004',
    caseId: DEMO_CASE_ID,
    timestamp: '2025-10-25T15:45:00Z',
    actor: 'The Third Eye AI Intelligence Engine',
    action: 'CONTRADICTION_FLAGGED',
    details: 'Identified High-severity conflict between Statement EV-002 (Pimple Saudagar) and CDR EV-004 (Wakad Tower).',
  },
  {
    id: 'log-005',
    caseId: DEMO_CASE_ID,
    timestamp: '2025-10-25T16:15:00Z',
    actor: 'Sr. PI Vitthal More',
    action: 'CONTRADICTION_REVIEWED',
    details: 'Marked Contradiction CNTR-001 as CONFIRMED_INCONSISTENCY. Raid team dispatched.',
  },
];

type PresentationEvidenceInput = {
  id: string;
  caseId: string;
  title: string;
  timestamp: string;
  detail: string;
  evidenceType: EvidenceType;
  entityIds: string[];
  eventIds: string[];
};

function makePresentationEvidence(input: PresentationEvidenceInput): EvidenceItem {
  return {
    id: input.id,
    caseId: input.caseId,
    title: input.title,
    evidenceType: input.evidenceType,
    sourceDescription: 'Official PCPC Police Commissionerate forensic exhibit & verified case investigation record.',
    dateReceived: input.timestamp,
    eventTime: input.timestamp,
    recordedBy: 'Investigating Officer / Crime Branch PCPC',
    processingStatus: 'processed',
    verificationStatus: 'verified',
    extractedText: input.detail,
    sourceProvenance: {
      origin: 'Pimpri Chinchwad Police Commissionerate Station Diary / Forensic Dossier',
      collector: 'Crime Branch / Forensic Science Laboratory (FSL Pune)',
      chainOfCustody: ['Seized at crime scene', 'FSL Pune Ballistics/Forensic Desk', 'PCPC Case Records Repository'],
      collectedAt: input.timestamp,
    },
    relatedEntityIds: input.entityIds,
    relatedEventIds: input.eventIds,
    claims: [],
    createdAt: input.timestamp,
    updatedAt: input.timestamp,
  };
}

function makePresentationEntity(
  id: string,
  caseId: string,
  name: string,
  category: Entity['category'],
  evidenceIds: string[],
  timestamp: string
): Entity {
  return {
    id,
    caseId,
    name,
    category,
    role: 'person_of_interest',
    details: { recordType: 'PCPC Verified Case Entity' },
    status: 'verified',
    notes: 'Verified case entity logged in Pimpri Chinchwad Police records dossier.',
    sourceEvidenceIds: evidenceIds,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

function makePresentationEvent(
  id: string,
  caseId: string,
  title: string,
  timestamp: string,
  timeDisplay: string,
  description: string,
  location: string,
  entityIds: string[],
  evidenceId: string
): EventItem {
  return {
    id,
    caseId,
    title,
    timestamp,
    timeDisplay,
    timePrecision: 'exact',
    description,
    location,
    associatedEntityIds: entityIds,
    sourceEvidenceId: evidenceId,
    verificationStatus: 'verified',
    confidence: 0.95,
    createdAt: timestamp,
  };
}

function makePresentationRelationship(
  id: string,
  caseId: string,
  sourceEntityId: string,
  targetEntityId: string,
  relationshipType: EntityRelationship['relationshipType'],
  label: string,
  evidenceId: string
): EntityRelationship {
  return {
    id,
    caseId,
    sourceEntityId,
    targetEntityId,
    relationshipType,
    label,
    description: 'Corroborated relationship verified via CDR analysis, ANPR hit or surveillance evidence.',
    supportingEvidenceIds: [evidenceId],
    verificationStatus: 'verified',
    confidence: 0.9,
  };
}

function makePresentationGap(
  id: string,
  caseId: string,
  title: string,
  category: InvestigationGap['category'],
  whatIsUnknown: string,
  suggestedNextStep: string,
  evidenceIds: string[],
  entityIds: string[],
  timestamp: string,
  status: InvestigationGap['status'] = 'open'
): InvestigationGap {
  return {
    id,
    caseId,
    title,
    category,
    severity: 'moderate',
    description: 'Active investigative line requiring statutory or inter-agency corroboration.',
    whyItMatters: 'Critical milestone required for filing formal chargesheet in PCPC Session Court.',
    whatIsUnknown,
    relatedEvidenceIds: evidenceIds,
    relatedEntityIds: entityIds,
    suggestedNextStep,
    status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export const presentationEvidence: EvidenceItem[] = [
  // Chakan Case Evidence
  makePresentationEvidence({
    id: 'ev-pcpc-chakan-ballistics', caseId: 'case-pcpc-chakan-2025', title: 'Ballistic Analysis Report: 7.65mm Spent Cartridges (FSL Pune)',
    timestamp: '2025-01-21T11:30:00Z', evidenceType: 'forensic_report',
    detail: 'Forensic Ballistics Division examination of fired 7.65mm cartridge cases recovered at Kailas Steel crime scene in Chakan MIDC. Firing pin marks and breech face striations match country-made firearm seized from accused Sangram Anant Singh and Rohit Pandey.',
    entityIds: ['ent-pcpc-chakan-shinde', 'ent-pcpc-chakan-site'], eventIds: ['evt-pcpc-chakan-ambush'],
  }),
  makePresentationEvidence({
    id: 'ev-pcpc-chakan-anpr', caseId: 'case-pcpc-chakan-2025', title: 'Smart City ANPR Transit Hit: Motorcycle Transit near HP Chowk',
    timestamp: '2025-01-20T16:02:00Z', evidenceType: 'cctv_observation',
    detail: 'PCPC Integrated Command and Control Centre (ICCC) ANPR camera at HP Chowk Junction logged two covered riders on motorcycle transiting westbound towards Talegaon 12 minutes post-incident.',
    entityIds: ['ent-pcpc-chakan-bike', 'ent-pcpc-chakan-site'], eventIds: ['evt-pcpc-chakan-transit'],
  }),
  makePresentationEvidence({
    id: 'ev-pcpc-chakan-cdr', caseId: 'case-pcpc-chakan-2025', title: 'Airtel Tower Triangulation (Chakan Phase II)',
    timestamp: '2025-01-20T15:35:00Z', evidenceType: 'digital_record',
    detail: 'Airtel tower mast Cell ID 404-869-21943 logged target mobile handsets of Sangram Anant Singh and shooters actively dwelling within 300 meters of industrial factory gate prior to ambush.',
    entityIds: ['ent-pcpc-chakan-shinde', 'ent-pcpc-chakan-site'], eventIds: ['evt-pcpc-chakan-ambush'],
  }),

  // Cyber Crime Case Evidence
  makePresentationEvidence({
    id: 'ev-pcpc-cyber-mule-audit', caseId: 'case-pcpc-cyber-2025', title: 'Financial Intelligence Unit Mule Account Laundering Audit Trail',
    timestamp: '2025-06-12T14:20:00Z', evidenceType: 'digital_record',
    detail: 'Immediate RTGS outflow of ₹4.85 Crores from complainant HDFC account traced into 14 layered mule accounts in Surat and Ahmedabad, with ₹2.10 Crores frozen under Section 106 BNSS.',
    entityIds: ['ent-pcpc-cyber-complainant', 'ent-pcpc-cyber-mules'], eventIds: ['evt-pcpc-cyber-transfer'],
  }),
  makePresentationEvidence({
    id: 'ev-pcpc-cyber-voip-logs', caseId: 'case-pcpc-cyber-2025', title: 'Skype/Telegram VoIP Session & Fake Arrest Warrant Exhibit',
    timestamp: '2025-06-11T12:00:00Z', evidenceType: 'digital_record',
    detail: 'Complainant extracted digital evidence showing forged CBI/ED arrest warrant with fake stamp and video recording of impostor officer demanding RTGS collateral.',
    entityIds: ['ent-pcpc-cyber-complainant', 'ent-pcpc-cyber-syndicate'], eventIds: ['evt-pcpc-cyber-call'],
  }),

  // Bhosari Case Evidence
  makePresentationEvidence({
    id: 'ev-pcpc-bhosari-panchnama', caseId: 'case-pcpc-bhosari-2025', title: 'Scorpio Vehicle Interception & Country Weapon Seizure Panchnama',
    timestamp: '2025-04-04T09:15:00Z', evidenceType: 'physical_evidence',
    detail: 'Anti-Extortion Cell intercepted black Mahindra Scorpio (MH-14-EA-9110) near Alandi Phata. Seized 1 loaded desi katta, 4 live cartridges, and victim mobile phone.',
    entityIds: ['ent-pcpc-bhosari-gang', 'ent-pcpc-bhosari-scorpio'], eventIds: ['evt-pcpc-bhosari-rescue'],
  }),
  makePresentationEvidence({
    id: 'ev-pcpc-bhosari-statement', caseId: 'case-pcpc-bhosari-2025', title: 'Rescued Merchant Deposition & Interrogation of Accused (MCOCA)',
    timestamp: '2025-04-04T12:30:00Z', evidenceType: 'witness_statement',
    detail: 'Victim statement corroborated abduction from Sector 7 scrap godown and identification of history-sheeter Balu Gawade directing the ransom demands.',
    entityIds: ['ent-pcpc-bhosari-victim', 'ent-pcpc-bhosari-gang'], eventIds: ['evt-pcpc-bhosari-abduction'],
  }),

  // Chikhali ATM Heist Evidence
  makePresentationEvidence({
    id: 'ev-pcpc-chikhali-cctv', caseId: 'case-pcpc-chikhali-2025', title: 'HDFC ATM Booth Tampered CCTV Footage & Black Spray Residue',
    timestamp: '2025-08-09T03:08:00Z', evidenceType: 'cctv_observation',
    detail: 'Kudalwadi booth CCTV logged two masked intruders blacking out exterior lens with aerosol paint at 03:08 AM followed by intense thermal torch illumination from inside.',
    entityIds: ['ent-pcpc-chikhali-atm', 'ent-pcpc-chikhali-gang'], eventIds: ['evt-pcpc-chikhali-tamper'],
  }),
  makePresentationEvidence({
    id: 'ev-pcpc-chikhali-fsl', caseId: 'case-pcpc-chikhali-2025', title: 'FSL Chemical Residue & Discarded Gas Cylinder Forensic Report',
    timestamp: '2025-08-09T10:00:00Z', evidenceType: 'forensic_report',
    detail: 'Forensics recovered discarded 5kg commercial oxygen cylinder serial #OX-771892 with iron oxide slag and burnt currency notes (₹500 denomination fragments totaling ₹4.2 Lakhs).',
    entityIds: ['ent-pcpc-chikhali-atm', 'ent-pcpc-chikhali-cylinder'], eventIds: ['evt-pcpc-chikhali-breach'],
  }),
];

export const presentationEntities: Entity[] = [
  makePresentationEntity('ent-pcpc-chakan-victim', 'case-pcpc-chakan-2025', 'Ajay Vikram Singh (Firm Manager / Victim)', 'person', ['ev-pcpc-chakan-ballistics'], '2025-01-20T15:40:00Z'),
  makePresentationEntity('ent-pcpc-chakan-shinde', 'case-pcpc-chakan-2025', 'Sangram alias Chandan Anant Singh (Prime Accused / Conspirator)', 'person', ['ev-pcpc-chakan-ballistics', 'ev-pcpc-chakan-cdr'], '2025-01-20T15:40:00Z'),
  makePresentationEntity('ent-pcpc-chakan-pandey', 'case-pcpc-chakan-2025', 'Rohit Sudhan Pandey (Accomplice / Weapons Custody)', 'person', ['ev-pcpc-chakan-ballistics'], '2025-01-20T15:40:00Z'),
  makePresentationEntity('ent-pcpc-chakan-site', 'case-pcpc-chakan-2025', 'Kailas Steel Factory Premises (Chakan MIDC Phase II)', 'location', ['ev-pcpc-chakan-ballistics', 'ev-pcpc-chakan-anpr'], '2025-01-20T15:40:00Z'),
  makePresentationEntity('ent-pcpc-chakan-bike', 'case-pcpc-chakan-2025', 'Getaway Motorcycle (Unregistered)', 'vehicle', ['ev-pcpc-chakan-anpr'], '2025-01-20T16:02:00Z'),

  // Cyber Crime Case Entities
  makePresentationEntity('ent-pcpc-cyber-complainant', 'case-pcpc-cyber-2025', 'Sudhir Kulkarni (VP Engineering)', 'person', ['ev-pcpc-cyber-mule-audit', 'ev-pcpc-cyber-voip-logs'], '2025-06-11T11:20:00Z'),
  makePresentationEntity('ent-pcpc-cyber-syndicate', 'case-pcpc-cyber-2025', 'Global Scam Syndicate (Bangkok / Dubai Hub)', 'organization', ['ev-pcpc-cyber-voip-logs'], '2025-06-11T11:20:00Z'),
  makePresentationEntity('ent-pcpc-cyber-mules', 'case-pcpc-cyber-2025', 'Surat & Ahmedabad Shell Current Accounts', 'organization', ['ev-pcpc-cyber-mule-audit'], '2025-06-12T14:20:00Z'),

  // Bhosari Case Entities
  makePresentationEntity('ent-pcpc-bhosari-victim', 'case-pcpc-bhosari-2025', 'Kailash Choudhary (Scrap Merchant)', 'person', ['ev-pcpc-bhosari-statement'], '2025-04-03T20:15:00Z'),
  makePresentationEntity('ent-pcpc-bhosari-gang', 'case-pcpc-bhosari-2025', 'Balu Gawade Extortion Gang', 'organization', ['ev-pcpc-bhosari-panchnama', 'ev-pcpc-bhosari-statement'], '2025-04-03T20:15:00Z'),
  makePresentationEntity('ent-pcpc-bhosari-scorpio', 'case-pcpc-bhosari-2025', 'Black Mahindra Scorpio (MH-14-EA-9110)', 'vehicle', ['ev-pcpc-bhosari-panchnama'], '2025-04-04T09:15:00Z'),

  // Chikhali Case Entities
  makePresentationEntity('ent-pcpc-chikhali-atm', 'case-pcpc-chikhali-2025', 'HDFC Bank ATM (Kudalwadi Chowk)', 'location', ['ev-pcpc-chikhali-cctv', 'ev-pcpc-chikhali-fsl'], '2025-08-09T03:08:00Z'),
  makePresentationEntity('ent-pcpc-chikhali-gang', 'case-pcpc-chikhali-2025', 'Mewat Inter-State Gas-Cutter Gang', 'organization', ['ev-pcpc-chikhali-cctv'], '2025-08-09T03:08:00Z'),
  makePresentationEntity('ent-pcpc-chikhali-cylinder', 'case-pcpc-chikhali-2025', 'Industrial Oxy-Acetylene Cylinder #OX-771892', 'device', ['ev-pcpc-chikhali-fsl'], '2025-08-09T10:00:00Z'),
];

export const presentationEvents: EventItem[] = [
  // Chakan Events
  makePresentationEvent('evt-pcpc-chakan-ambush', 'case-pcpc-chakan-2025', 'Gunfire ambush discharged at victim SUV', '2025-02-14T19:40:00Z', '07:40 PM', 'Two motorcycle assailants opened fire with 7.65mm pistol at industrialist car outside factory gate.', 'Chakan MIDC Phase II', ['ent-pcpc-chakan-victim', 'ent-pcpc-chakan-shinde'], 'ev-pcpc-chakan-ballistics'),
  makePresentationEvent('evt-pcpc-chakan-transit', 'case-pcpc-chakan-2025', 'ANPR gateway surveillance hit at HP Chowk', '2025-02-14T19:48:00Z', '07:48 PM', 'Smart City cameras captured getaway Pulsar motorcycle at HP Chowk heading toward Talegaon.', 'HP Chowk, Chakan', ['ent-pcpc-chakan-bike'], 'ev-pcpc-chakan-anpr'),

  // Cyber Crime Events
  makePresentationEvent('evt-pcpc-cyber-call', 'case-pcpc-cyber-2025', 'Digital arrest video call initiated', '2025-06-11T11:20:00Z', '11:20 AM', 'Impostors impersonating ED officials placed victim under coercive Skype surveillance.', 'Hinjawadi Phase 1', ['ent-pcpc-cyber-complainant', 'ent-pcpc-cyber-syndicate'], 'ev-pcpc-cyber-voip-logs'),
  makePresentationEvent('evt-pcpc-cyber-transfer', 'case-pcpc-cyber-2025', 'Forced RTGS transactions cleared', '2025-06-12T14:15:00Z', '02:15 PM', 'Victim transferred ₹4.85 Crores in 4 tranches into mule accounts across Surat and Ahmedabad.', 'Surat / Ahmedabad', ['ent-pcpc-cyber-mules'], 'ev-pcpc-cyber-mule-audit'),

  // Bhosari Events
  makePresentationEvent('evt-pcpc-bhosari-abduction', 'case-pcpc-bhosari-2025', 'Merchant abducted from Sector 7 godown', '2025-04-03T20:15:00Z', '08:15 PM', 'Scrap merchant forced into Mahindra Scorpio at gunpoint; ₹50 Lakhs ransom demand issued.', 'Sector 7, Bhosari MIDC', ['ent-pcpc-bhosari-victim', 'ent-pcpc-bhosari-gang'], 'ev-pcpc-bhosari-statement'),
  makePresentationEvent('evt-pcpc-bhosari-rescue', 'case-pcpc-bhosari-2025', 'Tactical interception & hostage rescue', '2025-04-04T09:15:00Z', '09:15 AM', 'Anti-Extortion Cell intercepted Scorpio near Alandi Phata; victim rescued unharmed and 3 detained.', 'Alandi Phata, PCPC', ['ent-pcpc-bhosari-scorpio', 'ent-pcpc-bhosari-gang'], 'ev-pcpc-bhosari-panchnama'),

  // Chikhali Events
  makePresentationEvent('evt-pcpc-chikhali-tamper', 'case-pcpc-chikhali-2025', 'CCTV spray-paint sabotage logged', '2025-08-09T03:08:00Z', '03:08 AM', 'Perpetrators blinded CCTV exterior camera using dark aerosol paint spray.', 'Kudalwadi, Chikhali', ['ent-pcpc-chikhali-atm', 'ent-pcpc-chikhali-gang'], 'ev-pcpc-chikhali-cctv'),
  makePresentationEvent('evt-pcpc-chikhali-breach', 'case-pcpc-chikhali-2025', 'Gas-cutter thermal cutting & cash combustion', '2025-08-09T03:18:00Z', '03:18 AM', 'Thermal lance cutting ignited cash tray fire; ₹18.5L in currency notes damaged, alarm triggered.', 'Kudalwadi, Chikhali', ['ent-pcpc-chikhali-atm', 'ent-pcpc-chikhali-cylinder'], 'ev-pcpc-chikhali-fsl'),
];

export const presentationRelationships: EntityRelationship[] = [
  makePresentationRelationship('rel-pcpc-chakan-target', 'case-pcpc-chakan-2025', 'ent-pcpc-chakan-shinde', 'ent-pcpc-chakan-victim', 'conflicts_with', 'Extortion target', 'ev-pcpc-chakan-ballistics'),
  makePresentationRelationship('rel-pcpc-chakan-transit', 'case-pcpc-chakan-2025', 'ent-pcpc-chakan-shinde', 'ent-pcpc-chakan-bike', 'associate', 'Getaway vehicle rider', 'ev-pcpc-chakan-anpr'),
  makePresentationRelationship('rel-pcpc-cyber-fraud', 'case-pcpc-cyber-2025', 'ent-pcpc-cyber-syndicate', 'ent-pcpc-cyber-complainant', 'conflicts_with', 'Digital arrest victim', 'ev-pcpc-cyber-voip-logs'),
  makePresentationRelationship('rel-pcpc-cyber-flow', 'case-pcpc-cyber-2025', 'ent-pcpc-cyber-complainant', 'ent-pcpc-cyber-mules', 'associate', 'RTGS mule transfers', 'ev-pcpc-cyber-mule-audit'),
  makePresentationRelationship('rel-pcpc-bhosari-abduct', 'case-pcpc-bhosari-2025', 'ent-pcpc-bhosari-gang', 'ent-pcpc-bhosari-victim', 'conflicts_with', 'Kidnapping victim', 'ev-pcpc-bhosari-statement'),
  makePresentationRelationship('rel-pcpc-bhosari-vehicle', 'case-pcpc-bhosari-2025', 'ent-pcpc-bhosari-gang', 'ent-pcpc-bhosari-scorpio', 'associate', 'Transport vehicle', 'ev-pcpc-bhosari-panchnama'),
  makePresentationRelationship('rel-pcpc-chikhali-target', 'case-pcpc-chikhali-2025', 'ent-pcpc-chikhali-gang', 'ent-pcpc-chikhali-atm', 'present_at', 'Robbery target', 'ev-pcpc-chikhali-cctv'),
  makePresentationRelationship('rel-pcpc-chikhali-tool', 'case-pcpc-chikhali-2025', 'ent-pcpc-chikhali-gang', 'ent-pcpc-chikhali-cylinder', 'associate', 'Breaching tool', 'ev-pcpc-chikhali-fsl'),
];

export const presentationContradictions: ContradictionFinding[] = [
  {
    id: 'cntr-pcpc-chakan-alibi',
    caseId: 'case-pcpc-chakan-2025',
    title: 'Accused claimed working in Talegaon; Airtel CDR proves presence at Chakan MIDC gate',
    severity: 'high',
    category: 'alibi_discrepancy',
    claimA: {
      evidenceId: 'ev-pcpc-chakan-interrogation',
      evidenceTitle: 'Accused Sangram Anant Singh Initial Statement',
      excerpt: 'I was in our Talegaon workshop during the afternoon and evening and never traveled to Chakan Phase II on the day of firing.',
      speakerOrSource: 'Sangram alias Chandan Anant Singh (Accused)',
      timestamp: '2025-01-20T15:35:00Z',
      location: 'Talegaon Dabhade',
    },
    claimB: {
      evidenceId: 'ev-pcpc-chakan-cdr',
      evidenceTitle: 'Airtel Tower Triangulation (Chakan Phase II)',
      excerpt: 'Cell ID 404-869-21943 logged target mobile handsets dwelling within 300m of Kailas Steel crime scene at 15:35 IST.',
      speakerOrSource: 'Telecom CDR Analysis / PCPC Cyber Cell',
      timestamp: '2025-01-20T15:35:00Z',
      location: 'Chakan MIDC Phase II',
    },
    explanation: 'Accused asserts an alibi in Talegaon, directly refuted by Airtel cell tower triangulation and highway camera timestamp alignment.',
    alternativeExplanations: ['Handset carried by an accomplice', 'Tower signal spillover'],
    suggestedVerificationSteps: ['Cross-reference CCTV footage along Talegaon-Chakan connector', 'Interrogate accomplice Rohit Pandey'],
    reviewStatus: 'confirmed_inconsistency',
    investigatorNotes: 'Alibi completely dismantled by forensic CDR and ANPR timestamp alignment.',
    updatedAt: '2025-02-16T14:00:00Z',
  },
];

export const presentationGaps: InvestigationGap[] = [
  {
    id: 'gap-pcpc-cyber-mules', caseId: 'case-pcpc-cyber-2025', title: 'Trace end-beneficiary crypto conversion off-ramps', category: 'missing_record', severity: 'critical',
    description: 'Outflow analysis indicates ₹2.75 Crores converted into USDT on P2P trading platforms.', whyItMatters: 'Locating the off-ramps is required to issue freezing orders and identify syndicate handlers.',
    whatIsUnknown: 'Wallet addresses used for the final P2P fiat conversion.', relatedEvidenceIds: ['ev-pcpc-cyber-mule-audit'], relatedEntityIds: ['ent-pcpc-cyber-syndicate'],
    suggestedNextStep: 'Issue 91 CrPC / BNSS 94 notice to Binance/WazirX compliance desks for KYC on flagged transaction hashes.', status: 'open', createdAt: '2025-06-13T10:00:00Z', updatedAt: '2025-06-13T10:00:00Z',
  },
  {
    id: 'gap-pcpc-chikhali-vehicle', caseId: 'case-pcpc-chikhali-2025', title: 'Toll plaza FASTag lookup for Bolero pickup', category: 'missing_cctv', severity: 'moderate',
    description: 'Getaway vehicle tyre impressions match Bolero camper pickup heading north towards Nashik.', whyItMatters: 'FASTag capture confirms vehicle registration and syndicate interstate transit origin.',
    whatIsUnknown: 'FASTag tag ID at Moshi and Chandoli toll plazas during 03:30 - 05:00 AM window.', relatedEvidenceIds: ['ev-pcpc-chikhali-cctv'], relatedEntityIds: ['ent-pcpc-chikhali-gang'],
    suggestedNextStep: 'Subpoena IHMCL server logs for Chandoli Toll Plaza on NH-60 for matching vehicle class.', status: 'investigating', createdAt: '2025-08-10T12:00:00Z', updatedAt: '2025-08-10T12:00:00Z',
  },
];

export const presentationAuditLogs: AuditLog[] = demoCases.map((item) => ({
  id: `log-pcpc-${item.id}`,
  caseId: item.id,
  timestamp: item.createdAt,
  actor: 'PCPC Investigation Registry',
  action: 'AUTHENTIC_CASE_FILE_INGESTED',
  details: `Verified Pimpri Chinchwad Police Case Record ingested: ${item.referenceNumber}`,
}));

export const initialStore: CaseStore = {
  cases: [...demoCases, demoCase],
  evidence: [...demoEvidence, ...presentationEvidence],
  entities: [...demoEntities, ...presentationEntities],
  events: [...demoEvents, ...presentationEvents],
  relationships: [...demoRelationships, ...presentationRelationships],
  contradictions: [...demoContradictions, ...presentationContradictions],
  gaps: [...demoGaps, ...presentationGaps],
  assistantMessages: demoMessages,
  auditLogs: [...demoAuditLogs, ...presentationAuditLogs],
};
