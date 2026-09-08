# SmartProcure — Frontend & System Architecture Blueprint

**Project:** SmartProcure  
**SIH Problem Statement:** SIH26032  
**Problem:** Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.  
**Ministry:** Ministry of Consumer Affairs, Food & Public Distribution  
**Category:** Software  
**Theme:** Smart Automation  
**Team:** InnoSix  
**Architecture Version:** 3.0

**Architecture Update:** Added Voice Agent and proactive outbound voice calling while preserving the existing Version 2.0 architecture and core transaction flow.

---

## 1. Architecture Purpose

This document is the implementation blueprint for the SmartProcure SIH prototype.

The architecture is designed to produce a working hackathon prototype while remaining understandable and maintainable for a student team using AI-assisted/vibe coding.

Core principle:

**Predict → Recommend → Coordinate → Track → Notify**

SmartProcure must answer:

1. When should I go?
2. Where should I go?
3. How long will I wait?
4. What is happening with my produce?
5. When will I get paid?

The system should not behave like a simple token-booking portal. Its central capability is capacity-aware arrival coordination.

---

## 2. Product Architecture

The core journey is:

```text
Farmer
  ↓
Crop + Quantity + Preferred Date
  ↓
Smart Recommendation Engine
  ↓
Recommended Center + Time
  ↓
Booking
  ↓
Token
  ↓
Live Queue
  ↓
"Should I Go Now?"
  ↓
Check-in
  ↓
Inspection
  ↓
Grading
  ↓
Weighing
  ↓
Verification
  ↓
Completed
  ↓
Payment
  ↓
Notification
```

Officer operations observe and update the same transaction.

---

## 3. High-Level Architecture

```text
                         SMARTPROCURE
                              |
             +----------------+----------------+
             |                                 |
             v                                 v
      FARMER APPLICATION                OFFICER APPLICATION
             |                                 |
             +----------------+----------------+
                              |
                         APPLICATION API
                              |
                       NODE.JS + EXPRESS
                              |
       +----------+-----------+-----------+-----------+
       |          |           |           |           |
      AUTH     BOOKING     QUEUE      PROCUREMENT  PAYMENT
       |          |           |           |           |
       +----------+-----------+-----------+-----------+
                              |
                    SMART COORDINATION ENGINE
                              |
             +----------------+----------------+
             |                |                |
       Recommendation      Capacity           ETA
          Engine            Engine           Engine
             |                |                |
             +----------------+----------------+
                              |
                       SUPABASE / POSTGRESQL
                              |
       +----------------+-----+-----+----------------+
       |                |           |                |
   Realtime       Notifications  Analytics       Audit Logs
```

---

## 4. Technology Stack

### Frontend

- React
- TypeScript
- React Router
- Tailwind CSS
- Recharts
- PWA-ready architecture

### Backend

- Node.js
- Express.js
- REST APIs
- Modular backend architecture

### Database

- Supabase
- PostgreSQL

### Realtime

- Supabase Realtime

### Smart Engine

MVP:
- TypeScript/JavaScript
- deterministic rule-based recommendation
- deterministic ETA
- capacity and queue rules

Future:
- Python
- FastAPI
- ML-based ETA
- demand forecasting

### Deployment

Prototype:
- Vercel for frontend
- Render/Google Cloud where backend hosting is required
- Supabase for database/auth/realtime

---

## 5. Architecture Principles

### 5.1 MVP First

Do not create unnecessary distributed microservices.

Use one backend with clearly separated modules:

```text
backend/
└── modules/
    ├── auth/
    ├── farmers/
    ├── centers/
    ├── slots/
    ├── bookings/
    ├── recommendation/
    ├── queue/
    ├── procurement/
    ├── payments/
    ├── notifications/
    ├── voice-agent/
    ├── grievances/
    └── analytics/
```

### 5.2 Separation of Concerns

Use:

```text
UI
 ↓
Hooks / State
 ↓
Services
 ↓
API
 ↓
Business Logic
 ↓
Database
```

Do not place complex business logic directly inside React components.

### 5.3 Explainable Automation

Every recommendation must expose:

- decision
- score
- factors
- explanation
- alternatives

Do not call deterministic rules machine learning.

### 5.4 Mock External Systems

For the prototype:

