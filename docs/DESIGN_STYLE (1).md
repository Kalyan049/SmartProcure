# SmartProcure — Design Style Guide

**Project:** SmartProcure  
**SIH Problem Statement:** SIH26032  
**Ministry:** Ministry of Consumer Affairs, Food & Public Distribution  
**Category:** Software  
**Theme:** Smart Automation  
**Team:** InnoSix  
**Design Version:** 1.0  
**Architecture Reference:** SmartProcure Architecture v3.0

---

# 1. Purpose

This document is the visual and UX source of truth for the SmartProcure prototype.

Every AI coding agent, designer, or developer must read this document before creating or modifying user-interface components.

SmartProcure is not a generic SaaS dashboard and should not look like one.

The interface must communicate:

- trust
- clarity
- reliability
- agricultural context
- operational intelligence
- accessibility
- simplicity
- government readiness

The design must support the central product promise:

> **WHEN to arrive → WHERE to go → HOW LONG to wait → WHAT is happening → WHEN payment is completed**

The most important UX principle is that SmartProcure should feel like an intelligent coordination system rather than a simple appointment or token-booking application.

---

# 2. Product Design Direction

## 2.1 Overall Design Personality

SmartProcure should feel:

- trustworthy
- modern
- calm
- practical
- agricultural
- human-centered
- operational
- transparent
- dependable

The interface should avoid looking:

- overly futuristic
- overly corporate
- childish
- game-like
- crypto/web3-like
- excessively AI-themed
- unnecessarily decorative

The visual hierarchy should prioritize useful information over decoration.

---

# 3. Primary UX Principles

## 3.1 Clarity First

A farmer should immediately understand:

1. What is my next action?
2. Where should I go?
3. When should I go?
4. What is my token?
5. How long will I wait?
6. What is happening with my produce?
7. When will I receive payment?

Never make the farmer search through several screens for critical operational information.

---

## 3.2 One Primary Action

Each important screen should have one visually dominant primary action.

Examples:

- Dashboard → **Book a Slot**
- Center Discovery → **Get Recommendation**
- Recommendation → **Continue with This Slot**
- Booking Review → **Confirm Booking**
- Queue → **Check My Status**
- Should I Go Now? → **View Directions / Prepare to Go**
- Procurement → **View Current Stage**
- Grievance → **Submit Grievance**

Secondary actions should be visually quieter.

---

## 3.3 Progressive Disclosure

Do not show every piece of information at once.

Show:

- critical information first
- supporting information second
- detailed information when requested

Example:

Primary:

> **Center B — 10:40 AM**

Supporting:

> Queue: 32 farmers  
> Estimated wait: 35 min  
> Load: 45%

Detailed:

> Why this center was recommended

---

## 3.4 Explainable Automation

SmartProcure recommendations must never feel like unexplained AI magic.

The recommendation card should clearly show:

- recommended center
- recommended time
- score
- queue
- capacity
- ETA
- distance
- reason
- alternatives

Use language such as:

> **Recommended because:** lower queue, available capacity, and shorter estimated waiting time.

Do not display technical scoring formulas to farmers unless placed in an optional detail view.

Do not claim deterministic rules are machine learning.

---

# 4. Color System

Use a restrained agricultural/government-inspired palette.

## 4.1 Brand Colors

Primary brand color:

```text
Deep Green
#166534
```

Use for:

- primary buttons
- active navigation
- important links
- selected states
- positive operational actions

Secondary agricultural green:

```text
Fresh Green
#22C55E
```

Use sparingly for:

- successful states
- positive indicators
- progress
- healthy capacity

Accent:

```text
Warm Amber
#F59E0B
```

Use for:

- warnings
- attention states
- queue pressure
- pending actions

Critical:

```text
Red
#DC2626
```

Use only for:

- critical capacity
- failed actions
- errors
- urgent alerts
- cancellation

Information:

```text
Blue
#2563EB
```

Use for:

