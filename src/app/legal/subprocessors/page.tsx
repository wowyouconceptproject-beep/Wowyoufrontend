import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Purpose of this List",
    paragraphs: [
      "wowyou concepts uses selected third-party service providers to help operate, secure, improve and support the WoWYou EventTech / EventOS platform.",
      "These providers may process personal data where they provide services such as hosting, payments, email delivery, analytics, AI functionality, authentication, customer support and security monitoring.",
      "This list supports transparency under GDPR, UK GDPR and other applicable data protection laws.",
      "It should be read together with the WoWYou EventOS Privacy Policy, Data Processing Agreement, Cookie Policy and Terms of Service.",
    ],
  },

  {
    title: "2. Controller / Processor Context",
    paragraphs: [
      "When an event organizer or enterprise customer uses EventOS to manage attendee, speaker, exhibitor, sponsor, vendor or event user data, that customer will usually act as the data controller and wowyou concepts will usually act as a data processor.",
      "In that context, the providers listed on this page may act as sub-processors of wowyou concepts.",
      "For wowyou concepts account administration, billing, platform security, marketing, legal compliance and direct communications, wowyou concepts may act as an independent data controller.",
    ],
  },

  {
    title: "3. Current Sub-processor List",
    paragraphs: [
      "The production providers used by EventOS are being confirmed as part of the platform's pre-launch configuration.",
      "The table below identifies the categories of service providers that may be appointed. Provider names, locations, privacy links and transfer safeguards will be added before the relevant service is enabled in production.",
      "wowyou concepts will not publish a provider as an active sub-processor unless that provider is actually used or formally appointed.",
    ],
  },

  {
    title: "3.1 Hosting, Cloud Infrastructure and Database Services",
    paragraphs: [
      "Potential provider category: cloud hosting, infrastructure and database services.",
      "Purpose: hosting the EventOS website, web application, mobile application backend, databases, file storage, backups, logs and platform infrastructure.",
      "Personal data processed may include account data, event data, attendee registration data, ticket and check-in data, technical logs, security logs and uploaded files where applicable.",
      "Preferred location and safeguards: EU/EEA or UK hosting where practical. A Data Processing Agreement and appropriate international transfer safeguards will be required where applicable.",
      "Status: To be confirmed before go-live.",
    ],
  },

  {
    title: "3.2 Payment Processing and Fraud Controls",
    paragraphs: [
      "Potential provider category: payment processing and fraud prevention services.",
      "Purpose: processing ticket payments, refunds, chargebacks, organizer payouts, payment status, transaction references and fraud monitoring.",
      "Personal data processed may include name, email address, billing details, payment status, transaction references and refund or chargeback information.",
      "Full payment card data should be handled by the payment processor and not stored by EventOS unless expressly required and legally supported.",
      "Provider location, contractual role and transfer safeguards will be confirmed before paid ticketing launches.",
      "Status: To be confirmed before paid ticketing launch.",
    ],
  },

  {
    title: "3.3 Transactional Email, Marketing Email and Notifications",
    paragraphs: [
      "Potential provider category: transactional email, marketing email and platform notification services.",
      "Purpose: sending account emails, event confirmations, ticket emails, QR pass emails, password resets, organizer updates, service notices and consented marketing communications.",
      "Personal data processed may include name, email address, event registration status, ticket reference, message content and email delivery or engagement data.",
      "An EU/UK provider is preferred where practical. Appropriate contractual and international transfer safeguards will be required where applicable.",
      "Status: To be confirmed before email deployment.",
    ],
  },

  {
    title: "3.4 Analytics, Performance and Product Usage Measurement",
    paragraphs: [
      "Potential provider category: analytics, performance monitoring and product usage measurement.",
      "Purpose: understanding website and platform usage, performance, conversion journeys, feature adoption, errors and product improvement opportunities.",
      "Personal data processed may include cookie identifiers, IP address where applicable, device and browser data, event usage data, aggregated analytics and technical logs.",
      "Non-essential analytics will require consent where applicable.",
      "A privacy-focused EU/UK option is preferred where practical, with appropriate contractual and transfer safeguards.",
      "Status: To be confirmed before analytics activation.",
    ],
  },

  {
    title: "3.5 AI Services and AI-Assisted Features",
    paragraphs: [
      "Potential provider category: AI services and AI-assisted functionality.",
      "Purpose: providing AI event planning support, attendee recommendations, content assistance, analytics, event summaries, workflow automation and AI-powered support features.",
      "Personal data processed may include AI prompts, AI outputs, event information, profile or interest data where enabled and usage metadata.",
      "Special category data should not be submitted to AI providers unless expressly authorised, legally permitted and appropriately safeguarded.",
      "EU/UK data residency and no-training options are preferred where available. AI providers must be subject to appropriate contractual, security, confidentiality and international transfer safeguards.",
      "wowyou concepts will not use customer event data or attendee personal data to train general-purpose AI models unless expressly agreed with the customer and supported by appropriate legal documentation.",
      "Status: To be confirmed before AI production use.",
    ],
  },

  {
    title: "3.6 Customer Support and Helpdesk",
    paragraphs: [
      "Potential provider category: customer support and helpdesk services.",
      "Purpose: handling support tickets, customer service queries, bug reports, onboarding support and enterprise account communications.",
      "Personal data processed may include name, email address, organisation, support messages, screenshots or logs submitted by users, account information and issue history.",
      "Support access should be role-restricted and providers should be subject to appropriate contractual, security and data protection safeguards.",
      "Status: Optional / to be confirmed.",
    ],
  },

  {
    title: "3.7 Authentication and Identity Management",
    paragraphs: [
      "Potential provider category: authentication and identity management services.",
      "Purpose: managing login, account access, authentication, password reset, single sign-on, role-based permissions and security monitoring.",
      "Personal data processed may include name, email address, user ID, login metadata, authentication logs and security events.",
      "Device-native biometric templates should remain on user devices and should not be stored by EventOS.",
      "Appropriate contractual, security and transfer safeguards will apply where a third-party authentication provider is used.",
      "Status: To be confirmed.",
    ],
  },

  {
    title: "3.8 Error Monitoring, Logging and Security Monitoring",
    paragraphs: [
      "Potential provider category: application monitoring, error reporting, logging and security monitoring.",
      "Purpose: detecting application errors, service failures, security events, operational issues and performance problems.",
      "Potential data may include IP addresses, device information, technical identifiers, application logs, error traces, account identifiers and security events.",
      "Logging providers should be configured to minimise personal data and should have appropriate retention, access and security controls.",
      "Status: To be confirmed.",
    ],
  },

  {
    title: "4. Sub-processor Approval Criteria",
    paragraphs: [
      "Before any provider is added to the live platform, wowyou concepts should confirm that the provider meets appropriate legal, privacy, security and operational standards.",
    ],
    bullets: [
      "A written agreement or Data Processing Agreement is in place where required.",
      "The provider offers appropriate technical and organisational security measures.",
      "The provider supports GDPR, UK GDPR and applicable local data protection requirements.",
      "International transfers are covered by an adequacy decision, Standard Contractual Clauses, UK Addendum, International Data Transfer Agreement or another valid transfer safeguard where required.",
      "The provider only processes personal data for the authorised purpose.",
      "The provider has appropriate breach notification, retention, deletion and access control processes.",
      "For AI providers, customer data should not be used to train general-purpose models unless expressly agreed with the customer.",
    ],
  },

  {
    title: "5. Changes to this Sub-processor List",
    paragraphs: [
      "wowyou concepts may update this list when new service providers are appointed, removed or replaced.",
      "Material changes affecting enterprise customers may be notified through the platform, by email, through the customer account area or through the published website policy page.",
      "Customers with a signed Data Processing Agreement may have additional notification or objection rights as set out in their agreement.",
    ],
  },

  {
    title: "6. International Transfers",
    paragraphs: [
      "wowyou concepts aims to use EU/EEA or UK data processing locations where practical.",
      "Where a provider processes personal data outside the EU/EEA, UK or another jurisdiction recognised as adequate, wowyou concepts will rely on appropriate transfer safeguards.",
    ],
    bullets: [
      "Adequacy decisions",
      "EU Standard Contractual Clauses",
      "UK International Data Transfer Agreement",
      "UK Addendum to the EU Standard Contractual Clauses",
      "Transfer risk assessments where required",
      "Supplementary technical and organisational security measures",
    ],
  },

  {
    title: "7. AI Provider Controls",
    paragraphs: [
      "Where EventOS uses AI providers, wowyou concepts will apply additional controls designed to protect customer and attendee data.",
    ],
    bullets: [
      "Use enterprise or business AI accounts where available.",
      "Disable training on customer prompts, outputs and event data unless expressly agreed.",
      "Avoid sending unnecessary personal data to AI systems.",
      "Do not submit special category data unless a lawful basis and appropriate safeguards are confirmed.",
      "Maintain transparency in the platform when AI features are used.",
      "Retain human oversight for AI-generated recommendations, reports and content.",
    ],
  },

  {
    title: "8. What Is Not Included in this List",
    paragraphs: [
      "This list does not normally include customers, event organizers, attendees, vendors chosen directly by organizers, venues, speakers or public authorities.",
      "It may also not include organisations that act as independent controllers rather than processors, although those organisations should have their own privacy policies and contractual terms.",
      "The fact that an organisation is not listed here does not necessarily mean that it does not process personal data in connection with an EventOS event. The list specifically concerns service providers appointed by wowyou concepts to support the EventOS platform.",
    ],
  },

  {
    title: "9. Publication and Maintenance",
    paragraphs: [
      "This page will be maintained as the public record of EventOS sub-processors.",
      "Before production launch, wowyou concepts will replace all applicable 'To be confirmed' entries with the actual approved provider name, service category, processing purpose, relevant data categories, processing location and applicable transfer safeguard.",
      "The published list should remain aligned with the provider schedule contained in applicable Data Processing Agreements.",
      "wowyou concepts should publish or provide an updated sub-processor list to enterprise customers on request.",
    ],
  },

  {
    title: "10. Contact",
    paragraphs: [
      "For questions about this Sub-processor List or how wowyou concepts manages service providers, contact wowyou concepts.",
      "Platform: WoWYou EventTech / EventOS",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },
];

export default function SubprocessorsPage() {
  return (
    <LegalLayout
      title="Sub-processors"
      description="The third-party service providers that may process personal data when supporting the WoWYou EventTech / EventOS platform."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}