- government integrations = mock adapters
- bank integration = mock adapter
- SMS = mock adapter
- Aadhaar/identity verification = mock adapter
- map services = mock/optional

### 5.5 Realtime Only Where Valuable

Use realtime for:

- queue
- capacity
- booking status
- procurement stage
- payment status
- important notifications

---

## 6. User Roles

### Farmer

Primary goal:

**Reach the correct procurement center at the correct time with minimum waiting.**

Capabilities:

- registration
- profile
- center discovery
- smart booking
- recommendation
- token
- live queue
- "Should I Go Now?"
- procurement tracking
- payment tracking
- notifications
- grievances
- history/analytics

### Voice Agent

```text
Inbound call
→ Identify farmer
→ Crop + quantity + date
→ Smart recommendation
→ Voice confirmation
→ Booking
→ Token
→ Queue status
→ Should I Go Now?
→ Procurement status
→ Payment status
```

### Voice Outbound

```text
Important event
→ NotificationService
→ Outbound Voice Service
→ Farmer call
→ Farmer confirmation/input
→ Existing SmartProcure API
→ Shared transaction state
```

### Officer

Primary goal:

**Manage center workload and process farmers efficiently.**

Capabilities:

- dashboard
- expected arrivals
- queue management
- check-in
- inspection
- grading
- weighing
- verification
- capacity
- alerts
- analytics
- grievances

### Admin

Architecture-ready for:

- center management
- user management
- configuration
- analytics
- audit

Admin UI is optional for the first SIH prototype.

---

## 7. Frontend Architecture

```text
frontend/
└── src/
    ├── app/
    │   ├── routes/
    │   ├── providers/
    │   └── config/
    │
    ├── components/
    │   ├── ui/
    │   ├── layout/
    │   ├── cards/
    │   ├── forms/
    │   ├── status/
    │   ├── charts/
    │   └── notifications/
    │
    ├── features/
    │   ├── auth/
    │   ├── farmer/
    │   ├── centers/
    │   ├── booking/
    │   ├── recommendation/
    │   ├── queue/
    │   ├── procurement/
    │   ├── payment/
    │   ├── notifications/
    │   ├── voice-agent/
    │   ├── grievances/
    │   ├── officer/
    │   └── analytics/
    │
    ├── services/
    │   ├── api/
    │   ├── auth/
    │   ├── booking/
    │   ├── recommendation/
    │   ├── voice-agent/
    │   └── realtime/
    │
    ├── hooks/
    ├── utils/
    ├── types/
    ├── data/
    └── App.tsx
```

---

## 8. Application Routes

```text
/
├── /login
├── /register
│
├── /farmer
│   ├── /dashboard
│   ├── /profile
│   ├── /centers
│   ├── /booking
│   ├── /recommendation
│   ├── /booking/confirmation
│   ├── /queue
│   ├── /should-i-go
│   ├── /procurement
│   ├── /payments
│   ├── /notifications
│   ├── /grievances
│   └── /analytics
│
└── /officer
    ├── /dashboard
    ├── /queue
    ├── /capacity
    ├── /procurement
    ├── /alerts
    ├── /analytics
    └── /grievances
```

Use protected routes for authenticated roles.

---

## 9. Farmer Modules

### F01 Login

- mobile number
- OTP/mock OTP
- language

### F02 Dashboard

Display:

- next appointment
- center
- token
- queue position
- ETA
- center load
- procurement stage
- payment status
- notifications

Quick actions:

- Book Slot
- Find Center
- Check Queue
- Track Procurement
- Payment Status
- Raise Grievance

### F03 Profile

Include:

- farmer information
- mobile
- farm locations
- crops
- expected quantity
- verification status
- language
- notification preferences

### F04 Center Discovery

Support:

- search
- location-based discovery
- crop filtering
- availability
- queue
- capacity
- ETA
- distance
- operating hours

### F05 Smart Booking

Flow:

```text
Crop
 ↓
Quantity
 ↓
Date
 ↓
Preference
 ↓
Candidate Centers
 ↓
Smart Recommendation
 ↓
Available Slots
 ↓
Review
 ↓
Confirm
```

### F06 Recommendation

Display:

- recommended center
- recommended time
- queue
- capacity
- ETA
- distance
- score
- reason
- alternatives

### F07 Confirmation