- informational messages
- neutral system information
- links where appropriate

---

## 4.2 Neutral Colors

Background:

```text
#F8FAFC
```

Surface:

```text
#FFFFFF
```

Primary text:

```text
#0F172A
```

Secondary text:

```text
#475569
```

Muted text:

```text
#64748B
```

Border:

```text
#E2E8F0
```

Disabled:

```text
#CBD5E1
```

Do not use large areas of pure black.

---

# 5. Color Usage Rules

Color must communicate meaning.

Do not use color merely as decoration.

Recommended semantic mapping:

| Meaning | Color |
|---|---|
| Success / healthy | Green |
| Warning / attention | Amber |
| Critical / error | Red |
| Information | Blue |
| Neutral | Slate |
| Primary action | Deep Green |

Always combine color with:

- text
- icons
- status labels

Never communicate an important state using color alone.

---

# 6. Typography

Use a clean modern sans-serif font.

Preferred:

```text
Inter
```

Fallback:

```text
system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

## 6.1 Typography Hierarchy

Display:

```text
32–40px
font-weight: 700
```

Page heading:

```text
24–32px
font-weight: 700
```

Section heading:

```text
18–22px
font-weight: 600
```

Card heading:

```text
16–18px
font-weight: 600
```

Body:

```text
14–16px
font-weight: 400
```

Supporting text:

```text
12–14px
font-weight: 400
```

Large operational numbers such as:

- token number
- queue position
- ETA
- payment amount

may use larger, stronger typography.

Never use tiny text for important information.

---

# 7. Spacing System

Use a consistent spacing scale based on multiples of 4px.

Preferred values:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Default page padding:

Desktop:

```text
24–32px
```

Mobile:

```text
16px
```

Card internal padding:

```text
16–24px
```

Maintain generous spacing between unrelated sections.

---

# 8. Border Radius

Use moderate rounding.

Preferred:

```text
4px   → small controls
8px   → buttons / inputs
12px  → cards
16px  → major feature cards
```

Avoid excessive pill-shaped UI unless the component is a:

- status badge
- filter
- tag
- compact control

---

# 9. Shadows

Use subtle shadows only where useful.

Preferred:

- cards
- modals
- floating actions
- navigation surfaces

Avoid heavy shadows.

Default cards should often work with:

```text
1px border + subtle shadow
```

The interface should remain clean rather than looking like every element is floating in space.

---

# 10. Layout Principles

## 10.1 Farmer Layout

The farmer interface is mobile-first.

Prioritize:

- large touch targets
- short text
- strong hierarchy
- simple navigation
- obvious next actions
- readable numbers
- minimal data density

Recommended structure:

```text
Header
↓
Current status / appointment
↓
Primary action
↓
Important information
↓
Secondary actions
↓
Recent activity
```

---

## 10.2 Officer Layout

The officer interface is operational and information-dense.

Prioritize:

- KPIs
- queue
- expected arrivals
- capacity
- processing stages
- alerts
- tables
- charts
- operational actions

Recommended structure:

```text
Top Navigation
↓
KPI Row
↓
Alerts
↓
Queue / Expected Arrivals
↓
Capacity + Processing
↓
Analytics
```

---

# 11. Responsive Design

SmartProcure must work on:

- mobile
- tablet
- laptop
- desktop

Breakpoints should be implemented using Tailwind responsive utilities rather than hard-coded device assumptions.

## Mobile

Use:

- single-column layouts
- bottom navigation where appropriate
- stacked cards
- full-width primary buttons
- large touch targets

## Tablet

Use:

- two-column layouts where useful
- compact navigation
- adaptive cards

## Desktop

Use:

- sidebar/navigation
- multi-column dashboards
- tables
- charts
- operational panels

Never allow important information to become horizontally clipped.

---

# 12. Accessibility

Accessibility is a core requirement.

## 12.1 Touch Targets

Important interactive controls should have approximately:

```text
44px minimum touch target
```

Prefer larger controls for the farmer experience.

---

## 12.2 Contrast

Maintain strong contrast between:

- text and background
- buttons and background
- status indicators and surfaces

Do not rely on pale text.

---

## 12.3 Keyboard Navigation

Interactive elements must support:

- keyboard navigation
- visible focus
- logical tab order

---

## 12.4 Screen Readers

Use:

- semantic HTML
- accessible labels
- meaningful button names
- appropriate ARIA attributes where required

Avoid icon-only buttons without accessible labels.

---

# 13. Navigation

## 13.1 Farmer Navigation

Keep navigation simple.

Recommended primary destinations:

```text
Home
Book
Queue
Procurement
Profile
```

Notifications should remain easily accessible.

Additional pages:

```text
Centers
Payments
Grievances
Analytics
History
```

Do not expose every backend module as a navigation item.

---

## 13.2 Officer Navigation

Recommended:

```text
Dashboard
Queue
Capacity
Procurement
Alerts
Analytics
Grievances
```

Officer navigation may use a sidebar on desktop.

---

# 14. Dashboard Design

## 14.1 Farmer Dashboard

The first screen should immediately show the current procurement situation.

Recommended hierarchy:

```text
Good morning, Farmer

