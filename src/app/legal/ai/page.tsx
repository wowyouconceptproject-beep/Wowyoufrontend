import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Purpose of this Policy",
    paragraphs: [
      "This AI Usage Policy explains how artificial intelligence features within the WoWYou EventTech / EventOS platform may be used, what users can expect, what the limits of AI are, and which uses are prohibited.",
      "The Policy is designed to support safe, transparent, responsible and lawful use of AI across event planning, ticketing, attendee engagement, networking, analytics, communications and platform operations.",
      "It forms part of the wider legal and product governance framework for EventOS together with the Terms of Service, Privacy Policy, Acceptable Use Policy, Refund & Cancellation Policy, Marketplace Vendor Terms and any applicable enterprise agreement.",
    ],
  },

  {
    title: "2. Scope",
    paragraphs: [
      "This Policy applies to all AI-powered or AI-assisted functionality provided through EventOS, whether accessed through the website, mobile app, organiser dashboard, attendee interface, enterprise portal, API, marketplace or support channels.",
      "It applies to WoWYou Concepts Ltd staff, contractors, developers and support personnel, event organisers, enterprise customers, public sector customers, venues, agencies, associations, attendees, speakers, sponsors, exhibitors, vendors, volunteers, guests, integration partners, marketplace partners and any person or organisation using or configuring EventOS AI features.",
    ],
  },

  {
    title: "3. AI Features Covered",
    paragraphs: [
      "EventOS may include AI-powered or AI-assisted features. Not all features will be available to all customers or markets, and some features may be released as beta, pilot or enterprise-only functionality.",
    ],
    bullets: [
      "AI Event Planner: Generates planning suggestions, timelines, tasks, agenda ideas and operational recommendations.",
      "AI Marketing Assistant: Helps draft event descriptions, emails, social captions, speaker bios, sponsor messages and promotional content.",
      "AI Attendee Matching: Suggests networking matches, introductions, sessions or groups based on profile data, stated interests and event context.",
      "AI Event Assistant / Copilot: Answers user questions, helps navigate event information and supports event workflows.",
      "AI Analytics and Insights: Summarises event performance, engagement, attendance, feedback, revenue and sponsor visibility.",
      "AI Sponsor Intelligence: Provides sponsor reporting, lead insights and campaign performance summaries.",
      "AI Operations Alerts: May flag potential operational risks such as capacity issues, registration trends, bottlenecks or incomplete tasks.",
      "AI Support Tools: May assist customer support by suggesting responses or triaging requests for human review.",
    ],
  },

  {
    title: "4. Roles and Responsibilities",
    paragraphs: [
      "WoWYou Concepts Ltd is responsible for designing, operating and improving EventOS AI features in a responsible manner.",
      "Event organisers and enterprise customers are responsible for how they configure, deploy and use AI features within their own events and attendee relationships.",
      "Attendees and end users are responsible for using AI features respectfully and lawfully and for reporting inaccurate, unsafe or abusive AI outputs.",
      "Developers and technical partners are responsible for implementing AI features in accordance with this Policy, privacy-by-design, security-by-design, logging, auditability and human oversight requirements.",
    ],
  },

  {
    title: "5. Geographic and Legal Coverage",
    paragraphs: [
      "EventOS is intended to serve customers and users in Ireland, the United Kingdom, the European Economic Area and selected African markets.",
      "Where local laws apply, users and customers must comply with those laws in addition to this Policy.",
      "The platform should support compliance with applicable data protection, consumer protection, electronic communications, accessibility, platform safety and AI governance requirements, including where applicable GDPR, Irish data protection law, UK GDPR, the EU AI Act, ePrivacy rules and relevant African data protection and digital governance laws.",
      "Where EventOS enters a new country or regulated sector, additional legal review may be required before enabling high-risk AI workflows, sensitive profiling, biometric functionality, children or minor functionality, targeted marketing or new categories of data processing.",
    ],
  },

  {
    title: "6. AI Governance Principles",
    paragraphs: [
      "EventOS AI features are intended to follow the following governance principles.",
    ],
    bullets: [
      "Human-centred: AI should assist people, not replace accountable human judgement.",
      "Lawful and fair: AI features must be used in ways that comply with applicable laws and do not unfairly disadvantage individuals or groups.",
      "Transparent: Users should be told when they are interacting with AI or receiving AI-assisted outputs where required.",
      "Privacy-by-design: AI features should minimise personal data collection and avoid unnecessary sensitive data processing.",
      "Security-by-design: AI systems should be protected against misuse, prompt injection, data leakage, unauthorised access and model abuse.",
      "Human oversight: Important decisions should remain subject to human review, especially where people may be excluded, disadvantaged or materially affected.",
      "Accountability: WoWYou Concepts Ltd and event organisers should be able to explain who is responsible for AI configuration, review and outcomes.",
      "Continuous improvement: AI performance, accuracy, safety and fairness should be reviewed and improved over time.",
    ],
  },

  {
    title: "7. Transparency and User Disclosures",
    paragraphs: [
      "EventOS will provide appropriate transparency about AI use. Users should not be misled into believing they are interacting with a human when they are interacting with an AI assistant, chatbot or AI-generated content.",
      "Where AI generates or materially modifies event content, recommendations, summaries, matching suggestions or messages, EventOS should present clear labels such as 'AI-assisted', 'Generated by AI', 'Suggested by EventOS AI' or similar wording.",
      "Event organisers should disclose to attendees when AI is used for attendee matching, recommendations, event support, analytics, personalised suggestions or automated messaging. Such disclosure may be included in the event privacy notice, registration page, mobile app notice or attendee terms.",
      "Transparency requirements may evolve as applicable AI regulation develops. EventOS may therefore configure, display, log and update AI notices as required.",
    ],
  },

  {
    title: "8. Human Oversight and Review",
    paragraphs: [
      "AI outputs must remain subject to appropriate human oversight. AI may assist with planning, drafting, recommendations, summaries and analytics, but users remain responsible for reviewing and approving outputs before relying on them.",
      "EventOS must not be used to make solely automated decisions that have legal or similarly significant effects on individuals unless a lawful basis, appropriate safeguards and any required approval are in place.",
    ],
    bullets: [
      "Refusing entry",
      "Cancelling tickets",
      "Excluding an attendee",
      "Escalating security concerns",
      "Selecting speakers",
      "Ranking vendors",
      "Allocating sponsorship opportunities",
      "Employment-related decisions",
      "Determining access to services",
      "Any other decision that could materially affect a person",
    ],
  },

  {
    title: "9. Limits of AI Outputs",
    paragraphs: [
      "AI outputs may be incomplete, inaccurate, outdated, biased, inappropriate or unsuitable for a specific context.",
      "AI-generated information should always be reviewed by a competent human before publication, operational use or external communication.",
      "AI outputs must not be treated as legal, financial, medical, tax, security, employment, regulatory or other professional advice. Users should seek qualified professional advice where needed.",
      "WoWYou Concepts Ltd does not guarantee that AI features will be error-free, uninterrupted, legally sufficient, commercially successful or suitable for every event type or jurisdiction.",
    ],
  },

  {
    title: "10. Acceptable AI Uses",
    paragraphs: [
      "Acceptable uses of EventOS AI include responsible assistance with event operations, content, analytics, engagement and decision support.",
    ],
    bullets: [
      "Drafting event descriptions, agendas, emails, social media captions and speaker introductions.",
      "Summarising event feedback, attendance, check-in, engagement and survey data.",
      "Suggesting networking matches based on user-provided interests and preferences.",
      "Assisting organisers with timelines, reminders, planning checklists and operational tasks.",
      "Helping sponsors and exhibitors understand engagement and lead trends in an aggregated or lawful manner.",
      "Generating internal reports, dashboards and decision-support insights.",
      "Supporting customer service by suggesting responses for human review.",
      "Improving accessibility and user experience, such as clearer summaries or simpler event instructions.",
    ],
  },

  {
    title: "11. Prohibited AI Uses",
    paragraphs: [
      "Users must not use EventOS AI features for any unlawful, unsafe, deceptive, discriminatory or harmful purpose.",
    ],
    bullets: [
      "Generating or promoting illegal, fraudulent, abusive, hateful, harassing, exploitative or discriminatory content.",
      "Misleading users into believing AI-generated content is human-created where transparency is required.",
      "Creating deepfakes, impersonations or manipulated content without clear disclosure and lawful authority.",
      "Making automated decisions with legal or similarly significant effects without human review and appropriate safeguards.",
      "Processing special category data, children's data, criminal offence data or sensitive personal data without a lawful basis and appropriate safeguards.",
      "Using AI to infer or target individuals based on ethnicity, religion, health, disability, political opinion, sexual orientation, trade union membership or similar sensitive characteristics.",
      "Using AI for biometric identification, facial recognition, surveillance or security screening unless expressly approved and legally assessed.",
      "Using AI for credit scoring, employment screening, public benefit eligibility, law enforcement, immigration, medical diagnosis or other high-risk use cases without appropriate approval and legal assessment.",
      "Generating malware, phishing content, credential theft prompts, cyber abuse instructions or attempts to bypass security controls.",
      "Scraping, extracting or harvesting personal data through AI tools without lawful authority.",
      "Spamming attendees, manipulating users or exploiting vulnerable individuals.",
      "Submitting confidential third-party information, trade secrets or personal data into AI features without authority.",
      "Attempting to reverse engineer, jailbreak, overload, benchmark abusively, interfere with or manipulate AI systems.",
    ],
  },

  {
    title: "12. Personal Data, Privacy and AI",
    paragraphs: [
      "AI features may process personal data where necessary to provide EventOS functionality. This may include account data, event registration data, attendee profile data, networking preferences, event engagement data, communications, prompts, outputs and usage logs.",
      "EventOS should apply data minimisation, purpose limitation, access control, retention controls, secure processing and privacy-by-design principles. Customers must not submit unnecessary personal data into AI features.",
      "Special category data should not be processed through AI features unless the customer has a lawful basis, appropriate safeguards, clear notices and any required explicit consent.",
      "EventOS is not designed to require special category data by default.",
      "WoWYou Concepts Ltd will not use customer event data or attendee personal data to train general-purpose AI models unless this is expressly agreed with the customer and supported by appropriate legal documentation.",
      "Where third-party AI providers are used, they should be assessed as sub-processors or service providers and subject to appropriate contractual, security, confidentiality and international transfer safeguards.",
    ],
  },

  {
    title: "13. Fairness, Bias and Non-Discrimination",
    paragraphs: [
      "AI features must be designed and used in a way that supports fairness and avoids unlawful discrimination.",
      "Attendee matching, recommendations, analytics and sponsor insights should not intentionally rely on protected or sensitive characteristics unless legally justified and appropriately safeguarded.",
      "EventOS should provide mechanisms to review AI outputs, correct inaccurate information, report unfair results and disable or adjust features that create unacceptable risks.",
      "Where an AI output affects visibility, recommendations, rankings or opportunities, the system should be reviewed for potential bias, exclusion or unintended disadvantage, especially for underrepresented groups.",
    ],
  },

  {
    title: "14. AI Content Generation",
    paragraphs: [
      "AI-generated event content may include event descriptions, marketing copy, email templates, social media posts, sponsor materials, summaries, FAQs and speaker introductions.",
      "Users are responsible for checking that AI-generated content is accurate, lawful, appropriate, non-infringing, brand-safe and suitable for the intended audience before publication.",
      "AI-generated content must not be used to mislead attendees about event details, speaker attendance, pricing, availability, endorsements, sponsors, refund policies or organiser identity.",
    ],
  },

  {
    title: "15. AI Attendee Matching and Networking",
    paragraphs: [
      "AI attendee matching should be optional or clearly disclosed where it uses attendee profile data, interests, attendance history, session choices or networking preferences.",
      "The platform should allow users to control relevant profile visibility and, where practical, opt out of AI-powered networking or recommendations.",
      "AI matching must not infer sensitive characteristics or use hidden profiling to manipulate attendees.",
      "Organisers must not use AI matching to exclude, rank or disadvantage individuals unfairly.",
    ],
  },

  {
    title: "16. AI Analytics, Insights and Profiling",
    paragraphs: [
      "AI analytics may summarise event performance, attendee engagement, check-in trends, networking activity, sponsor visibility and feedback.",
      "Where possible, analytics should be aggregated or pseudonymised.",
      "Individual-level analytics should be limited to what is necessary, proportionate and lawful for the event purpose.",
      "AI analytics must not be used to make unfair assumptions about an individual's behaviour, value, vulnerability, personality, health, beliefs or protected characteristics.",
    ],
  },

  {
    title: "17. Third-Party AI Providers",
    paragraphs: [
      "EventOS may use third-party AI models, APIs, infrastructure or tools to provide AI features.",
      "WoWYou Concepts Ltd will assess such providers for security, privacy, contractual protections, data retention, international transfers, confidentiality and service reliability.",
      "The platform should maintain a register of AI providers and models used, including the purpose of use, data categories processed, retention settings, transfer mechanism and risk rating.",
    ],
    bullets: [
      "Provider name and AI model or service",
      "Purpose and feature supported",
      "Categories of data processed",
      "Whether data is used for provider model training",
      "Processing location and applicable transfer safeguards",
      "Provider retention period",
      "Risk rating based on use case and data sensitivity",
    ],
  },

  {
    title: "18. Security, Abuse Prevention and Prompt Safety",
    paragraphs: [
      "AI features must be protected against foreseeable misuse, including prompt injection, data leakage, unauthorised access, excessive data extraction, malicious content generation and attempts to bypass safety controls.",
      "Security controls may include rate limits, authentication, role-based access, audit logs, content moderation, prompt filtering, output filtering, anomaly detection, provider security review and incident response procedures.",
      "Users must not upload secrets, passwords, private keys, payment card data, confidential third-party information or unnecessary sensitive data into AI prompts.",
    ],
  },

  {
    title: "19. Incident Reporting and Complaints",
    paragraphs: [
      "Users should report unsafe, inaccurate, biased, discriminatory, unlawful or inappropriate AI outputs to WoWYou Concepts Ltd or the event organiser as soon as possible.",
      "WoWYou Concepts Ltd may investigate reports, remove or disable AI outputs, suspend accounts, restrict features, update prompts, modify model settings, engage AI providers or apply other remediation steps.",
      "Where an incident involves personal data, the Privacy Policy and applicable data protection and breach response procedures will apply.",
      "Where an incident may raise wider legal or safety concerns, WoWYou Concepts Ltd may notify relevant customers, authorities or affected individuals where required by law.",
    ],
  },

  {
    title: "20. Customer and Organiser Responsibilities",
    paragraphs: [
      "Customers and event organisers are responsible for using AI features appropriately within their events, audiences and jurisdictions.",
    ],
    bullets: [
      "Ensure AI features are appropriate for the event type, audience and jurisdiction.",
      "Provide notices to attendees where AI is used for recommendations, engagement, analytics or chatbot support.",
      "Review AI-generated content before publishing or acting on it.",
      "Avoid using AI to make significant decisions about individuals without human review.",
      "Avoid collecting unnecessary sensitive data through registration forms or AI prompts.",
      "Obtain consent where required for optional personalisation, AI networking or sensitive data processing.",
      "Comply with applicable GDPR, UK GDPR, local African data protection laws and other local requirements.",
      "Train authorised users on proper AI use where AI features are used by staff or contractors.",
    ],
  },

  {
    title: "21. Internal Governance and Change Control",
    paragraphs: [
      "WoWYou Concepts Ltd should maintain an internal AI governance process appropriate to the maturity of EventOS.",
      "This should include an AI feature register and model/provider register, risk assessment before releasing new AI features, privacy and security review for AI features processing personal data, approval workflows for higher-risk use cases, testing for accuracy, bias, prompt safety and reliability, change logs for material AI feature updates, user feedback and complaint review, and periodic review of relevant legal developments.",
    ],
  },

  {
    title: "23. Enforcement",
    paragraphs: [
      "WoWYou Concepts Ltd may restrict, suspend or terminate access to AI features or the wider EventOS platform where users breach this Policy, misuse AI features, create legal or security risk, infringe rights, endanger users or expose the company or its customers to unacceptable risk.",
      "Enforcement actions may include warnings, content removal, output suppression, feature restrictions, account suspension, customer notification, legal reporting, termination or referral to appropriate authorities where required.",
    ],
  },

  {
    title: "24. Review and Updates",
    paragraphs: [
      "This Policy should be reviewed at least annually and whenever EventOS introduces material new AI features, enters a new market, changes AI providers, processes new categories of data, supports high-risk workflows or when relevant legal requirements change.",
      "WoWYou Concepts Ltd may update this Policy from time to time. Material changes should be communicated to customers and users where appropriate.",
    ],
  },

  {
    title: "25. Contact",
    paragraphs: [
      "For questions, complaints or reports relating to AI features, contact WoWYou Concepts Ltd.",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },
];

export default function AIUsagePage() {
  return (
    <LegalLayout
      title="AI Usage Policy"
      description="How artificial intelligence is used within WoWYou EventTech / EventOS, including transparency, human oversight, privacy, networking, analytics and prohibited uses."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}