Display:

- booking ID
- token
- center
- date
- arrival window
- ETA
- QR placeholder
- next steps

### F08 Live Queue

Display:

- current token
- farmer token
- queue position
- farmers ahead
- ETA
- center load
- last updated

### F09 "Should I Go Now?"

Return:

```text
GO NOW
WAIT
DO NOT GO YET
```

Always provide the reason.

### F10 Procurement

Timeline:

```text
Booked
 ↓
Arrived
 ↓
Inspection
 ↓
Grading
 ↓
Weighing
 ↓
Verification
 ↓
Completed
 ↓
Payment
```

### F11 Payment

Display:

- accepted quantity
- rate
- gross amount
- deductions
- net amount
- status
- transaction ID
- receipt
- history

### F12 Notifications

Types:

- booking
- reminder
- queue
- inspection
- grading
- weighing
- payment
- alerts

### F13 Grievance

Support:

- create
- track
- category
- description
- evidence
- status
- resolution

### F14 Analytics

Show:

- total produce
- earnings
- transaction count
- average wait
- trends
- history

---

## 10. Officer Modules

### O01 Dashboard

KPI:

- expected arrivals
- current queue
- processed
- waiting
- capacity
- utilization
- expected quantity
- target achievement
- pending stages

### O02 Queue

Table:

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

Actions:

- check in
- call next
- start processing
- skip
- complete

### O03 Capacity

Display:

- total capacity
- current load
- utilization
- remaining capacity
- queue
- expected arrivals
- processing rate

Statuses:

```text
NORMAL
BUSY
HIGH
CRITICAL
```

### O04 Procurement Processing

```text
Arrived
 ↓
Inspection
 ↓
Grading
 ↓
Weighing
 ↓
Verification
 ↓
Completed
```

Prevent invalid stage transitions.

### O05 Alerts

Examples:

- capacity high
- queue surge
- slow processing
- center closure
- payment backlog

### O06 Analytics

Show:

- arrivals
- processing volume
- queue trend
- crop distribution
- average wait
- utilization
- target vs achieved
- quality distribution
- payment status

### O07 Grievances

Allow officers to review, update, resolve, and reject farmer grievances.

---

## 13. Voice Agent Architecture

The Voice Agent is an additional farmer access channel. It uses the same backend APIs, business rules, Smart Coordination Engine, queue engine, ETA engine, database, and notification infrastructure as the web/PWA farmer application.

### 11.1 Voice Agent Flow

```text
Farmer Voice / Phone
        ↓
Voice / IVR Layer
        ↓
Speech Recognition + Intent Understanding
        ↓
Voice Agent Service
        ↓
Existing SmartProcure APIs
        ↓
Business Logic + Smart Coordination Engine
        ↓
Supabase / PostgreSQL
        ↓
Voice Response
```

The Voice Agent must not duplicate procurement business logic. It is a conversational interface over existing SmartProcure capabilities.

### 11.2 Voice Agent Backend Module

```text
backend/modules/voice-agent/
├── voice.routes.ts
├── voice.service.ts
├── voice.tools.ts
├── voice.prompts.ts
├── voice.session.ts
└── adapters/
    ├── speech.adapter.ts
    ├── telephony.adapter.ts
    └── outbound-call.adapter.ts
```

Responsibilities:
- inbound call/webhook handling
- conversation orchestration
- controlled tool execution
- farmer/call session state
- replaceable speech and telephony integrations

### 11.3 Voice Agent Capabilities

MVP support:
- farmer identification
- English/Hindi/Telugu language handling
- smart center recommendation
- slot availability
- slot booking
- booking confirmation
- token lookup
- live queue status
- ETA lookup
- “Should I Go Now?”
- rescheduling and cancellation
- procurement status
- payment status
- important notifications

### 11.4 Voice Tools

```text
getFarmerProfile()
getNearbyCenters()
getSmartRecommendation()
getAvailableSlots()
bookSlot()
getBookingStatus()
rescheduleBooking()
cancelBooking()
getQueueStatus()
getShouldIGoNow()
getProcurementStatus()
getPaymentStatus()
```

Voice tools must call existing backend services rather than directly modifying core database records.

### 11.5 Voice Booking Flow