Next appointment
┌───────────────────────────┐
│ Center B                  │
│ 10:40 AM                  │
│ Token: SP-1047            │
│ ETA: 35 min               │
│                            │
│ [Should I Go Now?]        │
└───────────────────────────┘

[ Book a Slot ]

Queue Status
Procurement Status
Payment Status
Recent Notifications
```

Do not overwhelm the farmer with analytics before their immediate task.

---

## 14.2 Officer Dashboard

Recommended KPI cards:

```text
Expected Arrivals
Current Queue
Processed
Waiting
Capacity
Utilization
Pending Stages
Target Achievement
```

Use charts only when they support operational decisions.

---

# 15. Procurement Center Cards

Center cards should present operational information clearly.

Example:

```text
┌──────────────────────────────────┐
│ Center B                    OPEN │
│                                  │
│ 32 in queue                      │
│ 45% capacity                     │
│ ~35 min wait                     │
│ 6 min / farmer                   │
│                                  │
│ 2.4 km away                      │
│                                  │
│ [Recommended]                    │
│                                  │
│ [View Slots]                     │
└──────────────────────────────────┘
```

Important values should be visually scannable.

---

# 16. Smart Recommendation Card

This is a signature SmartProcure component.

It should visually communicate:

```text
RECOMMENDED
Center B

10:40 AM
Estimated wait: 35 min

Queue       32
Capacity    45%
Distance    2.4 km

Why this is recommended:
Lower queue and available capacity make this
the best current option.

[Continue]
```

Alternatives can appear below.

Do not make the recommendation look like a mysterious AI-generated result.

---

# 17. Booking Experience

Booking should feel safe and deliberate.

Flow:

```text
Crop
↓
Quantity
↓
Preferred Date
↓
Preference
↓
Recommendation
↓
Slot
↓
Review
↓
Confirmation
```

Before final confirmation, show:

- center
- date
- time
- crop
- quantity
- estimated waiting time
- token behavior

Primary CTA:

```text
Confirm Booking
```

The final booking action must require explicit confirmation.

---

# 18. Token Card

Token is one of the most important farmer-facing pieces of information.

Example:

```text
YOUR TOKEN

SP-1047

Center B
10:40 AM

Queue position
12

Farmers ahead
11

Estimated wait
35 min
```

Token number should use large typography.

---

# 19. Live Queue Design

The queue screen must answer:

> "Where am I in the queue and how long do I need to wait?"

Show:

- farmer token
- current token
- queue position
- farmers ahead
- ETA
- center load
- processing rate
- last updated time

Example:

```text
Your Token
SP-1047

Position
12

11 farmers ahead

Estimated wait
35 minutes

Center load
45%

