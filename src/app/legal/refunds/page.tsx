import {
  LegalDocument,
  LegalLayout,
} from "@/components/legal";

const sections = [
  {
    title: "1. Purpose and Scope",
    paragraphs: [
      "This Refund & Cancellation Policy explains how refunds, cancellations, postponements, rescheduled events, ticket transfers and attendee refund requests are managed on the WoWYou EventTech / EventOS platform.",
      "EventOS is operated by wowyou concepts. The platform may be used by event organizers, enterprise customers, public sector bodies, associations, venues, agencies, sponsors, vendors and attendees in Ireland, the United Kingdom, European markets and selected African markets.",
      "This Policy applies to ticketing and registration transactions processed or managed through EventOS. It should be read together with the EventOS Terms of Service, Privacy Policy, Acceptable Use Policy, Marketplace Terms and any event-specific terms published by the event organizer.",
    ],
  },

  {
    title: "2. Key Definitions",
    paragraphs: [
      "For the purposes of this Policy, the following terms have the meanings set out below.",
    ],
    bullets: [
      "Attendee / Buyer: a person who registers for, reserves, purchases or receives a ticket or pass for an event through EventOS.",
      "Event organizer / organizer: the person or organisation creating, promoting, managing or delivering an event through EventOS.",
      "EventOS / Platform: the WoWYou EventTech EventOS software platform operated by wowyou concepts.",
      "Ticket: a paid or free event registration, QR pass, digital pass, credential, admission right or booking confirmation issued through EventOS.",
      "Platform Fees: fees charged by wowyou concepts for ticketing, booking, processing, service, subscription, AI, marketplace or related platform services.",
      "Payment Processor Fees: fees charged by third-party payment providers, banks, card networks or financial service providers.",
      "Refund Window: the period during which an attendee may request a refund under an organizer's published refund settings or applicable law.",
    ],
  },

  {
    title: "3. Platform Role and organizer Responsibility",
    paragraphs: [
      "Unless wowyou concepts is clearly stated to be the event organizer, EventOS acts as a technology platform that enables organizers to sell, manage and validate tickets.",
      "The event organizer is responsible for the event itself and for setting and honouring its event-specific refund and cancellation terms, subject always to applicable consumer law.",
      "EventOS may facilitate refund processing, notifications and ticket status changes through the platform, but it does not assume responsibility for the organizer's event unless expressly stated.",
      "Where wowyou concepts is the organizer, the WoWYou organizer refund terms in this Policy will apply in addition to any event-specific terms.",
    ],
    bullets: [
      "The organizer is responsible for event delivery, cancellation decisions, postponements, changes, admission rules, venue requirements, accessibility arrangements and attendee communications.",
      "The organizer must publish clear refund terms before tickets are made available for purchase or registration.",
    ],
  },

  {
    title: "4. Core Refund Principles",
    paragraphs: [
      "The following principles apply across EventOS, subject to mandatory consumer protection laws in the attendee's country and the country where the event is sold, hosted or performed.",
    ],
    bullets: [
      "Refund terms must be clear, visible and available before checkout.",
      "Attendees must be told the total ticket price, taxes, mandatory fees and any optional charges before payment.",
      "Optional add-ons must not be pre-selected where this is prohibited by law.",
      "An attendee should receive a confirmation email or other durable confirmation after purchase.",
      "Refunds should normally be returned to the original payment method unless another lawful method is agreed.",
      "A 'no refunds' term must not be used to deny statutory rights where an event is cancelled, not supplied, materially changed, misdescribed or where local consumer law requires a remedy.",
      "EventOS and organizers may apply anti-fraud checks before issuing refunds.",
    ],
  },

  {
    title: "5. Cooling-Off and Change-of-Mind Cancellations",
    paragraphs: [
      "For many event tickets, especially leisure, entertainment, cultural, conference, training, hospitality or similar events provided on a specific date or period, statutory cooling-off rights may not apply in Ireland, the EU/EEA and the UK.",
      "This means attendees may not automatically have a 14-day right to cancel simply because they changed their mind after buying a dated ticket.",
      "This does not remove statutory rights where an event is cancelled, not provided, materially changed, misdescribed or where applicable consumer law provides another remedy.",
      "For events in African markets or other jurisdictions, local consumer protection laws may provide different cancellation rights. Where local mandatory law gives attendees stronger rights, that local law will prevail over this Policy.",
    ],
  },

  {
    title: "6. Event-Specific Refund Settings",
    paragraphs: [
      "EventOS allows organizers to choose and publish an appropriate refund setting before tickets go on sale. organizers may also configure custom terms, provided those terms are lawful, transparent and not unfair.",
    ],
    bullets: [
      "Flexible: Refunds available until a specified number of days before the event.",
      "Moderate: Refunds available until a specified deadline, potentially excluding non-refundable fees where lawful.",
      "Strict: Tickets are non-refundable except where required by law or where the event is cancelled or materially changed.",
      "Custom: Attendees should refer to the organizer's event-specific refund terms.",
    ],
  },

  {
    title: "7. Attendee-Requested Refunds",
    paragraphs: [
      "Where the organizer's published refund setting allows attendee-requested refunds, attendees may submit a refund request through EventOS or through the contact method specified on the event page.",
      "The organizer is responsible for approving or rejecting attendee-requested refunds unless the event is operated directly by wowyou concepts. EventOS may provide workflow tools, templates and status notifications.",
    ],
    bullets: [
      "Attendee name and email address",
      "Event name and date",
      "Ticket order or reference number",
      "Reason for the refund request",
      "Supporting evidence where relevant, such as duplicate purchase, accessibility issue, payment error or event access issue",
    ],
  },

  {
    title: "8. Cancelled Events",
    paragraphs: [
      "If an organizer cancels an event and does not provide the event, attendees may be entitled to a refund under the organizer's terms and applicable consumer law.",
      "Where an event is cancelled, the organizer must promptly notify attendees and EventOS and provide clear information about available remedies.",
      "For cancelled events, the default EventOS position should be that the attendee receives a refund of the ticket price and mandatory charges collected at checkout, unless a different treatment is clearly lawful in the relevant jurisdiction.",
      "Non-refundable payment processor fees or platform fees may only be retained where this is clearly disclosed and legally permitted.",
      "organizers must not use a 'no refunds' statement to avoid obligations arising from cancellation, failure to deliver the event or mandatory consumer protection rules.",
    ],
    bullets: [
      "A refund to the original payment method",
      "Transfer to a rescheduled date",
      "Credit for another event, where lawful and accepted by the attendee",
      "Another remedy required by applicable law",
    ],
  },

  {
    title: "9. Postponed or Rescheduled Events",
    paragraphs: [
      "If an event is postponed or rescheduled, the organizer must notify attendees as soon as reasonably possible and provide the new date, time, venue and any material changes.",
      "The organizer should give attendees a reasonable period to choose between keeping their ticket for the new date or requesting a refund where required by law, the organizer's terms or the nature of the change.",
      "Where an attendee accepts a rescheduled date, the original ticket may remain valid or EventOS may issue a replacement ticket or digital pass.",
    ],
  },

  {
    title: "10. Material Changes",
    paragraphs: [
      "A material change may include a significant change to the date, venue, headline speaker or performer where that person was a main reason for purchase, event format, access rights, ticket category or core event experience.",
      "If a material change occurs, the organizer must inform attendees and explain whether refunds, transfers or credits are available.",
      "EventOS may support a material-change notification workflow and allow organizers to set a response deadline.",
    ],
  },

  {
    title: "11. Online and Hybrid Events",
    paragraphs: [
      "For online or hybrid events, refunds may be appropriate where the organizer fails to provide access credentials, the streaming link does not work due to organizer or platform fault, or the event is not delivered substantially as described.",
      "Refunds are generally not required where the attendee fails to use valid access details, has local connectivity issues, misses the event or uses an unsupported device after clear technical requirements were provided, unless applicable law says otherwise.",
    ],
  },

  {
    title: "12. No-Show, Late Arrival and Refusal of Entry",
    paragraphs: [
      "Unless the organizer's event-specific terms provide otherwise, refunds are not usually available where an attendee does not attend, arrives late and is refused or limited entry under published rules, is refused entry for breaching clearly disclosed requirements, or is removed from an event for misconduct or breach of event rules.",
      "This does not affect statutory rights where the organizer failed to provide the event or where terms were not properly disclosed.",
    ],
    bullets: [
      "Does not attend the event",
      "Arrives late and is refused or limited entry under published event or venue rules",
      "Is refused entry for breaching clearly disclosed age, ID, safety, security, dress code, conduct, venue or legal requirements",
      "Is removed from an event for misconduct or breach of the event rules",
    ],
  },

  {
    title: "13. Duplicate Purchases and Payment Errors",
    paragraphs: [
      "organizers should consider refunding accidental duplicate purchases where the attendee contacts the organizer within a reasonable period and the duplicate tickets have not been used, transferred or resold.",
      "EventOS may automatically flag potential duplicate purchases using matching attendee details, payment references, ticket types or event IDs.",
      "Refunds for duplicate purchases remain subject to organizer approval and applicable law.",
    ],
  },

  {
    title: "14. Ticket Transfers and Resale",
    paragraphs: [
      "organizers may choose whether tickets are transferable. EventOS should make transfer rules clear before checkout and in the ticket confirmation.",
      "Where transfers are allowed, EventOS may require the new attendee's details to be updated for security, venue capacity, age restrictions, accreditation, safeguarding or compliance reasons.",
      "Unauthorised resale, ticket scraping, automated bulk purchase, counterfeit tickets or circumvention of EventOS controls may result in ticket cancellation without refund, where lawful.",
    ],
  },

  {
    title: "15. Platform Fees, Booking Fees and Payment Processor Fees",
    paragraphs: [
      "EventOS may charge ticketing, booking, platform, service, payment processing, AI or marketplace fees. All mandatory charges should be clearly displayed before payment.",
      "For attendee-requested refunds, platform fees and payment processor fees may be non-refundable if they were clearly disclosed and if applicable law permits this.",
      "For cancelled events, material changes, failure to deliver the event or other cases where law requires a full refund, mandatory fees may need to be refunded.",
      "EventOS should support country-specific fee rules to avoid unlawful deductions.",
    ],
  },

  {
    title: "16. Refund Timing and Payment Method",
    paragraphs: [
      "Approved refunds should normally be processed without undue delay and, where applicable, within the timeframe required by local law or payment provider rules.",
      "In many consumer contexts, a 14-day refund period is a useful operational benchmark, but the applicable legal timeframe may vary by jurisdiction and event type.",
      "Refunds will usually be made to the original payment method. If this is not possible, EventOS or the organizer may request an alternative lawful refund method.",
      "Refund receipt times may vary depending on the attendee's bank, card issuer, payment provider, currency and country.",
    ],
  },

  {
    title: "17. Chargebacks, Disputes and Fraud Prevention",
    paragraphs: [
      "Attendees should first contact the organizer or EventOS support before starting a chargeback or payment dispute, where practical.",
      "EventOS may suspend tickets, delay payouts, pause organizer withdrawals or hold a refund reserve where there are chargebacks, fraud indicators, unresolved refund claims, regulatory concerns or event cancellation risk.",
      "Fraudulent refund requests, abusive chargebacks, forged documents, counterfeit tickets, payment fraud or misuse of the platform may lead to ticket cancellation, account suspension, restriction of future access and reporting to payment providers or authorities where appropriate.",
    ],
  },

  {
    title: "18. Payout Holds and Refund Reserves for organizers",
    paragraphs: [
      "To protect attendees, organizers and the platform, EventOS may hold ticket proceeds or maintain a refund reserve before releasing funds to organizers.",
      "This is especially important for high-risk events, first-time organizers, large events, events with long lead times, unusual sales patterns, high dispute rates or events in markets with elevated payment risk.",
      "The amount and duration of any reserve may depend on event risk, sales volume, refund exposure, chargeback risk, organizer history, payment provider requirements and applicable law.",
    ],
  },

  {
    title: "19. Force Majeure and Events Outside Reasonable Control",
    paragraphs: [
      "Events may be affected by circumstances outside reasonable control, such as extreme weather, public health restrictions, security incidents, government orders, strikes, venue closure, transport disruption, civil unrest, utility failure, technology outages or other emergency circumstances.",
      "Where force majeure affects an event, the organizer must communicate promptly with attendees and explain whether the event is cancelled, postponed, rescheduled, moved online, converted to credit or otherwise addressed.",
      "Any remedy must comply with applicable law and the organizer's published terms.",
    ],
  },

  {
    title: "20. Accessibility, Inclusion and Special Requirements",
    paragraphs: [
      "organizers are responsible for providing clear information about venue accessibility, event accessibility, age restrictions, entry requirements and any reasonable accommodation process.",
      "Where an attendee cannot access an event because the organizer failed to provide clearly promised accessibility arrangements or because accessibility information was materially inaccurate, a refund or other remedy may be required under applicable law.",
    ],
  },

  {
    title: "21. Country-Specific Approach",
    paragraphs: [
      "EventOS applies this Policy as a baseline while respecting mandatory consumer protection, e-commerce, payment, tax, data protection and event laws in the relevant country.",
    ],
  },

  {
    title: "21.1 Ireland and EU/EEA",
    paragraphs: [
      "For Ireland and EU/EEA consumers, EventOS and organizers should respect consumer protection rules, including requirements for clear pre-contract information, transparent total pricing and remedies where services are not provided as described.",
      "For dated leisure or event services, the usual cooling-off right may not apply, but statutory rights remain.",
    ],
  },

  {
    title: "21.2 United Kingdom",
    paragraphs: [
      "For UK consumers, EventOS and organizers should respect UK consumer protection rules, including clear upfront pricing, prohibition of misleading practices and ticketing-specific obligations.",
      "Live events on a specific date are generally exempt from the usual 14-day cooling-off period, but attendees may still have rights where an event is cancelled, materially changed or not supplied as described.",
    ],
  },

  {
    title: "21.3 African Markets",
    paragraphs: [
      "For African markets, EventOS will apply this Policy as a baseline while respecting local mandatory consumer, e-commerce, payment, tax, data protection and event laws in the relevant country.",
      "Where local law provides stronger refund rights or requires specific disclosures, local law will prevail.",
    ],
  },

  {
    title: "22. Where wowyou concepts Is the Event organizer",
    paragraphs: [
      "Where wowyou concepts is expressly identified as the event organizer, wowyou concepts will apply the event-specific refund terms shown at checkout and will comply with applicable consumer law.",
      "Unless otherwise stated for a specific WoWYou event, refunds will normally be returned to the original payment method.",
    ],
    bullets: [
      "If WoWYou cancels the event and does not provide a replacement event, attendees will be eligible for a refund of the ticket price and mandatory charges collected at checkout, subject to applicable law.",
      "If WoWYou reschedules the event, attendees may keep their ticket for the new date or request a refund within the stated refund window where required by law or offered by WoWYou.",
      "Change-of-mind refunds will depend on the refund setting published for that event.",
      "Refunds will normally be returned to the original payment method.",
    ],
  },

  {
    title: "23. How to Request a Refund",
    paragraphs: [
      "Attendees may request a refund by using the refund request function in EventOS, if available, or by contacting the organizer using the contact details on the event page or ticket confirmation.",
      "The organizer is normally responsible for reviewing the request and deciding whether it should be approved, rejected or followed up with a request for additional information.",
    ],
    bullets: [
      "Open ticket or order details.",
      "Select 'Request Refund'.",
      "Review the organizer's refund terms and deadline, if any.",
      "Submit the reason and any optional supporting evidence.",
      "The organizer reviews the request and approves, rejects or requests more information.",
      "EventOS notifies the attendee of the decision and expected refund timeline.",
      "If approved, the payment provider processes the refund and the ticket status is updated.",
    ],
  },

  {
    title: "24. Complaints and Escalation",
    paragraphs: [
      "If an attendee is dissatisfied with a refund decision, they should first contact the event organizer.",
      "If the issue relates to payment processing, platform functionality, duplicate charging or EventOS operation, attendees may contact wowyou concepts support.",
      "Where required by law, consumers may also contact their local consumer protection authority, payment provider or dispute resolution body.",
    ],
  },

  {
    title: "25. Changes to this Policy",
    paragraphs: [
      "wowyou concepts may update this Policy from time to time to reflect changes in the platform, payment systems, consumer law, international operations, refund processes or business model.",
      "The latest version should be made available on the EventOS website or app.",
      "Material changes should be communicated to organizers and enterprise customers.",
      "Changes should not be applied retroactively to completed ticket purchases where doing so would unfairly reduce attendee rights.",
    ],
  },

  {
    title: "26. Contact",
    paragraphs: [
      "Refund questions about a specific event should be directed to the event organizer using the contact details on the event page or ticket confirmation.",
      "For platform support questions, contact wowyou concepts.",
      "Email: enquiries@wowyouconcepts.com",
      "Registered address: Michael Galvin (MG) Building, B.A.S.E Enterprise Centre, Ladyswell Road, D15 NX4W, Damastown, Mulhuddart, Ireland.",
    ],
  },
];

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund & Cancellation Policy"
      description="How refunds, cancellations, postponements, rescheduled events and ticket-related disputes are handled through WoWYou EventTech / EventOS."
      effectiveDate="August 2026"
      version="v1.0"
    >
      <LegalDocument sections={sections} />
    </LegalLayout>
  );
}