```text
Farmer calls
 ↓
Identify farmer
 ↓
Capture crop + quantity + preferred date
 ↓
getSmartRecommendation()
 ↓
Recommended center + time + reason
 ↓
Farmer confirms
 ↓
bookSlot()
 ↓
Booking + Token + Queue Entry
 ↓
Notification
 ↓
Voice confirmation
```

Example:

```text
Farmer:
“I want to sell 40 quintals of paddy tomorrow.”

Voice Agent:
“Center B at 10:40 AM is the best option based on current
queue and capacity. Estimated waiting time is 32 minutes.
Should I book this slot?”

Farmer:
“Yes.”

Voice Agent:
“Your booking is confirmed. Your token is SP-1047.”
```

### 11.6 Voice Queue and “Should I Go Now?”

```text
Farmer: “What is my queue position?”
        ↓
getQueueStatus()
        ↓
Token + position + farmers ahead + ETA
        ↓
Voice response
```

For “Should I go now?”, the Voice Agent uses the same existing decision logic as the farmer application. Possible results remain:

```text
GO NOW
PREPARE TO GO
WAIT
DO NOT GO
```

Every response must include a short reason.

### 11.7 Voice and Existing APIs

```text
                 APPLICATION API
                       |
        +--------------+--------------+
        |              |              |
    Farmer UI      Voice Agent    Officer UI
        |              |              |
        +--------------+--------------+
                       |
                Existing Business Logic
                       |
             Smart Coordination Engine
```

Do not create separate voice-only booking, queue, ETA, procurement, or payment logic.

### 11.8 Voice Session Data

Optional supporting table:

```text
voice_sessions
    id
    farmer_id
    call_id
    language
    channel
    started_at
    ended_at
    last_intent
    status
```

Optional audit table:

```text
voice_interactions
    id
    session_id
    intent
    tool_name
    success
    created_at
```

These support debugging and auditability without replacing the core transaction model.

### 11.9 Voice Confirmation and Safety

Require explicit confirmation before:
- booking
- rescheduling
- cancellation
- other irreversible actions

Never claim an action succeeded unless the backend confirms success. If intent is ambiguous, ask a short clarification rather than guessing.

### 11.10 Voice Error Handling

Handle:
- speech recognition failure
- unclear intent
- unknown farmer
- unavailable slot
- slot filled during confirmation
- center closure
- API/network failure
- call disconnect
- stale queue information

Provide a human-readable recovery response and use SMS/in-app fallback where appropriate.

## 14. Voice Outbound Calling Architecture

Outbound voice calling is a proactive notification capability built on top of the existing NotificationService. It does not bypass the notification layer or duplicate business logic.

### 12.1 Outbound Call Flow

```text
Queue / Capacity / Procurement Event
                ↓
         Business Rules
                ↓
       NotificationService
                ↓
       Outbound Call Manager
                ↓
         Telephony Provider
                ↓
           Farmer Phone
                ↓
          Voice Agent
                ↓
      Farmer confirmation/input
                ↓
        Existing SmartProcure API
```

### 12.2 Outbound Call Triggers

MVP priority events:
- major queue change
- recommended arrival time change
- critical center capacity
- center closure or disruption
- appointment reminder
- important “Should I Go Now?” alert
- procurement stage completion
- payment completion
- important booking changes

Do not call for every minor database update.

### 12.3 Queue Change Outbound Call

```text
Existing booking
      ↓
Queue changes significantly
      ↓
ETA recalculated
      ↓
Recommended arrival changes
      ↓
Notification rule triggered
      ↓
Outbound voice call
      ↓
Farmer hears updated recommendation
      ↓
Farmer confirms or declines
```

Example:

```text
“Namaskaram. This is SmartProcure.
The queue at your procurement center has increased.
Your recommended arrival time has changed to 11:30 AM.
Would you like to keep the updated appointment?”
```

If the farmer confirms, call the existing `rescheduleBooking()` operation.

### 12.4 Outbound Call Decision Engine

```text
Event occurs
   ↓
Is it important?
   ├── No → In-App notification
   |
   └── Yes
        ↓
Is voice enabled?
   ├── No → SMS / Push
   |
   └── Yes
        ↓
Is farmer reachable?
   ├── No → SMS fallback
   |
   └── Yes
        ↓
Place outbound call
```

### 12.5 Outbound Call Adapter

