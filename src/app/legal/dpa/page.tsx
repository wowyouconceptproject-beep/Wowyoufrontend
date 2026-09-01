import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Purpose of this DPA",
    paragraphs: [
      "This Data Processing Agreement governs the processing of personal data by wowyou concepts on behalf of the Customer in connection with the Customer's use of the WoWYou EventTech / EventOS platform.",
      "EventOS may be used for event planning, registration, ticketing, digital passes, QR check-in, attendee engagement, networking, analytics, AI-assisted event workflows, sponsor and vendor management, communications and related platform services.",
      "This DPA applies where wowyou concepts processes personal data as a processor on behalf of the Customer.",
      "Where wowyou concepts determines the purposes and means of processing, including for its own account administration, billing, security, platform improvement, marketing or legal compliance, wowyou concepts acts as an independent controller and that processing is governed by the EventOS Privacy Policy.",
    ],
  },

  {
    title: "2. Definitions",
    paragraphs: [
      "Applicable Data Protection Laws means all laws and regulations relating to the protection of personal data that apply to the processing, including where applicable the EU General Data Protection Regulation 2016/679, Irish data protection law, UK GDPR and Data Protection Act 2018, ePrivacy and cookie rules, and applicable African data protection laws in countries where EventOS operates or serves users.",
      "Controller, Processor, Personal Data, Processing, Data Subject, Personal Data Breach, Special Category Data and Sub-processor have the meanings given under Applicable Data Protection Laws.",
      "Customer Data means personal data processed by wowyou concepts on behalf of the Customer through EventOS.",
      "Services means the EventOS platform and related services provided by wowyou concepts.",
    ],
  },

  {
    title: "3. Roles of the Parties",
    paragraphs: [
      "The Customer is the Controller of Customer Data and determines the purpose and lawful basis for collecting and using personal data through EventOS.",
      "wowyou concepts is the Processor of Customer Data and processes such data only on documented instructions from the Customer, except where required by law.",
      "The Customer remains responsible for:",
    ],
    bullets: [
      "Providing any required privacy notices to data subjects.",
      "Identifying and documenting lawful bases for processing.",
      "Obtaining consents where required.",
      "Ensuring event registration forms are lawful and proportionate.",
      "Ensuring special category data is only collected where legally justified.",
      "Responding to data subject rights requests where the Customer is the controller.",
      "Complying with local event, employment, consumer, accessibility, safeguarding, marketing and data protection laws.",
    ],
  },

  {
  title: "4. Customer Instructions",
  paragraphs: [
    "The Customer instructs wowyou concepts to process Customer Data only as necessary to provide and operate the Services.",
    "wowyou concepts will inform the Customer if, in its opinion, an instruction infringes Applicable Data Protection Laws, unless prohibited from doing so by law.",
  ],
  bullets: [
    "Provide, operate, maintain and support EventOS.",
    "Manage registrations, ticketing, check-in and event workflows.",
    "Send event-related communications.",
    "Generate analytics and reports for the Customer.",
    "Enable attendee engagement and networking features.",
    "Provide AI-assisted features where enabled.",
    "Support security, fraud prevention, troubleshooting and service improvement.",
    "Comply with the Customer's documented instructions.",
    "Comply with legal obligations applicable to the Processor.",
  ],
},

  {
    title: "5. Description of Processing",
    paragraphs: [
      "The subject matter, duration, nature, purposes, categories of data subjects and categories of personal data processed under this DPA are described in Schedule 1.",
    ],
  },

  {
    title: "6. Confidentiality",
    paragraphs: [
      "wowyou concepts will ensure that persons authorised to process Customer Data are subject to appropriate confidentiality obligations.",
      "Access to Customer Data will be limited to personnel, contractors and authorised Sub-processors who need access for the purpose of providing the Services.",
    ],
  },

  {
    title: "7. Security Measures",
    paragraphs: [
      "wowyou concepts will implement appropriate technical and organisational measures to protect Customer Data against unauthorised or unlawful processing, accidental loss, destruction, damage, alteration or disclosure.",
      "These measures may include:",
    ],
    bullets: [
      "Access controls.",
      "Password and authentication controls.",
      "Role-based permissions.",
      "Encryption in transit and, where appropriate, at rest.",
      "Secure hosting.",
      "Logging and monitoring.",
      "Backup and recovery controls.",
      "Vulnerability management.",
      "Secure software development practices.",
      "Incident response procedures.",
      "Staff confidentiality controls.",
      "Supplier due diligence.",
      "Data minimisation and retention controls.",
    ],
  },

  {
  title: "8. Personal Data Breach",
  paragraphs: [
    "wowyou concepts will notify the Customer without undue delay after becoming aware of a Personal Data Breach affecting Customer Data.",
    "The notification will include, where available:",
    "wowyou concepts will provide reasonable assistance to the Customer in meeting applicable breach notification obligations.",
    "The Customer remains responsible for determining whether to notify a supervisory authority or affected data subjects unless wowyou concepts is legally required to do so.",
  ],
  bullets: [
    "A description of the nature of the breach.",
    "Categories and approximate number of affected data subjects.",
    "Categories and approximate number of affected records.",
    "Likely consequences.",
    "Measures taken or proposed to address the incident.",
    "Contact details for follow-up.",
  ],
},

  {
  title: "9. Data Subject Rights",
  paragraphs: [
    "wowyou concepts will provide reasonable assistance to the Customer to respond to data subject rights requests, including requests for:",
    "If wowyou concepts receives a request directly from a data subject relating to Customer Data, wowyou concepts will, where appropriate, forward the request to the Customer or advise the requester to contact the Customer directly.",
    "wowyou concepts will not respond to such requests on behalf of the Customer unless instructed or legally required.",
  ],
  bullets: [
    "Access.",
    "Rectification.",
    "Erasure.",
    "Restriction.",
    "Objection.",
    "Portability.",
    "Withdrawal of consent, where applicable.",
  ],
},

  {
    title: "10. Sub-processors",
    paragraphs: [
      "The Customer authorises wowyou concepts to engage Sub-processors to provide the Services.",
      "wowyou concepts will ensure that Sub-processors are bound by written obligations that provide an appropriate level of protection for Customer Data.",
      "wowyou concepts will maintain a current Sub-processor List through the published EventOS Sub-processors page.",
      "wowyou concepts will provide reasonable notice of material changes to Sub-processors where required by law or contract.",
      "The Customer may object to a new Sub-processor on reasonable data protection grounds. If the Customer objects, the Parties will work in good faith to resolve the concern. Where resolution is not possible, the Customer may stop using the affected Services.",
    ],
  },

 {
  title: "11. International Transfers",
  paragraphs: [
    "wowyou concepts will aim to process and store Customer Data within the EU/EEA, UK or other appropriate jurisdictions where practical.",
    "Where Customer Data is transferred outside the EU/EEA, UK or another jurisdiction with transfer restrictions, wowyou concepts will ensure that appropriate safeguards are in place.",
    "Such safeguards may include:",
    "Further transfer provisions are described in Schedule 4.",
  ],
  bullets: [
    "An adequacy decision.",
    "EU Standard Contractual Clauses.",
    "UK International Data Transfer Agreement.",
    "UK Addendum to the EU Standard Contractual Clauses.",
    "Equivalent local transfer mechanisms.",
    "Transfer risk assessments where required.",
    "Appropriate technical and organisational safeguards.",
  ],
},

  {
    title: "12. Special Category Data",
    paragraphs: [
      "EventOS is not designed to require Special Category Data by default.",
      "The Customer must not use EventOS to collect Special Category Data unless it has identified a lawful basis and, where required, a special condition for processing, provided clear notices to data subjects, obtained explicit consent where required, configured EventOS appropriately and informed wowyou concepts where additional safeguards are required.",
      "Examples may include accessibility requirements, dietary requirements, religious preferences, health-related access needs or similar information.",
      "Device-native biometric login, such as Face ID, Touch ID or Android biometric authentication, does not mean EventOS collects or stores biometric templates where authentication remains handled by the user's device operating system.",
    ],
  },

  {
    title: "13. AI-Assisted Processing",
    paragraphs: [
      "Where the Customer enables AI-assisted features within EventOS, wowyou concepts may process Customer Data to provide features such as event planning support, attendee recommendations, networking suggestions, analytics, reporting, content generation or workflow automation.",
      "wowyou concepts will not use Customer Data to train general-purpose AI models unless expressly agreed with the Customer.",
      "The Customer remains responsible for reviewing AI outputs before relying on them and for ensuring AI-assisted features are not used unlawfully, unfairly or discriminatorily.",
      "wowyou concepts will implement reasonable safeguards for AI-assisted features, including transparency, human oversight, security controls and monitoring for accuracy and potential misuse.",
    ],
  },

  {
  title: "14. Assistance with Compliance",
  paragraphs: [
    "Taking into account the nature of processing and information available to wowyou concepts, wowyou concepts will provide reasonable assistance to the Customer with:",
    "The Customer remains responsible for its own compliance decisions and regulatory filings.",
  ],
  bullets: [
    "Data protection impact assessments.",
    "Security assessments.",
    "Breach response.",
    "Data subject requests.",
    "Regulatory queries.",
    "Audits and compliance documentation.",
    "Records of processing where relevant.",
  ],
},

  {
    title: "15. Audit and Information Rights",
    paragraphs: [
      "wowyou concepts will make available reasonable information necessary to demonstrate compliance with this DPA.",
      "Where required by Applicable Data Protection Laws, the Customer may request an audit of wowyou concepts's processing of Customer Data.",
      "Audits must be reasonable in scope, subject to confidentiality, limited to once per year unless required by law or following a material breach, conducted with reasonable notice, and conducted in a way that does not compromise the security, confidentiality or availability of EventOS or other customers' data.",
      "wowyou concepts may satisfy audit requests through security documentation, certifications, policies, questionnaires, third-party reports or other reasonable evidence.",
    ],
  },

  {
  title: "16. Data Return and Deletion",
  paragraphs: [
    "At the end of the Services, or upon written request, wowyou concepts will delete or return Customer Data unless retention is required by law.",
    "The Customer may export data from EventOS where export functionality is available.",
    "wowyou concepts may retain limited records where necessary for:",
    "Where data is retained, it will remain protected under this DPA and Applicable Data Protection Laws.",
  ],
  bullets: [
    "Legal compliance.",
    "Tax and accounting obligations.",
    "Dispute resolution.",
    "Security logs.",
    "Fraud prevention.",
    "Backup integrity.",
    "Enforcement of agreements.",
  ],
},

  {
    title: "17. Customer Responsibilities",
    paragraphs: [
      "The Customer confirms that:",
    ],
    bullets: [
      "It has the legal right to provide Customer Data to wowyou concepts.",
      "It has provided appropriate privacy notices.",
      "It has identified a lawful basis for processing.",
      "It will not upload unlawful, excessive or unnecessary personal data.",
      "It will configure EventOS in a privacy-conscious manner.",
      "It will not collect children's data, Special Category Data or Criminal Offence Data unless legally permitted and properly safeguarded.",
      "It will ensure authorised users are trained and permitted to access Customer Data.",
      "It will comply with applicable marketing, cookie, consumer protection and event laws.",
    ],
  },

 {
  title: "18. Children and Vulnerable Individuals",
  paragraphs: [
    "EventOS is not intended by default for the processing of children's data or data relating to vulnerable individuals.",
    "If the Customer uses EventOS for events involving children, minors or vulnerable persons, the Customer is responsible for:",
    "wowyou concepts may require additional safeguards or refuse processing where the risk is inappropriate.",
  ],
  bullets: [
    "Obtaining parental or guardian consent where required.",
    "Implementing safeguarding procedures.",
    "Limiting data collection.",
    "Applying appropriate access restrictions.",
    "Complying with applicable child protection and data protection laws.",
  ],
},

  {
    title: "19. African Market Compliance",
    paragraphs: [
      "Where EventOS is used in African countries, the Customer is responsible for complying with applicable local data protection, consumer protection, marketing, event and sector-specific laws applicable to its activities.",
      "wowyou concepts will take reasonable steps to support compliance with applicable African data protection laws where it operates or directly serves users in those markets.",
      "Where local law requires additional terms, local hosting, regulatory registration, data transfer mechanisms or specific notices, the Parties will cooperate in good faith to implement them.",
    ],
  },

  {
    title: "20. Liability",
    paragraphs: [
      "Liability under this DPA is subject to the limitation of liability provisions in the main agreement between the Parties, except where liability cannot be limited under applicable law.",
      "Nothing in this DPA excludes or limits liability for fraud, wilful misconduct, death or personal injury caused by negligence, or any liability that cannot legally be excluded.",
    ],
  },

  {
    title: "21. Conflict",
    paragraphs: [
      "If there is a conflict between this DPA and the main agreement, this DPA will prevail in relation to personal data processing matters.",
      "If Standard Contractual Clauses or other mandatory transfer terms apply, those terms will prevail to the extent required by law.",
    ],
  },

  {
    title: "22. Term",
    paragraphs: [
      "This DPA remains in effect for as long as wowyou concepts processes Customer Data on behalf of the Customer.",
      "Obligations relating to confidentiality, security, deletion, audit, liability and data protection will survive termination where necessary.",
    ],
  },

  {
    title: "23. Governing Law",
    paragraphs: [
      "Unless otherwise stated in the main agreement, this DPA is governed by the laws of Ireland.",
      "Where UK GDPR applies, the relevant UK data protection provisions will apply to UK personal data.",
      "Where local African data protection laws apply, the Parties will comply with those laws to the extent applicable.",
    ],
  },

  {
    title: "24. Contact",
    paragraphs: [
      "Processor: wowyou concepts",
      "Platform: WoWYou EventTech / EventOS",
      "Privacy Contact: enquiries@wowyouconcepts.com",
      "Registered Address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },

  {
    title: "Schedule 1 — Details of Processing",
    paragraphs: [
      "Subject Matter: Provision of the EventOS platform and related services for event planning, registration, ticketing, check-in, attendee engagement, analytics, AI-assisted features, communications, vendor and sponsor management and event operations.",
      "Duration: For the term of the Customer's use of EventOS and any additional retention period required by law, contract, backup integrity, dispute resolution or Customer instructions.",
      "Nature and Purpose of Processing: wowyou concepts processes Customer Data to provide EventOS services, including account setup and user management, attendee registration, ticketing and digital pass creation, QR code generation and validation, secure check-in, event communications, networking and engagement tools, AI-assisted recommendations and automation, analytics and reporting, customer support, security monitoring, troubleshooting, payment status and invoice support, and event workflow management.",
      "Primary Processing Location: EU/EEA and/or UK where practical. Additional locations may apply depending on hosting, support, Sub-processors and Customer configuration, subject to appropriate transfer safeguards.",
    ],
    bullets: [
      "Event attendees.",
      "Event organizers.",
      "Customer staff and administrators.",
      "Speakers.",
      "Panellists.",
      "Sponsors.",
      "Exhibitors.",
      "Vendors.",
      "Venue representatives.",
      "Volunteers.",
      "Guests.",
      "Media representatives.",
      "Support users.",
      "Prospective attendees.",
      "Marketplace users.",
    ],
  },

  {
    title: "Schedule 1 — Categories of Personal Data",
    bullets: [
      "Name.",
      "Email address.",
      "Phone number.",
      "Organisation.",
      "Job title.",
      "Profile photo, where uploaded.",
      "Event registration details.",
      "Ticket type.",
      "Attendance status.",
      "QR code or digital pass ID.",
      "Check-in time.",
      "Session choices.",
      "Networking preferences.",
      "Interests and profile information.",
      "Communications and messages.",
      "Survey responses.",
      "Feedback.",
      "Payment status and transaction reference.",
      "Billing details.",
      "Support requests.",
      "IP address.",
      "Device and browser data.",
      "Usage logs.",
      "Security logs.",
      "AI prompts and outputs where AI features are used.",
      "Custom fields configured by the Customer.",
    ],
    paragraphs: [
      "Special Category Data is not required by default. It may only be processed if the Customer chooses to collect it and has a lawful basis and appropriate safeguards.",
      "Criminal Offence Data is not processed by default. The Customer must not upload Criminal Offence Data unless expressly agreed in writing and legally permitted.",
    ],
  },

  {
    title: "Schedule 2 — Technical and Organisational Measures",
    paragraphs: [
      "wowyou concepts will maintain technical and organisational measures appropriate to the nature and risks of the processing and the maturity of the EventOS platform.",
    ],
    bullets: [
      "Access Control: role-based permissions, unique user accounts, administrative access restrictions, access logging and periodic access review.",
      "Authentication: secure password requirements, multi-factor authentication where available, device-native biometric login support where enabled and session controls.",
      "Encryption: encryption in transit using secure protocols, encryption at rest where available and appropriate, and secure handling of authentication tokens and credentials.",
      "Secure Development: secure coding practices, code review where appropriate, vulnerability monitoring, patching and updates, and separation of development, testing and production environments where appropriate.",
      "Hosting and Infrastructure: reputable cloud hosting providers, backup and recovery controls, monitoring and availability controls and network security controls.",
      "Data Minimisation: configuration options to limit data collection, customer-controlled registration fields, deletion and export options where available and retention controls.",
      "Incident Response: internal breach escalation, breach investigation, containment and remediation measures and customer notification procedures.",
      "Personnel Controls: confidentiality obligations, access limited to authorised personnel and staff awareness of data protection responsibilities.",
      "Sub-processor Controls: supplier due diligence, written processor obligations, review of security and privacy terms and transfer safeguards where required.",
      "Business Continuity: backups, recovery procedures, availability monitoring and disaster recovery planning appropriate to platform maturity.",
    ],
  },

  {
    title: "Schedule 3 — Approved Sub-processors",
    paragraphs: [
      "The current approved Sub-processors are maintained through the EventOS Sub-processor List.",
      "wowyou concepts will keep that list updated when material Sub-processors are added, removed or replaced.",
      "The Sub-processor List identifies the service category, purpose, relevant data processed, processing location or transfer safeguard and status of applicable providers.",
      "Where an enterprise Customer requires a contractual Sub-processor schedule, the published list and the applicable contractual schedule should remain aligned.",
    ],
  },

  {
    title: "Schedule 4 — International Transfer Terms",
    paragraphs: [
      "EU/EEA Data: Where Customer Data protected by EU GDPR is transferred outside the EU/EEA to a country without an adequacy decision, the Parties will rely on the EU Standard Contractual Clauses or another valid transfer mechanism.",
      "UK Data: Where Customer Data protected by UK GDPR is transferred outside the UK to a country without adequacy regulations, the Parties will rely on the UK International Data Transfer Agreement, the UK Addendum to the EU Standard Contractual Clauses or another valid UK transfer mechanism.",
      "African Data: Where local African data protection laws apply, the Parties will implement any required transfer safeguards, notices, contracts, registrations, consents or regulatory approvals to the extent applicable.",
      "Transfer Risk: Where required, wowyou concepts and the Customer will cooperate to assess transfer risks and implement supplementary measures such as encryption, access restrictions, data minimisation, contractual controls and supplier due diligence.",
    ],
  },
];

export default function DpaPage() {
  return (
    <LegalLayout
      title="Enterprise Data Processing Agreement"
      description="Data processing terms governing the processing of Customer Data by wowyou concepts when providing WoWYou EventTech / EventOS as a processor."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-white/55">
        This document is intended for event organizers, enterprise
        customers, corporate clients, venues, agencies, associations
        and public sector organisations using EventOS. It forms part
        of the applicable commercial or service agreement where
        executed by the parties.
      </div>

      <LegalDocument sections={sections} />

      <div className="mt-16 border-t border-white/10 pt-10">
        <h2 className="text-2xl font-semibold tracking-tight">
          Enterprise Execution
        </h2>

        <p className="mt-4 text-[15px] leading-7 text-white/65">
          For enterprise customers, this DPA may be incorporated
          into an Order Form, SaaS Agreement, Enterprise Agreement
          or other written agreement and may be signed physically
          or electronically.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              wowyou concepts
            </p>

            <div className="mt-8 space-y-5 text-sm text-white/55">
              <p>
                Name: ______________________________
              </p>
              <p>
                Title: ______________________________
              </p>
              <p>
                Signature: ___________________________
              </p>
              <p>
                Date: _______________________________
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Customer / Event organizer
            </p>

            <div className="mt-8 space-y-5 text-sm text-white/55">
              <p>
                Organisation: _______________________
              </p>
              <p>
                Name: ______________________________
              </p>
              <p>
                Title: ______________________________
              </p>
              <p>
                Signature: ___________________________
              </p>
              <p>
                Date: _______________________________
              </p>
            </div>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}