Updated 2 minutes ago
```

Use a clear progress indicator when useful.

---

# 20. "Should I Go Now?" Design

This is a signature feature and deserves strong visual emphasis.

Possible states:

## GO NOW

```text
GO NOW

The queue is moving quickly.
Your estimated wait is 24 minutes.

Recommended departure:
9:55 AM
```

## PREPARE TO GO

```text
PREPARE TO GO

Your turn is approaching.

Estimated wait:
48 minutes
```

## WAIT

```text
WAIT

The queue is currently high.

Estimated wait:
1 hour 40 minutes
```

## DO NOT GO

```text
DO NOT GO

The procurement center is currently closed.

We will notify you when the situation changes.
```

Always show the reason.

Do not rely only on color.

---

# 21. Procurement Timeline

Use a vertical timeline.

```text
✓ Booked
│
✓ Arrived
│
✓ Inspection
│
● Grading
│
○ Weighing
│
○ Verification
│
○ Completed
│
○ Payment
```

Visual states:

- completed
- current
- upcoming
- failed/problem

The current stage should be visually dominant.

---

# 22. Payment Design

Payment information should be highly readable.

Example:

```text
Payment Status
PAID

Accepted Quantity
38.5 quintals

Rate
₹2,300 / quintal

Gross Amount
₹88,550

Deductions
₹550

Net Amount
₹88,000

Transaction ID
SP-PAY-10291
```

For the MVP, clearly identify simulated payment behavior where appropriate.

---

# 23. Status Badges

Use consistent status labels.

Examples:

```text
OPEN
CLOSED
NORMAL
BUSY
HIGH
CRITICAL
WAITING
ARRIVED
INSPECTION
GRADING
WEIGHING
VERIFICATION
COMPLETED
PENDING
PAID
FAILED
```

Status badge design:

```text
[ STATUS ]
```

Use semantic colors plus text.

---

# 24. Capacity Visualization

Capacity should be immediately understandable.

Example:

```text
Center B

Capacity
██████████░░░░░░░░

45% utilized

Status: NORMAL
```

Suggested thresholds:

```text
0–60%   NORMAL
60–80%  BUSY
80–90%  HIGH
90%+    CRITICAL
```

These visual thresholds must remain consistent with the business logic implemented by the application.

---

# 25. Officer Queue Table

Desktop officer queue should use a clear table.

Columns:

```text
Token
Farmer
Crop
Quantity
Appointment
Status
Wait Time
Priority
Action
```

Actions should be concise:

```text
Check In
Start
Update
Complete
```

Avoid excessive action buttons in every row.

Use a contextual menu where necessary.

---

# 26. Alerts

Alerts should communicate operational consequences.

Examples:

```text
⚠ Queue surge
Queue increased significantly at Center B.

⚠ Capacity high
Center A is approaching maximum capacity.

🔴 Center closed
New arrivals should not be directed to this center.

ℹ Processing slowed
Average processing time has increased.
```

Every important alert should tell the user what happened and, where appropriate, what action to take.

---

# 27. Notifications

Notification cards should include:

- icon
- title
- short message
- timestamp
- read/unread state

Example:

```text
Booking Confirmed
Your slot at Center B is confirmed for 10:40 AM.

10 minutes ago
```

Do not write long paragraphs in notification cards.

---

# 28. Voice Agent UI

Voice is an additional access channel, not a separate product.

The visual experience should remain consistent with SmartProcure.

Possible web voice assistant:

```text
┌─────────────────────────────┐
│ SmartProcure Voice          │
│                             │
│        🎙                   │
│                             │
│ Listening...                │
│                             │
│ "Tell me what you need."    │
│                             │
│ [English] [हिन्दी] [తెలుగు] │
│                             │
│ [End Conversation]          │
└─────────────────────────────┘
```

The voice interface should clearly indicate:

- listening
- processing
- speaking
- error
- completed action

Do not make users wonder whether the microphone is active.

---

# 29. Outbound Voice Call Simulation

For the SIH prototype, outbound voice may be represented through a simulated call UI if real telephony is unavailable.

Example:

```text
Incoming SmartProcure Call