```text
OutboundCallService
        |
        +--> Mock Voice Provider
        +--> Telephony Provider
        +--> Future Approved Provider
```

For the SIH prototype, a mock outbound-call adapter is acceptable when real telephony integration is unavailable.

### 12.6 Outbound Call APIs

Suggested backend endpoints:

```text
POST /api/voice/calls
GET  /api/voice/calls/:id
POST /api/voice/calls/:id/respond
POST /api/voice/webhooks/inbound
POST /api/voice/webhooks/status
```

Telephony credentials must remain server-side.

### 12.7 Duplicate Call Prevention

Store delivery state such as:

```text
event_id
farmer_id
notification_type
attempt_count
last_attempt_at
delivery_status
```

Do not repeatedly call the same farmer for the same event.

### 12.8 Outbound Voice and Realtime

```text
Officer changes processing stage
              ↓
Database update
              ↓
Supabase Realtime
              ↓
Queue / ETA recalculation
              ↓
Recommendation changes
              ↓
NotificationService
              ↓
Outbound Voice Service
              ↓
Farmer receives call
```

### 12.9 Updated Notification Architecture

```text
                       NotificationService
                               |
        +----------+-----------+-----------+----------+
        |          |           |           |          |
      In-App      SMS         Push       Email      Voice
                                                     |
                                               Voice Agent
                                                     |
                                             Inbound / Outbound
```

The notification layer owns delivery. The Voice Agent owns conversation. Procurement modules own business decisions.

### 12.10 Voice Development Phases

Add after the core booking and queue flow is stable:

```text
Phase 29  Voice Agent backend module
Phase 30  Voice tool definitions
Phase 31  Voice inbound conversation
Phase 32  Voice smart recommendation
Phase 33  Voice booking + confirmation
Phase 34  Voice queue + “Should I Go Now?”
Phase 35  Voice procurement + payment status
Phase 36  Voice multilingual support
Phase 37  Outbound voice call service
Phase 38  Queue/ETA-triggered outbound calls
Phase 39  Voice fallback + error handling
Phase 40  Voice demo mode
Phase 41  End-to-end voice testing
```

Voice development must not delay the core farmer web flow.

### 12.11 SIH Voice Demo Mode

```text
Farmer opens Voice Assistant
        ↓
Mock incoming call
        ↓
Farmer gives crop + quantity + date
        ↓
Smart Recommendation
        ↓
Farmer confirms
        ↓
Booking + Token
        ↓
Live Queue
        ↓
Officer changes queue
        ↓
ETA changes
        ↓
Mock outbound call appears
        ↓
Farmer receives updated recommendation
        ↓
Farmer confirms
        ↓
Booking updated
```

The same transaction must appear in Farmer and Officer views.

### 12.12 Voice Testing Requirements

```text
✓ Farmer identification
✓ Intent detection
✓ Correct tool/API selection
✓ Booking confirmation
✓ No accidental booking
✓ Queue accuracy
✓ ETA accuracy
✓ “Should I Go Now?” accuracy
✓ Procurement status
✓ Payment status
✓ Language selection
✓ Call disconnect recovery
✓ API failure recovery
✓ Slot becoming unavailable
✓ Outbound trigger
✓ Duplicate-call prevention
✓ SMS fallback
✓ Audit logging
```

## 11. Smart Recommendation Engine

```text
Farmer Inputs
     |
     v
Crop + Quantity + Date + Location + Preference
     |
     v
Candidate Centers
     |
     v
Filter Ineligible Centers
     |
     +--> Closed?
     +--> Crop unsupported?
     +--> No capacity?
     +--> No suitable slot?
     |
     v
Calculate Scores
     |
     +--> Queue Score
     +--> Capacity Score
     +--> ETA Score
     +--> Distance Score
     +--> Preference Score
     |
     v
Rank Options
     |
     +--> Best Option
     +--> Alternative 1
     +--> Alternative 2
```

MVP formula:

```text
score =
    0.35 * queueScore
  + 0.30 * capacityScore
  + 0.20 * etaScore
  + 0.10 * distanceScore
  + 0.05 * preferenceScore
```

Lower score is better.

All weights must be configurable.

The engine must return an explanation.

---

## 12. "Should I Go Now?" Logic

Inputs:

