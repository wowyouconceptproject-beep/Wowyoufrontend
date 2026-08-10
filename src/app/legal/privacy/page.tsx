import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      "WoWYou Concepts Ltd respects your privacy and is committed to protecting personal data.",
      "This Privacy Policy explains how we collect, use, store, share and protect personal data when you use the WoWYou EventTech / EventOS platform, including our website, mobile app, event registration tools, ticketing features, QR passes, check-in tools, AI features, analytics, communications and related services.",
      "This Policy is designed to support compliance with the EU General Data Protection Regulation (GDPR), Irish data protection law, UK GDPR and applicable data protection laws in the countries where we operate or serve users, including relevant African data protection laws where applicable.",
    ],
  },

  {
    title: "2. Who We Are",
    paragraphs: [
      "WoWYou EventTech / EventOS is operated by WoWYou Concepts Ltd.",
      "For some activities, WoWYou Concepts Ltd acts as a data controller, meaning we decide why and how personal data is processed.",
      "For other activities, especially where an event organiser uses EventOS to manage attendee data, WoWYou Concepts Ltd may act as a data processor on behalf of that organiser. In those cases, the event organiser is normally the data controller and the processing may also be governed by a separate Data Processing Agreement.",
    ],
  },

  {
    title: "3. Personal Data We Collect",
    paragraphs: [
      "Depending on how you use EventOS, we may collect the following categories of personal data.",
    ],
  },

  {
    title: "3.1 Account and Profile Data",
    paragraphs: [
      "Name, email address, phone number, organisation, job title, login details, account settings, profile information and user role.",
    ],
  },

  {
    title: "3.2 Event Registration Data",
    paragraphs: [
      "Event registration details, ticket type, attendance status, check-in status, QR pass details, dietary or accessibility preferences where provided, session choices and event participation information.",
    ],
  },

  {
    title: "3.3 Organiser and Business Data",
    paragraphs: [
      "Organisation name, billing details, event details, staff users, vendor details, sponsor details, venue details and business communications.",
    ],
  },

  {
    title: "3.4 Payment and Transaction Data",
    paragraphs: [
      "Payment status, invoices, billing address, transaction references, refunds and payment provider records.",
      "We do not intend to store full card details unless expressly stated. Payment processing will usually be handled by third-party payment providers.",
    ],
  },

  {
    title: "3.5 Technical and Usage Data",
    paragraphs: [
      "IP address, device type, browser type, app version, login records, cookies, usage logs, security logs, error reports and analytics data.",
    ],
  },

  {
    title: "3.6 Communications Data",
    paragraphs: [
      "Messages, support requests, emails, feedback, survey responses and communications through the platform.",
    ],
  },

  {
    title: "3.7 AI Interaction Data",
    paragraphs: [
      "Prompts, inputs, outputs, event planning requests, recommendations, generated content and usage analytics relating to AI-powered features.",
    ],
  },

  {
    title: "3.8 Marketing Data",
    paragraphs: [
      "Marketing preferences, campaign engagement, newsletter sign-ups and communication preferences.",
    ],
  },

  {
    title: "4. Special Category Data and Biometric Login",
    paragraphs: [
      "EventOS does not intentionally require users to provide special category data such as health data, biometric identification data, ethnicity, religious beliefs, political opinions or genetic data.",
      "However, some event organisers may choose to collect information such as accessibility needs, dietary preferences or other sensitive information through registration forms. Where this happens, the organiser is responsible for ensuring there is a valid lawful basis and any required consent.",
      "Device-native biometric login, such as Face ID, Touch ID or Android biometric authentication, does not mean EventOS collects or stores biometric templates. Biometric authentication should be handled by the user's device operating system.",
    ],
  },

  {
    title: "5. How We Use Personal Data",
    paragraphs: [
      "We use personal data to provide, operate, secure and improve EventOS and the services connected to it.",
    ],
    bullets: [
      "Create and manage user accounts",
      "Provide event registration and ticketing",
      "Generate tickets, QR codes and digital passes",
      "Support secure check-in",
      "Enable attendee engagement and networking",
      "Provide AI-assisted event tools and recommendations",
      "Send event communications",
      "Process payments and invoices",
      "Provide customer support",
      "Improve platform performance and security",
      "Detect fraud, misuse or security threats",
      "Provide analytics and reports to organisers",
      "Manage subscriptions and contracts",
      "Send marketing communications where permitted",
      "Comply with legal and regulatory obligations",
    ],
  },

  {
    title: "6. Lawful Basis for Processing",
    paragraphs: [
      "Where GDPR or UK GDPR applies, we rely on one or more lawful bases depending on the nature and purpose of the processing.",
    ],
    bullets: [
      "Contract: to provide the platform and services you request",
      "Consent: for optional marketing, non-essential cookies or certain optional data uses",
      "Legal obligation: for tax, accounting, regulatory and compliance requirements",
      "Legitimate interests: for platform security, service improvement, fraud prevention, business communications and analytics, where those interests are not overridden by your rights",
      "Explicit consent: where special category data is collected and this is required by law",
    ],
  },

  {
    title: "7. AI and Automated Processing",
    paragraphs: [
      "EventOS may use AI to support recommendations, planning, automation, analytics, matchmaking, reporting and user assistance.",
      "We do not intend to use AI to make solely automated decisions that produce legal or similarly significant effects on individuals without appropriate safeguards.",
      "We aim to apply human oversight, transparency, privacy-by-design, security-by-design, accuracy monitoring and bias mitigation for AI-powered features.",
    ],
  },

  {
  title: "8. Cookies and Similar Technologies",
  paragraphs: [
    "We may use cookies and similar technologies to operate EventOS, remember preferences, understand usage and improve platform performance.",
    "Where required, we will ask for consent before using non-essential cookies or tracking technologies. Strictly necessary cookies may be used without consent where permitted by law.",
  ],
  bullets: [
    "Strictly necessary platform functions",
    "Login and security",
    "Preferences",
    "Analytics",
    "Performance monitoring",
    "Marketing, where permitted",
  ],
},

  {
  title: "9. Sharing Personal Data",
  paragraphs: [
    "We may share personal data with service providers, event organisers and other parties where necessary to provide EventOS, fulfil your requests, protect the platform, comply with law or otherwise process data on a lawful basis.",
    "We require service providers to protect personal data and only process it for authorised purposes.",
  ],
  bullets: [
    "Event organisers, where you register for their events",
    "Payment processors",
    "Cloud hosting providers",
    "Email and messaging providers",
    "Analytics and security providers",
    "AI technology providers",
    "Customer support tools",
    "Professional advisers",
    "Regulators, law enforcement or public authorities where required by law",
    "Vendors or marketplace partners where you choose to engage with them",
    "Successors in the event of merger, acquisition, restructuring or sale of business assets",
  ],
},

  {
    title: "10. International Data Transfers",
    paragraphs: [
      "We aim to use EU/EEA or UK-based hosting and service providers where practical. However, some technology providers, support services or users may be located outside Ireland, the EEA or the UK.",
      "Where personal data is transferred internationally, we will use appropriate safeguards where required.",
    ],
    bullets: [
      "Adequacy decisions",
      "EU Standard Contractual Clauses",
      "UK International Data Transfer Agreement or UK Addendum",
      "Data processing agreements",
      "Transfer risk assessments where required",
      "Security controls such as encryption and access restrictions",
    ],
  },

  {
    title: "11. African Markets",
    paragraphs: [
      "Where EventOS operates in or serves users in African countries, we will take reasonable steps to comply with applicable local data protection laws.",
      "This may include country-specific compliance for markets such as Nigeria, Kenya, South Africa, Ghana and other African jurisdictions where we operate.",
      "Where local laws require additional notices, registration, local representatives, data transfer safeguards or other steps, we will assess and implement appropriate measures before expanding active operations in those markets.",
    ],
  },

  {
  title: "12. Data Retention",
  paragraphs: [
    "We keep personal data only for as long as necessary for the purposes described in this Policy.",
    "Retention periods may vary depending on the type of data, user role, legal requirements and organiser instructions.",
    "Where we process attendee data as a processor, retention may be governed by the organiser's instructions and our Data Processing Agreement.",
  ],
  bullets: [
    "Providing the platform",
    "Supporting events",
    "Maintaining business records",
    "Resolving disputes",
    "Meeting legal, tax and accounting obligations",
    "Protecting security and preventing fraud",
  ],
},

  {
    title: "13. Security",
    paragraphs: [
      "We use appropriate technical and organisational measures to protect personal data, including access controls, encryption where appropriate, authentication, monitoring, secure development practices, backups and staff access restrictions.",
      "No system is completely secure, but we take reasonable steps to protect personal data against unauthorised access, loss, misuse, alteration or disclosure.",
    ],
  },

 {
  title: "14. Your Rights",
  paragraphs: [
    "Depending on where you live and which laws apply, you may have rights in relation to your personal data.",
    "If your data is processed by an event organiser using EventOS, we may direct your request to that organiser where they are the controller.",
  ],
  bullets: [
    "Right to access your personal data",
    "Right to correct inaccurate data",
    "Right to delete your data",
    "Right to restrict processing",
    "Right to object to processing",
    "Right to data portability",
    "Right to withdraw consent",
    "Right to complain to a data protection authority",
  ],
},

  {
    title: "15. Marketing Communications",
    paragraphs: [
      "We may send marketing communications where permitted by law.",
      "You can unsubscribe at any time using the unsubscribe link or by contacting us.",
      "We will not sell your personal data.",
    ],
  },

  {
    title: "16. Children",
    paragraphs: [
      "EventOS is not intended for children under 16 unless an event organiser has appropriate authority and safeguards in place.",
      "Where events involve children or minors, the organiser is responsible for obtaining appropriate parental or guardian consent and complying with safeguarding and child data protection requirements.",
    ],
  },

  {
    title: "17. Data Breaches",
    paragraphs: [
      "Where required by law, we will notify the relevant controller, supervisory authority or affected individuals of personal data breaches within applicable legal timeframes.",
      "Where we act as a processor, we will notify the relevant organiser or controller without undue delay after becoming aware of a breach.",
    ],
  },

  {
    title: "18. Third-Party Links and Services",
    paragraphs: [
      "EventOS may contain links or integrations with third-party websites, apps, payment providers, venues, vendors or services.",
      "We are not responsible for the privacy practices of third parties.",
      "You should review their privacy policies before using their services.",
    ],
  },

  {
    title: "19. Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time.",
      "Where changes are material, we will take reasonable steps to notify users.",
      "The latest version will be available on our website or platform.",
    ],
  },

  {
    title: "20. Contact Us",
    paragraphs: [
      "For privacy questions or requests, contact WoWYou Concepts Ltd.",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
      "You may also contact the relevant data protection authority, including the Irish Data Protection Commission where applicable.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How WoWYou EventTech / EventOS collects, uses, protects and manages personal data."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}