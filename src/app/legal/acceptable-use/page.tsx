import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Purpose",
    paragraphs: [
      "This Acceptable Use Policy explains what users may and may not do when using the WoWYou EventTech / EventOS platform, operated by wowyou concepts.",
      "It is intended to protect event organizers, attendees, vendors, sponsors, enterprise customers, partners and the wider public from unlawful, unsafe, abusive, fraudulent or harmful use of the platform.",
      "This Policy forms part of the EventOS Terms of Service and applies in addition to any order form, enterprise agreement, marketplace terms, event rules, refund policy or other contract agreed with wowyou concepts.",
    ],
  },

  {
    title: "2. Who This Policy Applies To",
    paragraphs: [
      "This Policy applies to all users of EventOS, including event organizers and their staff or contractors, corporate and enterprise customers, vendors, suppliers, sponsors, exhibitors, attendees, guests, speakers, panellists, volunteers, marketplace users, service providers, developers, integration partners and API users.",
      "Anyone accessing EventOS through our websites, dashboards, applications or event tools is expected to comply with this Policy.",
      "Where you use EventOS on behalf of an organisation, you are responsible for ensuring that your organisation, staff, contractors, vendors and authorised users comply with this Policy.",
    ],
  },

  {
    title: "3. Relationship with Local Laws",
    paragraphs: [
      "EventOS is intended to serve users in Ireland, the United Kingdom, the European Economic Area and selected African markets.",
      "Users are responsible for complying with all laws and regulations that apply to their events, services, products, content, payments, attendees, data, marketing and operations.",
      "Depending on the event location and user activity, applicable obligations may include data protection, consumer protection, online safety, anti-fraud, advertising, equality, health and safety, accessibility, tax, venue licensing, safeguarding, sanctions, export controls, anti-bribery and anti-money laundering laws.",
      "If local law requires stricter standards than this Policy, the stricter standard applies.",
    ],
  },

  {
    title: "4. General Standards of Conduct",
    paragraphs: [
      "Users must use EventOS lawfully, honestly, safely and respectfully. Users must not use the platform in any way that could harm wowyou concepts, other users, event participants, vendors, venues, payment partners, service providers or the public.",
    ],
    bullets: [
      "Provide accurate information and keep account details up to date.",
      "Respect the rights, safety, privacy and dignity of other users.",
      "Comply with event rules, venue rules and applicable laws.",
      "Use tickets, passes, QR codes, badges and access credentials only as authorised.",
      "Cooperate with reasonable platform safety, security, compliance and verification checks.",
      "Report suspected abuse, fraud, security incidents or unlawful activity promptly.",
    ],
  },

  {
    title: "5. Prohibited Events, Activities and Content",
    paragraphs: [
      "You must not create, promote, facilitate, sell, purchase, upload, communicate, display or support any event, service, product, content or activity through EventOS that is unlawful, unsafe, fraudulent, exploitative, discriminatory, abusive, deceptive or otherwise prohibited by this Policy.",
    ],
    bullets: [
      "Illegal activity, including events or services that violate applicable criminal, civil, regulatory or public order laws.",
      "Promotion or facilitation of illegal goods, services or transactions.",
      "Attempts to evade law enforcement, regulatory requirements, licensing obligations or court orders.",
      "Fake events, fake tickets, fake organizers, fake vendors or fake sponsors.",
      "Misleading event descriptions, pricing, location, speakers, availability or refund information.",
      "Pyramid schemes, advance-fee fraud, investment scams, impersonation or phishing.",
      "Threats, harassment, bullying, stalking, intimidation or targeted abuse.",
      "Hateful, discriminatory or dehumanising content based on protected characteristics or identity.",
      "Content encouraging violence, self-harm, terrorism, extremism or organised hatred.",
      "Events or services that create unreasonable risk to health, safety or welfare.",
      "Human trafficking, exploitation, forced labour, child exploitation or abuse.",
      "Activities involving vulnerable people without appropriate safeguarding and legal authority.",
      "Sexually exploitative, non-consensual or abusive material.",
      "Pornographic, adult or sexually explicit services where prohibited by law, platform policy or payment provider rules.",
      "Any content involving minors in a sexual or exploitative context.",
      "Weapons, explosives, ammunition or regulated weapon accessories unless expressly approved in writing and legally permitted.",
      "Hazardous chemicals, toxic substances, controlled substances or dangerous materials.",
      "Events or marketplace listings involving unsafe products or materials.",
      "Alcohol, tobacco, nicotine, gambling, financial services, healthcare, medicines, insurance, credit or other regulated activities unless legally authorised and expressly approved where required.",
      "Products or services requiring age verification, licences, professional qualifications or regulatory approvals without those controls.",
      "Counterfeit, stolen, unsafe, recalled or prohibited goods.",
      "Unauthorised use of copyrighted materials, trademarks, logos, music, videos, photographs, speaker content or third-party branding.",
      "Selling or distributing counterfeit tickets, merchandise or materials.",
      "Uploading content without the necessary rights, licences or permissions.",
      "Collecting excessive, unlawful or unnecessary personal data.",
      "Uploading attendee lists or personal data without lawful authority.",
      "Selling, scraping, harvesting or misusing personal data.",
      "Using EventOS to spam, profile, discriminate, surveil or target individuals unlawfully.",
    ],
  },

  {
    title: "6. Specific Rules for Event organizers",
    paragraphs: [
      "organizers are responsible for the legality, safety, accuracy and delivery of their events. organizers must ensure that all event information is clear, truthful, current and not misleading.",
    ],
    bullets: [
      "Obtain all required venue permissions, licences, permits, insurance, health and safety approvals and public authority permissions.",
      "Clearly state event location, date, time, eligibility, access requirements, restrictions, pricing, taxes, fees, refund terms and cancellation policy.",
      "Ensure speakers, performers, exhibitors, vendors and sponsors have agreed to participate before using their names, images or brands.",
      "Provide appropriate accessibility information and reasonable accommodation processes where required.",
      "Comply with applicable safeguarding obligations if events involve children, minors, vulnerable individuals or community groups.",
      "Do not oversell tickets or misrepresent capacity, access levels, availability or benefits.",
      "Manage cancellations, postponements, refunds, complaints and attendee communications promptly and fairly.",
      "Do not upload attendee or third-party data unless you have the legal right to do so.",
      "Do not use EventOS communications for spam, unrelated marketing or unlawful direct marketing.",
      "Cooperate with wowyou concepts where we investigate complaints, safety issues, fraud or legal concerns.",
    ],
  },

  {
    title: "7. Specific Rules for Vendors, Sponsors, Exhibitors and Marketplace Users",
    paragraphs: [
      "Vendors, sponsors, exhibitors and marketplace users must provide accurate descriptions of their products and services and must comply with all applicable laws, professional standards, tax rules and sector-specific requirements.",
    ],
    bullets: [
      "Only offer goods or services you are legally permitted and capable of providing.",
      "Provide accurate pricing, availability, delivery timelines, cancellation terms and service details.",
      "Maintain appropriate insurance, licences, qualifications and approvals where required.",
      "Do not sell counterfeit, unsafe, prohibited, recalled, stolen, age-restricted or illegally regulated goods or services.",
      "Do not misrepresent experience, credentials, endorsements, customer reviews or affiliations.",
      "Treat organizers, attendees and other vendors respectfully and professionally.",
      "Comply with vendor verification, due diligence or onboarding requirements requested by wowyou concepts or the organizer.",
    ],
  },

  {
    title: "8. Specific Rules for Attendees and Guests",
    paragraphs: [
      "Attendees and guests must use EventOS and attend events responsibly, respectfully and lawfully.",
    ],
    bullets: [
      "Provide accurate registration and ticketing information.",
      "Do not duplicate, tamper with, resell or misuse tickets, QR codes, digital passes, credentials or badges unless expressly permitted.",
      "Do not attempt to gain unauthorised access to events, sessions, VIP areas, speaker areas, dashboards or restricted content.",
      "Respect organizer instructions, venue rules, staff, speakers, vendors and other attendees.",
      "Do not harass, threaten, abuse, discriminate against or endanger others.",
      "Do not use networking or messaging features for spam, scams, harassment, unlawful marketing or inappropriate contact.",
      "Report safety concerns, fraud, abusive behaviour or suspicious activity promptly.",
    ],
  },

  {
    title: "9. Platform Security and Technical Misuse",
    paragraphs: [
      "Users must not interfere with, compromise, reverse engineer or misuse EventOS, its infrastructure, APIs, data, security features, payment flows or access controls.",
    ],
    bullets: [
      "Attempting unauthorised access to any account, dashboard, system, API, database, network or event environment.",
      "Bypassing rate limits, authentication, permissions, payment controls, ticketing controls, consent controls or security restrictions.",
      "Introducing malware, viruses, ransomware, spyware, malicious code, harmful scripts or denial-of-service attacks.",
      "Scraping, crawling, harvesting, bulk exporting or extracting platform data without written permission.",
      "Reverse engineering, copying, modifying or creating derivative works from EventOS except where expressly permitted by law or contract.",
      "Testing vulnerabilities without written permission through an approved responsible disclosure process.",
      "Sharing administrator credentials, API keys, access tokens or confidential system information with unauthorised parties.",
    ],
  },

  {
    title: "10. AI Feature Use",
    paragraphs: [
      "Where EventOS provides AI-assisted features, users must use them responsibly. AI outputs are assistance tools and must be reviewed by a human before being used for operational, public, legal, financial, marketing or commercial decisions.",
    ],
    bullets: [
      "Do not use AI features to generate illegal, deceptive, abusive, discriminatory, defamatory, infringing or harmful content.",
      "Do not use AI features to make solely automated decisions with legal or similarly significant effects on individuals without lawful authority and appropriate safeguards.",
      "Do not submit special category personal data, confidential information, trade secrets or sensitive third-party data into AI tools unless you are authorised and the feature is approved for that purpose.",
      "Do not use AI tools to profile, exclude, discriminate against, manipulate or exploit attendees, vendors or users.",
      "Do not attempt to bypass AI safety controls, prompt restrictions, access limits or security measures.",
    ],
  },

  {
  title: "11. Payments, Ticketing and Financial Misuse",
  paragraphs: [
    "Users must not misuse EventOS payment, ticketing, refund, payout or marketplace features.",
    "wowyou concepts may withhold, delay, reverse, freeze or investigate payments and payouts where we reasonably suspect fraud, chargebacks, legal violations, policy breaches, security concerns or payment provider requirements.",
  ],
  bullets: [
    "Creating fake events to collect funds or personal data.",
    "Using stolen payment details, unauthorised payment methods or fraudulent chargebacks.",
    "Circumventing platform fees, payment flows, tax obligations, refund rules or payout controls.",
    "Engaging in money laundering, terrorist financing, sanctions evasion, bribery or corruption.",
    "Misrepresenting pricing, taxes, fees, ticket availability, benefits, sponsorship inventory or vendor charges.",
    "Requesting attendees to pay outside approved payment channels where this is intended to avoid platform controls or mislead users.",
  ],
},

  {
    title: "12. Data Protection, Privacy and Confidentiality",
    paragraphs: [
      "Users must comply with applicable privacy and data protection laws, including GDPR, UK GDPR and applicable local data protection laws in the countries where they operate or serve users.",
    ],
    bullets: [
      "Collect only the personal data necessary for the event or service.",
      "Provide appropriate privacy notices to attendees, speakers, vendors and staff.",
      "Use personal data only for the purposes for which it was collected or otherwise lawfully permitted.",
      "Do not upload attendee lists, employee data, CRM data or third-party data unless you have the legal right to do so.",
      "Do not sell, rent, misuse, scrape or disclose personal data without lawful authority.",
      "Do not collect special category data, children's data or criminal offence data unless legally permitted and properly safeguarded.",
      "Apply appropriate security controls to administrator accounts and downloaded reports.",
      "Delete or return personal data when no longer needed or when required by law, contract or data subject rights.",
    ],
  },

  {
    title: "13. Marketing and Communications",
    paragraphs: [
      "Users must not use EventOS communications, email tools, messaging, push notifications or networking features for spam, harassment, phishing or unlawful direct marketing.",
    ],
    bullets: [
      "Only send marketing communications where you have a valid lawful basis or consent where required.",
      "Respect unsubscribe, opt-out and communication preference choices.",
      "Do not mislead users about who is sending a message or why they are receiving it.",
      "Do not send malicious links, phishing messages, fake invoices, fake event notices or deceptive promotions.",
      "Do not use attendee contact details from one event for unrelated marketing without lawful authority.",
    ],
  },

  {
    title: "14. Content Standards",
    paragraphs: [
      "All user content must be lawful, accurate, respectful and appropriate for the context in which it appears. This includes event pages, profiles, images, messages, speaker bios, agendas, exhibitor listings, vendor listings, sponsorship materials, reviews, surveys, AI-generated content and marketplace content.",
    ],
    bullets: [
      "Content must not be defamatory, misleading, fraudulent, hateful, discriminatory, abusive, obscene, exploitative, violent, sexually explicit, infringing, privacy-invasive or otherwise unlawful.",
      "Content must not impersonate another person, organisation, public authority, sponsor, speaker, vendor or brand.",
      "Content must not contain malware, tracking code, hidden redirects, malicious links or unauthorised scripts.",
      "Event descriptions and marketplace listings must fairly represent what is being offered.",
      "Images, logos, music, video and other media must be used only with appropriate rights and permissions.",
    ],
  },

  {
    title: "15. Children, Minors and Vulnerable Persons",
    paragraphs: [
      "EventOS is not designed by default for events involving children, minors or vulnerable persons. Where users organise such events, they must implement appropriate safeguarding, parental or guardian consent, access controls, privacy safeguards and local legal compliance.",
    ],
    bullets: [
      "Do not collect children's data unless legally permitted and properly safeguarded.",
      "Do not use EventOS messaging or networking features in a way that creates safeguarding risks.",
      "Do not publish images, names or identifying details of minors without appropriate permission.",
      "Do not organise or promote activities that exploit, endanger or abuse children or vulnerable persons.",
    ],
  },

  {
    title: "16. Public Sector, Corporate and Enterprise Use",
    paragraphs: [
      "Enterprise, public sector and corporate customers are responsible for ensuring that their authorised users comply with internal policies, procurement rules, records management requirements, information security standards, accessibility obligations and data protection requirements.",
    ],
    bullets: [
      "Designate appropriate administrators and limit access based on role and need.",
      "Ensure event workflows and registration forms are reviewed before publication.",
      "Maintain internal approval processes for public communications, sponsorships and vendor listings.",
      "Notify wowyou concepts promptly of suspected security incidents, data issues or misuse.",
      "Ensure that procurement, public accountability, anti-bribery and conflict-of-interest requirements are met.",
    ],
  },

  {
    title: "17. Reporting Abuse, Illegal Content and Policy Breaches",
    paragraphs: [
      "Users may report suspected illegal content, harmful activity, fraud, safety issues, intellectual property infringement, privacy violations, abusive behaviour or other policy breaches using the report tools available in EventOS or by contacting wowyou concepts.",
      "Reports should include enough information for review, such as the event name, user profile, listing, message, ticket reference, URL, screenshot, reason for concern and any supporting evidence.",
      "wowyou concepts may review reports, request further information, restrict access, remove content, notify organizers, suspend payouts, preserve evidence, notify affected users or escalate matters to regulators, law enforcement, payment providers or competent authorities where appropriate or legally required.",
    ],
  },

  {
    title: "18. Moderation and Enforcement",
    paragraphs: [
      "wowyou concepts may take action where we reasonably believe that this Policy, the Terms of Service, applicable law, payment provider rules, event safety requirements or third-party rights have been breached.",
      "Enforcement decisions may be based on user reports, automated detection, platform monitoring, payment provider alerts, organizer complaints, legal notices, third-party reports, security signals or internal review.",
    ],
    bullets: [
      "Issue a warning or request corrective action.",
      "Remove, restrict, hide, demote or disable content, listings, messages, events, profiles or marketplace pages.",
      "Suspend, restrict or terminate accounts, organizer access, vendor access, API access or administrator privileges.",
      "Cancel or pause ticket sales, registrations, communications or event publication.",
      "Delay, freeze, withhold, reverse or investigate payments and payouts.",
      "Require additional verification, documentation, licences, proof of authority, insurance or compliance evidence.",
      "Block users, devices, IP addresses, payment methods, domains or organisations associated with misuse.",
      "Preserve records for legal, security, compliance, audit or dispute purposes.",
      "Notify relevant organizers, attendees, payment providers, service providers, regulators, law enforcement or other competent authorities where appropriate.",
    ],
  },

  {
    title: "19. Appeals and Review",
    paragraphs: [
      "Where appropriate, affected users may request a review of certain moderation or enforcement decisions by contacting wowyou concepts.",
      "Appeals should include the decision being challenged, the reason for the appeal and any supporting information.",
      "wowyou concepts may decline appeals that are abusive, repetitive, fraudulent, legally restricted, security-sensitive, outside our control, or where the account has been terminated for serious misconduct.",
      "We may maintain restrictions while an appeal is under review.",
    ],
  },

  {
    title: "20. Cooperation with Authorities and Legal Notices",
    paragraphs: [
      "wowyou concepts may cooperate with law enforcement, regulators, courts, supervisory authorities, payment providers, consumer protection bodies, data protection authorities, venue operators, security providers and other competent organisations where legally required or reasonably necessary to protect users, prevent harm, investigate wrongdoing or enforce this Policy.",
      "Users must not use EventOS to avoid legal obligations, court orders, regulatory notices, sanctions, tax obligations, consumer protection rules or lawful investigations.",
    ],
  },

  {
    title: "21. Policy Updates",
    paragraphs: [
      "wowyou concepts may update this Policy from time to time to reflect changes in platform features, laws, markets, operational risks, payment provider rules or user safety requirements.",
      "Where changes are material, we will take reasonable steps to notify users.",
      "Continued use of EventOS after the updated Policy takes effect means that you accept the updated Policy.",
    ],
  },

  {
    title: "22. Contact",
    paragraphs: [
      "Questions, reports or appeals relating to this Policy should be sent to wowyou concepts.",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },
];

export default function AcceptableUsePage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      description="The rules and standards governing lawful, safe and responsible use of WoWYou EventTech / EventOS."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}