- booking
- center status
- ETA
- queue
- capacity
- appointment
- processing rate

Logic:

```text
No booking
    ↓
BOOK A SLOT

Center closed
    ↓
DO NOT GO

Critical queue
    ↓
WAIT

ETA <= 30 minutes
    ↓
GO NOW

ETA <= 60 minutes
    ↓
PREPARE TO GO

Otherwise
    ↓
WAIT
```

Output:

- decision
- reason
- queue
- ETA
- recommended departure time

---

## 15. Queue Architecture

States:

```text
WAITING
ARRIVED
INSPECTION
GRADING
WEIGHING
VERIFICATION
COMPLETED
CANCELLED
```

MVP:

- seeded queue
- simulated movement
- officer updates stage
- farmer reflects updates

Production:

- database events
- realtime subscriptions

---

## 16. ETA Architecture

MVP:

```text
estimated_wait =
    farmers_ahead × average_processing_time
```

Improved:

```text
ETA =
    queue_workload / effective_processing_rate
```

Future:

```text
ML ETA =
    queue
    + crop
    + quantity
    + time
    + center
    + historical processing speed
```

Do not label the MVP formula as AI.

---

## 17. Procurement State Machine

```text
BOOKED
   |
   v
ARRIVED
   |
   v
INSPECTION
   |
   v
GRADING
   |
   v
WEIGHING
   |
   v
VERIFICATION
   |
   v
COMPLETED
   |
   v
PAYMENT
```

Each transition should record:

- timestamp
- actor
- previous state
- new state
- notes

---

## 18. Database Architecture

Core tables:

```text
users
farmer_profiles
procurement_centers
slots
bookings
queue_entries
procurements
procurement_events
payments
notifications
grievances
audit_logs
```

### users

```text
id
name
mobile
role
language
created_at
```

### farmer_profiles

```text
id
user_id
location
crops
verification_status
```

### procurement_centers

```text
id
name
latitude
longitude
daily_capacity
current_load
processing_rate
status
operating_hours
supported_crops
```

### slots

```text
id
center_id
date
start_time
end_time
capacity
booked_count
status
```

### bookings

```text
id
farmer_id
center_id
slot_id
crop
quantity
token
status
created_at
```

### queue_entries

```text
id
booking_id
position
estimated_wait
status
updated_at
```

### procurements

```text
id
booking_id
inspection_status
inspection_notes
grade
accepted_quantity
weighing_status
verification_status
status
```

### procurement_events

```text
id
procurement_id
stage
status
actor_id
notes
created_at
```

### payments

```text
id
procurement_id
gross_amount
deductions
net_amount
status
transaction_reference
created_at
```

### notifications

```text
id
user_id
type
title
message
read_status
created_at
```

### grievances

```text
id
farmer_id
booking_id
category
description
status
resolution
created_at
updated_at
```

### audit_logs

```text
id
actor_id
entity_type
entity_id
action
metadata
created_at
```

---

## 19. API Architecture

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Farmers

```text
GET /api/farmers/me
PUT /api/farmers/me
GET /api/farmers/me/history
```

### Centers

```text
GET /api/centers
GET /api/centers/:id
GET /api/centers/:id/capacity
GET /api/centers/:id/queue
```

### Slots

```text
GET  /api/slots
POST /api/slots/recommend
POST /api/slots/book
PUT  /api/slots/:id/reschedule
DELETE /api/slots/:id
```

### Queue

```text
GET /api/queue/:bookingId
GET /api/centers/:id/queue
POST /api/queue/:id/check-in
PUT /api/queue/:id/status
```

### Procurement

```text
GET /api/procurements/:id
PUT /api/procurements/:id/inspection
PUT /api/procurements/:id/grading
PUT /api/procurements/:id/weighing
PUT /api/procurements/:id/verification
```

### Payments

```text
GET /api/payments/:id
GET /api/farmers/me/payments
```

### Notifications

```text
GET /api/notifications
PUT /api/notifications/:id/read
```

### Grievances

```text
POST /api/grievances
GET /api/grievances
GET /api/grievances/:id
PUT /api/grievances/:id
```

---

## 20. Booking API Flow

