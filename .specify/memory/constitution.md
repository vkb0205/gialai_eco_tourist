<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0
- Modified principles: I. Traveller-Centred Experiences expanded to cover domestic and international journeys;
  II. Truthful, Complete Travel Information expanded for cross-border requirements; IV. Fast, Resilient,
  and Mobile-First clarified for destination discovery and booking flows.
- Added sections: International Travel Readiness under Product and Content Standards.
- Removed sections: None.
- Templates requiring updates: ✅ `.specify/templates/plan-template.md` — existing Constitution Check gate
  remains compatible; ✅ `.specify/templates/spec-template.md` — existing user journeys, requirements,
  assumptions, and measurable outcomes support the principles; ✅ `.specify/templates/tasks-template.md` —
  existing quality, security, and cross-cutting task phases support the principles.
- Follow-up TODOs: None.
-->

# Gia Lai Eco Tourist Constitution

## Core Principles

### I. Traveller-Centred Experiences
Every feature MUST help travellers discover, compare, plan, enquire about, or book a domestic
or international journey with minimal friction. User journeys MUST prioritize clear next actions,
accurate expectations, and mobile-first usability from initial discovery through enquiry or
reservation. The experience MUST serve local, domestic, and international travellers without
assuming a single language, currency, travel style, or level of destination familiarity.

### II. Truthful, Complete Travel Information
Tour names, itineraries, prices, availability, inclusions, exclusions, durations, locations,
images, visa notes, entry requirements, health guidance, and safety requirements MUST be current,
unambiguous, and traceable to an approved source. The product MUST NOT use deceptive urgency,
hidden fees, fabricated reviews, misleading destination claims, or unsupported guarantees.
Information that varies by nationality, season, carrier, supplier, or government policy MUST be
identified as variable and accompanied by a verification source or instruction.

### III. Inclusive and Accessible by Default
All customer-facing interfaces MUST meet WCAG 2.1 AA expectations: semantic structure, keyboard
operation, visible focus, sufficient contrast, descriptive alternatives for meaningful images,
and usable responsive layouts. Core discovery, tour-detail, enquiry, and booking flows MUST work
without a mouse or hover interaction. Content SHOULD be prepared for localization and MUST avoid
cultural stereotypes, exclusionary assumptions, and unexplained local terminology.

### IV. Fast, Resilient, and Mobile-First
The site MUST be usable on typical mobile networks and device sizes, including when travellers
are researching on the move. Images and assets MUST be optimized, unnecessary client-side
dependencies MUST be avoided, and loading, empty, and error states MUST be provided. Essential
destination, itinerary, contact, and booking-status information MUST remain available when
optional enhancements, remote imagery, or third-party services fail.

### V. Privacy and Booking Safety
The product MUST collect only information required to answer an enquiry or complete a booking.
Personal data MUST be protected in transit and at rest; secrets MUST never be exposed in client
code; and consent MUST be obtained where required. Payment information MUST be handled only
through approved secure providers. Booking, enquiry, and availability states MUST be explicit:
the site MUST NOT imply that a reservation, price, seat, room, or service is confirmed until the
agency or supplier has confirmed it.

## Product and Content Standards

- Currencies, dates, times, time zones, cancellation terms, taxes, fees, and booking conditions
  MUST be presented in a locale-aware and understandable format.
- Domestic and international tour content MUST clearly distinguish confirmed facts, estimates,
  recommendations, and traveller responsibilities.
- International offerings MUST surface passport validity, visa or electronic authorization
  considerations, border requirements, insurance guidance, vaccination or health notices when
  applicable, and the date or source of policy verification.
- The agency MUST use authentic, rights-cleared imagery with useful text alternatives and MUST
  distinguish representative images from guaranteed accommodation, transport, or activities.
- Destination safety, accessibility constraints, weather dependencies, activity suitability,
  emergency contacts, and supplier limitations MUST be treated as first-class information.
- The brand voice MUST be welcoming, locally respectful, practical, and suitable for both
  Vietnamese and international audiences without cultural stereotyping.

## Development Workflow and Quality Gates

1. Each change MUST begin with a user-facing outcome and acceptance criteria covering the affected
   traveller journey and, where relevant, domestic or international variations.
2. Responsive layouts MUST be implemented before desktop-specific enhancements and verified at
   narrow, medium, and wide viewports.
3. Changed customer-facing content MUST be reviewed for accuracy, clarity, localization readiness,
   source traceability, and time-sensitive travel-policy wording.
4. Interactive changes MUST be validated for keyboard navigation, semantic markup, visible focus,
   accessible names, and non-hover operation.
5. The applicable lint, type-check, build, and automated test commands MUST pass before release.
   Failures or approved exceptions MUST be documented.
6. Manual checks MUST cover destination discovery, tour-detail review, enquiry or booking,
   unavailable-tour handling, third-party failure handling, and disclosure of booking status.
7. Features that process traveller data or payments MUST receive a privacy and security review
   before release.

## Governance

This constitution supersedes informal implementation preferences for this project. Feature
specifications, plans, implementation work, and reviews MUST demonstrate compliance with these
principles. Any exception requires a documented rationale, owner, scope, expiry or remediation
plan, and approval before release.

Amendments require a recorded change to this document, a version increment following semantic
intent (major for removed or incompatible principles, minor for new material obligations, patch
for clarification), and review of affected templates and active work. Time-sensitive travel,
visa, health, or safety guidance MUST be re-reviewed whenever its source changes or expires.

**Version**: 1.1.0 | **Ratified**: 2026-07-25 | **Last Amended**: 2026-07-25