SmartProcure
Calling about your booking

"Your recommended arrival time
has changed to 11:30 AM."

[Keep Updated Time]
[Keep Existing Booking]
```

The simulation must use the same backend event and booking state as the real workflow.

Do not fake an independent transaction.

---

# 30. Multilingual UX

Initial languages:

```text
English
Hindi
Telugu
```

Language selection should be visible and easy to change.

Use translation keys instead of scattering hard-coded user-facing text throughout the application.

Example:

```text
common.continue
booking.confirm
queue.estimatedWait
payment.status
```

Numbers, dates, times and units should remain understandable across languages.

---

# 31. Rural Connectivity UX

The interface should remain useful under slow network conditions.

Design for:

- lightweight screens
- limited requests
- clear loading indicators
- cached important information
- visible last-updated timestamps
- graceful errors

Critical information:

- token
- appointment
- center
- ETA
- procurement status
- payment status

should be easy to access.

Avoid large decorative media and unnecessary animations.

---

# 32. Loading States

Never leave a blank page while data loads.

Use skeletons for:

- cards
- tables
- dashboard statistics
- queue
- recommendation results

Example:

```text
██████████████
████████
██████████████████
```

Use spinners for short actions such as:

```text
Confirming booking...
Updating queue...
Saving profile...
```

---

# 33. Empty States

Empty states must explain what the user can do next.

Bad:

```text
No data.
```

Good:

```text
No upcoming bookings.

Choose a crop and quantity to find
the best procurement slot.

[Book a Slot]
```

---

# 34. Error States

Errors should be human-readable.

Bad:

```text
500 INTERNAL_SERVER_ERROR
```

Good:

```text
We could not load the queue.

Your last known position is still available.
Please try again when the connection improves.

[Retry]
```

For booking:

```text
This slot was just filled.

We found the next best available slot.

[View Alternative]
```

---

# 35. Forms

Forms should:

- use clear labels
- avoid unnecessary fields
- show required fields
- validate inline
- provide useful errors
- preserve entered values where possible

Farmer forms should use:

- large inputs
- large controls
- clear units
- examples where useful

Example:

```text
Quantity

[ 40 ]

quintals
```

Do not make farmers guess units.

---

# 36. Buttons

Primary button:

```text
Confirm Booking
Get Recommendation
Book Slot
Check Queue
```

Secondary:

```text
View Details
See Alternatives
Edit
Cancel
```

Danger:

```text
Cancel Booking
Reject
```

Buttons should use action-oriented labels.

Avoid:

```text
Submit
Click Here
Proceed
```

when a more meaningful label is possible.

---

# 37. Icons

Use a consistent icon library.

Icons should support meaning, not replace important text.

Recommended semantic examples:

- calendar → booking
- map pin → center/location
- clock → ETA
- users → queue
- wheat/crop → produce
- truck → arrival
- check → completed
- wallet → payment
- bell → notifications
- microphone → voice
- alert triangle → warning

Do not use decorative icons everywhere.

---

# 38. Charts

Use Recharts for the documented analytics.

Charts should answer an operational question.

Useful officer charts:

- queue trend
- arrivals over time
- processing volume
- crop distribution
- utilization
- target vs achieved
- quality distribution
- payment status

Avoid charts that exist merely to make the dashboard look impressive.

Every chart should have:

- title
- useful labels
- understandable legend where needed
- empty state
- responsive behavior

---

# 39. Tables

Tables are primarily for the officer interface.

Requirements:

- readable column spacing
- clear headers
- status badges
- responsive behavior
- pagination where required
- empty state
- loading state
- useful actions

On mobile, convert dense tables into stacked cards where appropriate.

---

# 40. Maps

Map integration is optional/mock for the MVP.

If a map is shown:

- center markers must be clear
- selected center must be distinguishable
- avoid unnecessary map decoration
- provide list/card alternative
- never make the map the only way to access center information

Farmers should still be able to understand:

- center
- distance
- status
- queue
- ETA
- availability

without relying entirely on a map.

---

# 41. Data Visualization Rules

Use visual hierarchy:

```text
Most important number
        ↓