```text
POST /slots/recommend
        |
        v
Smart Recommendation Engine
        |
        v
Candidate Centers
        |
        v
Capacity + Queue + ETA
        |
        v
Rank Slots
        |
        v
Recommendation + Alternatives
        |
        v
Farmer Confirms
        |
        v
POST /slots/book
        |
        v
Create Booking
        |
        v
Generate Token
        |
        v
Create Queue Entry
        |
        v
Create Notification
```

---

## 21. Realtime Architecture

```text
Officer Action
      |
      v
Backend / Database
      |
      v
Realtime Event
      |
      +------------+
      |            |
      v            v
Farmer UI      Officer UI
      |            |
      +-----+------+
            |
            v
      Updated State
```

Use realtime for:

- queue
- capacity
- booking
- procurement
- payment

Handle:

- disconnect
- reconnect
- stale data
- subscription cleanup

Display last-updated timestamps.

---

## 22. Notification Architecture

```text
NotificationService
       |
       +--> In-App
       +--> SMS
       +--> Push
       +--> Email
       +--> IVRS
```

MVP:

```text
NotificationService
       |
       +--> In-App
       +--> Mock SMS
```

Providers must remain replaceable.

---

## 23. Security Architecture

Authentication:

- Supabase Auth or equivalent.

Authorization:

```text
FARMER
OFFICER
ADMIN
```

Requirements:

- protected routes
- server-side authorization
- input validation
- rate limiting where appropriate
- HTTPS
- environment variables
- database security policies

Demo data must not contain real:

- Aadhaar numbers
- bank credentials
- payment credentials
- sensitive identity information

---

## 24. Error Architecture

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Slot is no longer available",
  "code": "SLOT_FULL"
}
```

Frontend must translate technical errors into useful human messages.

Example:

```text
This slot was just filled.
We found the next best available slot.
```

---

## 25. Rural Connectivity

### Online

Full web/PWA experience.

### Low bandwidth

- lightweight pages
- compressed assets
- small payloads
- limited unnecessary requests

### Future offline

- cached profile
- cached booking
- cached token
- queued non-critical actions
- synchronization when online

### Alternative channels

Critical information should support:

- SMS
- IVRS
- app notifications

---

## 26. Multilingual Architecture

Initial languages:

- English
- Hindi
- Telugu

Use:

```text
i18n/
├── en.json
├── hi.json
└── te.json
```

Important user-facing text must not be scattered as hard-coded strings.

---

## 27. UI Architecture

The UI should feel:

- trustworthy
- agricultural
- clean
- modern
- accessible
- government-ready

Farmer UI:

- mobile-first
- simple
- large touch targets
- clear actions
- low cognitive load

Officer UI:

- operational
- information-dense
- table/chart oriented
- responsive

Avoid:

- excessive gradients
- excessive glassmorphism
- unnecessary animations
- tiny text
- decorative dashboards with no operational value

---

## 28. Mock Data

Seed:

- 3 procurement centers
- multiple crops
- multiple farmers
- multiple slots
- 30–100 queue records
- procurement records
- payment records
- notifications
- grievances

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

Changing queue, capacity, or processing speed must visibly affect recommendations.

---

## 29. SIH Demo Mode

The demo must work without external government APIs.

Demo accounts:

```text
FARMER DEMO
OFFICER DEMO
```

Farmer demo:

```text
Login
→ Dashboard
→ Crop + Quantity
→ Smart Recommendation
→ Center + Time
→ Booking
→ Token
→ Live Queue
→ Should I Go Now?
→ Check-in
→ Procurement
→ Payment
```

Officer demo:

```text
Login
→ Dashboard
→ Expected Arrivals
→ Queue
→ Farmer
→ Inspection
→ Grading
→ Weighing
→ Verification
→ Completion
→ Payment
```

The same underlying transaction must appear in both views.

---

## 30. Development Phases

```text
Phase 0  Documentation + repository analysis
Phase 1  Project setup
Phase 2  Design system
Phase 3  Application shell + routing
Phase 4  Authentication
Phase 5  Farmer profile
Phase 6  Farmer dashboard
Phase 7  Center discovery
Phase 8  Slot booking
Phase 9  Smart recommendation
Phase 10 Booking confirmation
Phase 11 Live queue
Phase 12 Should I Go Now?
Phase 13 Procurement tracking
Phase 14 Payment
Phase 15 Notifications
Phase 16 Officer dashboard
Phase 17 Officer queue
Phase 18 Procurement processing
Phase 19 Capacity management
Phase 20 Analytics
Phase 21 Grievances
Phase 22 Multilingual + accessibility
Phase 23 Mobile + low connectivity
Phase 24 Backend integration
Phase 25 Realtime integration
Phase 26 Testing
Phase 27 SIH demo mode
Phase 28 Final polish + deployment
```

---

## 31. AI/Vibe-Coding Rules

Any AI coding agent must:

1. Read requirements before implementation.
2. Read architecture before creating modules.
3. Read design before creating UI.
4. Inspect existing code before changing it.
5. Avoid unnecessary rewrites.
6. Avoid unrelated changes.
7. Use reusable components.
8. Keep Farmer and Officer workflows separate.
9. Keep business logic separate from UI.
10. Keep integrations behind service adapters.
11. Use seeded demo data.
12. Explain every smart recommendation.
13. Never claim rule-based logic is ML.
14. Never expose secrets.
15. Keep the application responsive.
16. Support accessibility.
17. Keep important strings translation-ready.
18. Handle loading, empty, error and offline states.
19. Test every completed module.
20. Avoid unnecessary dependencies.
21. Avoid unnecessary microservices.
22. Do not casually change database fields.
23. Preserve the working end-to-end demo.
24. Document significant architecture changes.
25. Run and inspect the application before completing each task.
26. Voice Agent must use existing SmartProcure APIs.
27. Voice Agent must not duplicate business logic.
28. Require confirmation for booking, rescheduling and cancellation.
29. Never claim an action succeeded without backend confirmation.
30. Keep telephony behind replaceable adapters.
31. Never expose voice or telephony secrets in frontend code.
32. Prevent duplicate outbound calls for the same event.
33. Provide SMS/In-App fallback when voice delivery fails.
34. Keep voice sessions separate from core procurement transactions.
35. Keep English, Hindi and Telugu voice responses translation-ready.
36. Test voice flows using seeded demo data.


---

## 32. Module Completion Contract

Every module is complete only after:

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
Console checked
       ↓
TypeScript checked
       ↓
Build checked
       ↓
Existing workflow tested
       ↓
Module complete
```

