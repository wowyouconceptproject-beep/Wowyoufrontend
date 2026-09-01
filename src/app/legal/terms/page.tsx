import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Introduction",
    paragraphs: [
      "These Terms of Service govern your access to and use of the WoWYou EventTech EventOS platform, including our websites, mobile applications, software tools, registration systems, ticketing services, digital passes, check-in tools, attendee engagement features, AI-powered tools, analytics, marketplace features and related services.",
      "EventOS is operated by wowyou concepts. By creating an account, accessing the platform, registering for an event, creating an event, buying a ticket, using our mobile app or otherwise using EventOS, you agree to these Terms.",
      "If you do not agree to these Terms, you must not use the platform.",
    ],
  },

  {
    title: "2. Who These Terms Apply To",
    paragraphs: [
      "These Terms apply to event organizers, corporate clients, public sector organisations, community organisations, vendors and service providers, sponsors and exhibitors, attendees, speakers, platform administrators and any other person or organisation using EventOS.",
      "Where you use EventOS on behalf of an organisation, you confirm that you have authority to accept these Terms on behalf of that organisation.",
    ],
  },

  {
    title: "3. About EventOS",
    paragraphs: [
      "EventOS is an AI-powered Event Operating System designed to help organisations plan, manage, deliver and measure events.",
      "We may update, modify or improve the platform from time to time.",
    ],
    bullets: [
      "Event planning and workflows",
      "Registration and ticketing",
      "Digital tickets and QR passes",
      "Secure check-in",
      "Attendee engagement",
      "Networking tools",
      "AI recommendations and automation",
      "Vendor and sponsor tools",
      "Analytics and reporting",
      "Event communications",
      "Marketplace and experience services",
    ],
  },

  {
    title: "4. Account Registration",
    paragraphs: [
      "To access certain features, you may need to create an account. You agree to provide accurate, current and complete information and to keep your login details secure.",
      "You are responsible for all activity under your account. You must notify us immediately if you suspect unauthorised access.",
      "Where biometric login is enabled, such as Face ID, Touch ID or device-native biometric authentication, EventOS does not collect or store biometric templates. Authentication is handled by your device operating system.",
    ],
  },

  {
    title: "5. organizer Responsibilities",
    paragraphs: [
      "If you create, manage or promote events using EventOS, you are responsible for the following:",
      "You must not use EventOS for unlawful, fraudulent, misleading, abusive, discriminatory, unsafe or harmful activities.",
    ],
    bullets: [
      "Ensuring your event is lawful and properly authorised",
      "Providing accurate event information",
      "Complying with consumer protection, advertising, tax, health and safety, accessibility, venue and local licensing laws",
      "Managing refunds, cancellations and attendee communications",
      "Obtaining any required permissions from attendees, speakers, vendors and sponsors",
      "Providing your own privacy notices where required",
      "Ensuring any data you upload or collect through EventOS is lawful",
      "Ensuring that event content does not infringe third-party rights",
    ],
  },

  {
    title: "6. Attendee Responsibilities",
    paragraphs: [
      "If you register for or attend an event through EventOS, you agree to follow the applicable event and platform requirements.",
      "Event admission is ultimately controlled by the event organizer and/or venue.",
    ],
    bullets: [
      "Provide accurate registration information",
      "Follow event rules and venue requirements",
      "Use tickets, passes and QR codes only as authorised",
      "Not share, duplicate, tamper with or resell tickets unless permitted",
      "Behave respectfully towards organizers, attendees, staff and vendors",
    ],
  },

  {
    title: "7. Ticketing, Payments and Refunds",
    paragraphs: [
      "EventOS may support paid and free events. Where payments are processed through the platform, additional payment provider terms may apply.",
      "Unless otherwise stated, the event organizer is responsible for the event and its delivery.",
      "The organizer is responsible for refund decisions, cancellation policies and attendee disputes.",
      "Platform fees, booking fees, payment processing fees or service charges may be non-refundable where permitted by law.",
      "wowyou concepts may deduct applicable fees before remitting funds to organizers.",
      "We may withhold, suspend or reverse payments where we suspect fraud, chargebacks, legal violations or breach of these Terms.",
      "We are not responsible for an organizer's failure to deliver an event unless wowyou concepts is expressly acting as the event organizer.",
    ],
  },

  {
    title: "8. Subscriptions, Platform Fees and Paid Services",
    paragraphs: [
      "EventOS may offer subscriptions, one-off event packages, enterprise licences, AI add-ons, marketplace commissions, transaction fees, implementation fees and professional services.",
      "Fees will be shown in your order form, proposal, invoice or online checkout. You agree to pay all applicable fees and taxes.",
      "We may suspend access for non-payment.",
    ],
  },

  {
    title: "9. AI-Powered Features",
    paragraphs: [
      "EventOS may include AI-powered tools such as event planning support, attendee recommendations, networking suggestions, content generation, analytics, reporting and workflow automation.",
      "AI outputs are provided to assist users and should not be treated as professional legal, financial, medical, tax, security or compliance advice. Users remain responsible for reviewing, approving and validating AI-generated content or recommendations before use.",
      "wowyou concepts may monitor AI feature performance to improve accuracy, security, fairness and safety.",
    ],
    bullets: [
      "Make unlawful, discriminatory or harmful decisions",
      "Generate misleading, abusive or infringing content",
      "Process sensitive personal data unless you have lawful authority",
      "Attempt to reverse engineer, manipulate or misuse the platform",
      "Make solely automated decisions with legal or similarly significant effects on individuals without appropriate safeguards",
    ],
  },

  {
    title: "10. User Content",
    paragraphs: [
      "You may upload content such as event descriptions, logos, images, speaker details, agendas, messages, attendee lists, vendor information or other materials.",
      "You retain ownership of your content. However, you grant wowyou concepts a licence to host, process, display, transmit and use that content as necessary to provide the platform.",
      "You confirm that you have all necessary rights and permissions for any content you upload.",
      "We may remove content that breaches these Terms or applicable law.",
    ],
  },

  {
    title: "11. Intellectual Property",
    paragraphs: [
      "The EventOS platform, software, interface, workflows, branding, designs, AI tools, databases, documentation and related technology are owned by or licensed to wowyou concepts.",
      "You may not copy, modify, reverse engineer, resell, reproduce, distribute or create derivative works from EventOS unless expressly permitted in writing.",
      "The names WoWYou Concepts, WoWYou EventTech, EventOS, and related marks, logos and branding belong to wowyou concepts or its licensors.",
    ],
  },

  {
    title: "12. Acceptable Use",
    paragraphs: [
      "You must not use EventOS for unlawful, harmful, fraudulent, abusive or unauthorised activities.",
    ],
    bullets: [
      "Use the platform for illegal events or unlawful activity",
      "Upload viruses, malware or harmful code",
      "Attempt to access systems without permission",
      "Interfere with platform security or performance",
      "Misuse personal data",
      "Harass, abuse, threaten or discriminate against others",
      "Infringe intellectual property rights",
      "Misrepresent your identity or authority",
      "Use the platform for spam, phishing or fraud",
      "Scrape, harvest or extract data without permission",
      "Circumvent platform fees or payment flows",
    ],
  },

  {
    title: "13. Marketplace, Vendors and Third Parties",
    paragraphs: [
      "EventOS may allow organizers to connect with vendors, sponsors, venues, service providers or marketplace partners.",
      "Unless expressly stated, wowyou concepts is not responsible for third-party services, products, availability, quality, safety or performance. Users should conduct their own due diligence before engaging third parties.",
      "Third-party providers may have their own terms and privacy policies.",
    ],
  },

  {
    title: "14. Data Protection",
    paragraphs: [
      "Our processing of personal data is explained in our Privacy Policy.",
      "Depending on the activity, wowyou concepts may act as a data controller for account, billing, marketing, platform administration and direct user relationships, and/or as a data processor where we process attendee or event data on behalf of an event organizer.",
      "organizers are responsible for ensuring they have a lawful basis to collect and process personal data through EventOS.",
    ],
  },

  {
    title: "15. International Use",
    paragraphs: [
      "EventOS may be used by customers and attendees in Ireland, the UK, the European Economic Area and selected African markets.",
      "Users are responsible for complying with local laws applicable to their events, attendees, content, taxes, consumer rights, payments, marketing, accessibility and data protection.",
      "Where country-specific laws require additional terms, data processing agreements or local compliance steps, those may apply in addition to these Terms.",
    ],
  },

  {
    title: "16. Service Availability",
    paragraphs: [
      "We aim to provide a reliable service but do not guarantee uninterrupted or error-free access.",
      "We may suspend or limit access for maintenance, upgrades, security issues, non-payment, legal compliance or misuse.",
      "Some features may be released as beta or pilot features and may change or be withdrawn.",
    ],
  },

  {
    title: "17. Security",
    paragraphs: [
      "We use reasonable technical and organisational measures to protect the platform. However, no online service is completely secure.",
      "Users are responsible for maintaining secure passwords, access controls and internal permissions.",
    ],
  },

  {
    title: "18. Confidentiality",
    paragraphs: [
      "Where we receive confidential business information from enterprise clients, organizers, vendors or partners, we will use reasonable care to protect it and use it only for legitimate business purposes connected with the platform.",
    ],
  },

  {
    title: "19. Suspension and Termination",
    paragraphs: [
      "We may suspend or terminate access if you breach these Terms, fail to pay fees, misuse the platform, create legal, security or reputational risk, or use the platform for fraudulent or unlawful purposes.",
      "You may stop using the platform at any time.",
      "Termination does not remove obligations that should reasonably continue, including payment obligations, confidentiality, intellectual property, data protection, liability and dispute provisions.",
    ],
    bullets: [
      "Breach these Terms",
      "Fail to pay fees",
      "Misuse the platform",
      "Create legal, security or reputational risk",
      "Use the platform for fraudulent or unlawful purposes",
    ],
  },

  {
    title: "20. Disclaimers",
    paragraphs: [
      "EventOS is provided on an “as is” and “as available” basis. We do not guarantee that the platform will meet every requirement, generate specific revenue, ensure event success, prevent all fraud, or produce error-free AI outputs.",
      "To the fullest extent permitted by law, we disclaim implied warranties of merchantability, fitness for a particular purpose and non-infringement.",
    ],
  },

  {
    title: "21. Limitation of Liability",
    paragraphs: [
      "To the fullest extent permitted by law, wowyou concepts will not be liable for indirect, consequential, special, punitive or loss-of-profit damages.",
      "Our total liability for claims relating to the platform will not exceed the fees paid by you to wowyou concepts for the relevant service in the 12 months before the claim arose.",
      "Nothing in these Terms limits liability where it cannot legally be limited, including liability for fraud, fraudulent misrepresentation, death or personal injury caused by negligence.",
    ],
  },

  {
    title: "22. Indemnity",
    paragraphs: [
      "You agree to indemnify wowyou concepts against claims, losses, damages, costs and expenses arising from your breach of these Terms, your event, content, attendees or vendors, your misuse of personal data, your infringement of third-party rights, or your violation of applicable law.",
    ],
    bullets: [
      "Your breach of these Terms",
      "Your event, content, attendees or vendors",
      "Your misuse of personal data",
      "Your infringement of third-party rights",
      "Your violation of applicable law",
    ],
  },

  {
    title: "23. Changes to These Terms",
    paragraphs: [
      "We may update these Terms from time to time. Where changes are material, we will take reasonable steps to notify users.",
      "Continued use of EventOS after changes take effect means you accept the updated Terms.",
    ],
  },

  {
    title: "24. Governing Law and Jurisdiction",
    paragraphs: [
      "These Terms are governed by the laws of Ireland.",
      "Subject to any mandatory consumer protection rights or local laws that cannot be excluded, disputes will be subject to the courts of Ireland.",
    ],
  },

  {
    title: "25. Contact",
    paragraphs: [
      "For questions about these Terms, contact wowyou concepts.",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      description="The terms governing access to and use of the WoWYou EventTech / EventOS platform."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}