Supporting number
        ↓
Context
        ↓
Detailed explanation
```

Examples:

```text
35 min
Estimated wait

32 farmers
Current queue

45%
Capacity
```

Do not make every number equally large.

---

# 42. Motion and Animation

Animation should be subtle and functional.

Allowed:

- page transitions
- skeleton shimmer
- queue update feedback
- success confirmation
- modal transitions

Avoid:

- excessive bouncing
- decorative floating elements
- long transitions
- distracting backgrounds
- unnecessary parallax

Important information must appear quickly.

---

# 43. AI/Vibe Coding UI Rules

Any AI coding agent must follow these rules:

1. Read `PRD.md` before implementing requirements.
2. Read `ARCHITECTURE.md` before creating modules.
3. Read `DESIGN_STYLE.md` before creating UI.
4. Inspect existing UI before modifying it.
5. Reuse existing components.
6. Do not create duplicate buttons/cards/forms unnecessarily.
7. Do not introduce a new visual style for each page.
8. Keep Farmer and Officer interfaces visually related but operationally distinct.
9. Keep business logic outside UI components.
10. Do not put fake data directly inside production components when seeded data/services should be used.
11. Do not expose secrets.
12. Do not create fake AI explanations.
13. Do not claim deterministic recommendations are ML.
14. Handle loading states.
15. Handle empty states.
16. Handle error states.
17. Handle offline/poor-network states where applicable.
18. Keep important strings translation-ready.
19. Test responsive layouts.
20. Test keyboard accessibility.
21. Test browser console.
22. Check TypeScript.
23. Check production build.
24. Do not introduce unnecessary dependencies.
25. Do not introduce unnecessary animations.
26. Do not change the established color system without documentation.
27. Do not create decorative dashboard elements with no operational purpose.
28. Preserve the complete farmer journey.
29. Preserve the complete officer journey.
30. Test every completed UI module against this design guide.

---

# 44. Component Library

The following reusable components should be preferred.

## UI

```text
Button
Input
Select
Textarea
Checkbox
Radio
Switch
Modal
Toast
Tooltip
Tabs
Dropdown
```

## Layout

```text
PageContainer
Header
Sidebar
MobileNavigation
Section
Grid
Stack
```

## Cards

```text
Card
KpiCard
CenterCard
RecommendationCard
TokenCard
QueueCard
PaymentCard
NotificationCard
AlertCard
```

## Status

```text
StatusBadge
CapacityBadge
ProcurementStageBadge
BookingStatusBadge
PaymentStatusBadge
```

## Data

```text
DataTable
Timeline
ProgressBar
CapacityMeter
ChartCard
```

## Feedback

```text
LoadingSkeleton
EmptyState
ErrorState
SuccessState
```

These components should be implemented once and reused throughout the application.

---

# 45. Farmer Screen Design Checklist

Every farmer screen should pass:

```text
□ Is the main purpose obvious?
□ Is the primary action obvious?
□ Can a farmer understand it quickly?
□ Are touch targets large enough?
□ Is important information visible without excessive scrolling?
□ Is the language simple?
□ Are units explicit?
□ Are loading states present?
□ Are empty states present?
□ Are errors human-readable?
□ Is the screen responsive?
□ Is it accessible?
□ Is it translation-ready?
```

---

# 46. Officer Screen Design Checklist

Every officer screen should pass:

```text
□ Does it help operational decision-making?
□ Are critical KPIs visible?
□ Is queue status clear?
□ Is capacity clear?
□ Are alerts visible?
□ Can the officer find a farmer/token quickly?
□ Are processing actions obvious?
□ Are tables readable?
□ Are charts useful?
□ Are realtime changes visible?
□ Is last-updated information available?
□ Is the layout responsive?
```

---

# 47. End-to-End Visual Consistency

The entire product must feel like one system.

The visual journey should be:

```text
Login
 ↓