---

## 33. Final Acceptance Test

### Farmer

```text
Login
→ Dashboard
→ Enter crop
→ Enter quantity
→ Find centers
→ Smart recommendation
→ Select slot
→ Confirm booking
→ Token
→ Live queue
→ Should I Go Now?
→ Check-in
→ Inspection
→ Grading
→ Weighing
→ Verification
→ Completion
→ Payment
→ Notification
```

### Officer

```text
Login
→ Dashboard
→ Expected arrivals
→ Queue
→ Check farmer
→ Inspection
→ Grading
→ Weighing
→ Verification
→ Completion
→ Payment status
```

### Shared transaction

```text
Farmer
    ↕
Booking
    ↕
Token
    ↕
Queue
    ↕
Procurement
    ↕
Payment
    ↕
Officer
```

---

## 34. Architecture Goal

Protect this path from scope creep:

```text
FARMER
  ↓
Crop + Quantity
  ↓
Smart Recommendation
  ↓
Best Center + Time
  ↓
Booking
  ↓
Token
  ↓
Live Queue
  ↓
"Should I Go Now?"
  ↓
Check-in
  ↓
Inspection
  ↓
Grading
  ↓
Weighing
  ↓
Verification
  ↓
Completed
  ↓
Payment
  ↓
Notification

        ↑
        |
OFFICER DASHBOARD
monitors and updates all stages
```

The prototype succeeds when a judge can understand the complete farmer journey in a few minutes and see that SmartProcure actively coordinates arrival rather than merely recording a booking.


---

## Architecture Change Summary — Version 3.0

Version 3.0 preserves the complete Version 2.0 architecture and adds:

1. **Voice Agent:** a conversational farmer access channel using the same SmartProcure APIs and Smart Coordination Engine as the web/PWA application.
2. **Outbound Voice Calling:** proactive voice notifications triggered by important queue, ETA, capacity, appointment, procurement, and payment events through NotificationService.

The source of truth remains shared booking, token, queue, procurement, and payment data across Farmer UI, Voice Agent, and Officer UI.