Farmer Dashboard
 ↓
Center Discovery
 ↓
Smart Recommendation
 ↓
Booking
 ↓
Token
 ↓
Live Queue
 ↓
Should I Go Now?
 ↓
Procurement Timeline
 ↓
Payment
 ↓
Notification
```

The Officer journey should use the same visual language:

```text
Login
 ↓
Officer Dashboard
 ↓
Expected Arrivals
 ↓
Queue
 ↓
Farmer
 ↓
Inspection
 ↓
Grading
 ↓
Weighing
 ↓
Verification
 ↓
Completion
 ↓
Payment
```

The Farmer and Officer views must reference the same transaction and must never appear to represent unrelated systems.

---

# 48. SIH Demo Visual Priorities

The SIH prototype should visually emphasize the features that differentiate SmartProcure.

Priority order:

```text
1. Smart Recommendation
2. Smart Booking
3. Live Queue
4. "Should I Go Now?"
5. Officer Queue/Capacity
6. Procurement Tracking
7. Payment Tracking
8. Notifications
9. Voice Agent
10. Outbound Voice Simulation
```

The demo should make the coordination loop obvious:

```text
Officer changes queue
        ↓
ETA changes
        ↓
Recommendation changes
        ↓
Notification triggered
        ↓
Voice/SMS notification
        ↓
Farmer sees updated guidance
```

This is more important than decorative visual effects.

---

# 49. Demo Data Presentation

Use realistic but fictional data.

Example:

```text
Center A
Queue: 85
Capacity: 90%
Processing: 8 min/farmer

Center B
Queue: 32
Capacity: 45%
Processing: 6 min/farmer

Center C
Queue: 18
Capacity: 30%
Processing: 5 min/farmer
```

Changing queue, capacity, or processing rate must visibly affect the recommendation.

Do not use real Aadhaar numbers, bank credentials, or sensitive identity information.

---

# 50. Voice and Visual Consistency

Voice Agent responses and UI labels should describe the same concepts using the same terminology.

For example:

UI:

```text
Estimated wait: 35 minutes
```

Voice:

```text
Your estimated waiting time is about 35 minutes.
```

UI:

```text
Recommended Center: Center B
```

Voice:

```text
Center B is currently the best option.
```

Do not let the voice interface invent terminology that differs from the web application.

---

# 51. Final Design Acceptance

The UI is considered complete only when:

```text
Requirements checked
        ↓
Architecture checked
        ↓
Design checked
        ↓
Existing code inspected
        ↓
Implementation completed
        ↓
Browser tested
        ↓
Responsive tested
        ↓
Accessibility checked
        ↓
Console checked
        ↓
TypeScript checked
        ↓
Build checked
        ↓
Existing workflow tested
        ↓
Design consistency checked
        ↓
Module complete
```

---

# 52. Final Design Goal

SmartProcure should make the farmer feel:

> **"I know when to go, where to go, how long I may wait, what is happening with my produce, and when I will get paid."**

The officer should feel:

> **"I can see arrivals, manage workload, understand queue pressure, process farmers, and keep the procurement center coordinated."**

The design succeeds when the interface communicates these two outcomes immediately.

The product should look like a trustworthy agricultural public-service platform with intelligent coordination, not like a generic AI dashboard.

---

# 53. Source-of-Truth Rule

When a conflict occurs:

```text
PRD
 ↓
Architecture
 ↓
Design Style Guide
 ↓
Existing Implementation
```

Requirements and architecture must not be silently overridden by UI preferences.

Any significant design or architecture change must be documented.

Never modify the design system casually on a page-by-page basis.
