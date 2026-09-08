
SIH26032
Ministry of Consumer Affairs, Food & Public Distribution
SmartProcure
UI/UX Design Specification
“Right Information. Less Waiting. Brighter Tomorrows.”

Reference demo — primary visual source for this specification

Document Notes
This specification is built directly from the attached SmartProcure demo reference (four key screens: Farmer Dashboard, Smart Slot Booking, Live Status / “Should I Go Now?”, and Procurement Officer Dashboard). All colors, type, spacing, and component patterns below are reverse-engineered from that reference to keep the design system consistent with what is already built, then extended only where a working prototype needs details the demo image does not show (e.g., form validation, empty/error states, exact spacing scale).
Throughout this document, items are marked as follows:
(from the reference demo) — directly observed in the reference image; keep as-is.
(recommended addition) — a practical addition needed for a working build, not shown in the demo image.

Table of Contents
1. Design Overview
2. Design System
3. Component Library
4. Screen Design Specifications
5. User Flows
6. Responsive Design
7. UX Interactions
8. Accessibility
9. Design Tokens
10. Developer Handoff
11. Figma-Style Page Structure
12. Final Output Notes
13. SIH Improvement Addendum — Additional Screens & Features

1. Design Overview
1.1 Design Objective
SmartProcure gives farmers a clear, real-time answer to two questions — “when is my slot?” and “should I go now?” — while giving procurement officers a live operational view of queue load, capacity, and crop intake across their center. The design objective is to replace informal, uncertain waiting (arriving early and queuing for hours) with a scheduled, data-driven, and transparent procurement experience for both sides of the transaction.
1.2 Target Users
1.3 User Experience Goals
Reduce uncertainty: every screen answers “what happens next” in the first glance (slot time, position, recommendation).
Reduce physical waiting time at centers by giving farmers an accurate “leave now” recommendation.
Keep the farmer flows to 2–3 taps for any core action (book, check status, confirm).
Give officers one dashboard that surfaces problems (overload, long queues) instead of requiring them to hunt for issues.
Build trust through a government-appropriate, calm visual tone — no gamification, no clutter, no ambiguity.
1.4 Design Principles
Clarity over density — one primary message per card (e.g., “Slot: 10:30 AM”, not a wall of text).
Status is always visible — color-coded badges and live indicators appear on every screen where state can change.
Recommendation-first — the system tells the farmer what to do (“GO NOW”) rather than only showing raw data and expecting interpretation.
Consistent left-rail navigation across all farmer and officer screens, so context never has to be relearned.
Progressive disclosure — advanced detail (analytics, full queue tables) lives on secondary screens, not the dashboard.
1.5 Overall Visual Style (from the reference demo)
The visual language observed in the reference demo is a clean, government-appropriate “agri-tech” style: a deep green identity color paired with generous white space, soft rounded cards, light green tints for confirmation/positive states, and a single warm accent (the farmer illustration and center photography) to keep the interface human rather than purely institutional. Iconography is simple line/duotone style inside soft circular badges. This style is preserved as-is in this specification.
1.6 Accessibility Considerations
Minimum 4.5:1 text contrast; status is always paired with an icon/label, never color alone.
Minimum 44×44px touch targets for all buttons and interactive icons on mobile.
Plain-language labels (“SHOULD I GO NOW?” rather than “Departure Advisory”) to suit varying digital literacy.
Language selector on every farmer screen (from the reference demo), defaulting to the farmer's saved preference.
All critical information (slot time, queue position, recommendation) is also deliverable via SMS for farmers without reliable data connectivity (from the reference demo — “SMS notification” note on Live Status screen).
1.7 Mobile-First / Responsive Approach
The reference demo is shown as a desktop web layout, but the primary farmer-facing user is on a phone. This specification treats the farmer screens (Dashboard, Book Slot, Live Status) as mobile-first: single-column stacked cards, bottom or collapsible navigation, and large primary actions. The Officer Dashboard is treated as desktop/tablet-first, since officers operate at a fixed counter, but remains usable on a tablet in the field. Full breakpoint behavior is defined in Section 6.

2. Design System
Colors, type, and spacing below are read directly from the reference demo and rounded to a structured, developer-usable scale. Where the demo does not show a state (e.g. an explicit error color), a value consistent with the existing palette is proposed (recommended addition).
2.1 Color Palette
Brand Greens (from the reference demo)
Backgrounds & Surfaces
Text Colors
Status Colors (from the reference demo — queue/status badges)
2.2 Typography
Primary Font: Inter (fallback: “Segoe UI”, Roboto, sans-serif) — matches the clean geometric sans used throughout the reference demo.
2.3 Spacing System (4px base scale, recommended)
2.4 Border & Radius (from the reference demo)
2.5 Shadows
2.6 Icons (from the reference demo)
Icons throughout the reference demo are simple line icons set inside soft, colored circular badges (calendar, people/queue, leaf/crop, truck, hourglass, location pin, bell, checkmark). Recommended icon set: Lucide or Feather (24px grid, 1.5–2px stroke) for parity with the existing style.
Navigation icons: 20px, single color (gray when inactive, Primary Green when active).
Card badge icons: 20–24px icon inside a 40px circular tint background matching the icon's semantic color (blue for queue, green for crop, amber for time).
Status icons always accompany a text label — never used as the sole indicator of state.

3. Component Library
Each component below follows the pattern: Purpose → Appearance → States → Interaction → Responsive behavior. Components are named to map directly onto React component names used in Section 10.
3.1 Navigation
Header (`AppHeader`)
Purpose: Global identity bar: logo, tagline, and (on farmer screens) language selector + notifications + profile.
Appearance: Full-width bar, white or light-tint background, logo left, contextual controls right (from the reference demo).
States: Default; Notification-badge-active (red dot on bell icon, per the reference demo).
Interaction: Bell icon opens notification panel; profile avatar opens account menu; language selector opens a dropdown.
Responsive: Desktop: full row. Mobile: collapses to logo + hamburger + bell; language selector moves into a side drawer.
Sidebar Navigation (`SideNav`)
Purpose: Primary section navigation for both Farmer and Officer portals.
Appearance: Fixed-width (~220px) white rail; active item has light-green background pill with dark-green icon+text (from the reference demo); inactive items are gray icon+text.
States: Default / Active / Hover.
Interaction: Click/tap navigates to the section; active state persists per route.
Responsive: Desktop/tablet: always visible. Mobile: replaced by bottom tab bar or slide-out drawer — see Mobile Navigation.
Mobile Navigation (`BottomTabBar`) — recommended
Purpose: Compact primary navigation for phones, replacing the sidebar below the tablet breakpoint.
Appearance: Fixed bottom bar, 4–5 icons with labels (Dashboard, Book Slot, Status, Notifications, Profile), active tab in Primary Green.
States: Default / Active / Badge (unread notification dot).
Interaction: Tap switches section instantly, no page reload feel (client-side route change).
Responsive: Only rendered below 600px width; hidden on tablet/desktop where SideNav is used.
3.2 Actions
Primary Button
Purpose: Main call-to-action per screen (e.g., “FIND BEST SLOT”, “CONFIRM SLOT”, “SHOULD I GO NOW?”).
Appearance: Solid Primary Green fill, white uppercase bold text, 8px radius, optional leading icon (from the reference demo).
States: Default / Hover (darken 8%) / Pressed / Disabled (40% opacity) / Loading (spinner replaces icon).
Interaction: Single tap/click triggers the primary action of the screen; disabled until required fields are valid.
Responsive: Full-width on mobile forms; auto-width with min 200px on desktop.
Secondary Button
Purpose: Alternative or lower-emphasis action alongside a primary button (e.g., “BOOK / CHANGE SLOT”).
Appearance: White fill, 1.5px Primary Green border, Primary Green text, same radius as primary (from the reference demo).
States: Default / Hover (light green tint fill) / Pressed / Disabled.
Interaction: Used for reversible or secondary actions; never used for destructive actions.
Responsive: Stacks below primary button on mobile; sits inline beside it on desktop.
Danger Button — recommended
Purpose: Destructive actions not shown in the demo but required for a working product: “Cancel Slot”.
Appearance: White fill, 1.5px Error Red border and text, or solid Error Red fill for high-emphasis confirms.
States: Default / Hover / Pressed / Disabled.
Interaction: Always paired with a confirmation dialog before the action completes (see Confirmation Dialog).
Responsive: Same sizing rules as Secondary Button.
3.3 Content Containers
Card
Purpose: Base container for all grouped information (My Slot, Queue Position, stat tiles, etc.).
Appearance: White surface, 12px radius, `shadow.card`, 16–24px internal padding, optional colored icon badge in the top-left (from the reference demo).
States: Default / Hover (for clickable cards, `shadow.cardHover`) / Selected (green border).
Interaction: Static info display by default; clickable cards navigate to a detail view.
Responsive: Grid of 3 on desktop → 2 on tablet → 1 (stacked) on mobile.
Status Card (Confirmation Banner)
Purpose: Communicates a positive, resolved state prominently (e.g., “Your slot is CONFIRMED”).
Appearance: Light-green tinted background, dark-green checkmark icon in a white/green circle, bold heading + supporting detail lines (from the reference demo).
States: Confirmed (green) / Pending (amber tint) / Cancelled (red tint) (recommended addition, for Pending/Cancelled).
Interaction: Non-interactive display; may include an inline action link (e.g., “View Details”).
Responsive: Stacks full-width above the fold on mobile.

3.4 Inputs
Input Field
Purpose: Text/number entry for forms (e.g., Estimated Quantity).
Appearance: White background, 1px light-gray border, 8px radius, label above field, placeholder text in Text Secondary (from the reference demo).
States: Default / Focus (green border) / Filled / Error (red border + helper text below) / Disabled.
Interaction: Standard text entry; numeric fields restrict to digits and show unit suffix (e.g., “Quintals”).
Responsive: Full width of parent container at all breakpoints.
Dropdown / Select
Purpose: Single-choice selection (Crop, Procurement Center) (from the reference demo).
Appearance: Same shell as Input Field with a chevron-down icon on the right; opens a list overlay on click.
States: Default / Focus / Open / Selected / Disabled.
Interaction: Tap/click opens option list; selecting an option closes it and fills the field.
Responsive: Opens as a bottom sheet on mobile, inline dropdown on desktop.
Date Picker
Purpose: Selecting the Preferred Date for booking (from the reference demo).
Appearance: Input-field shell with a calendar icon; opens a calendar overlay with the current date highlighted.
States: Default / Focus / Open / Selected / Disabled (past dates).
Interaction: Tap a date to select and close the calendar; disabled dates are visually muted and unclickable.
Responsive: Full-screen calendar sheet on mobile; inline popover on desktop.
Search Bar — recommended
Purpose: Officer-side search across the live queue table (by token or farmer name).
Appearance: Rounded input with a leading search icon, placed above the Live Queue table.
States: Default / Focus / Typing (live-filtering) / No results.
Interaction: Filters the table in real time as the officer types; clears with an × icon.
Responsive: Full width above the table on mobile; fixed max-width (320px) aligned right on desktop.

3.5 Status, Feedback & Data Display
Progress Stepper
Purpose: Shows booking progress across the 3-step flow: Enter Details → View Recommendation → Confirm Slot (from the reference demo).
Appearance: Numbered circles connected by a horizontal line; completed/current step filled dark green, future steps gray outline.
States: Upcoming / Current (filled + label bold) / Completed (filled + checkmark).
Interaction: Non-interactive on mobile (forward-only); desktop may allow clicking a completed step to go back.
Responsive: Labels hide below step circles on narrow screens, shown only on the current step.
Status Badge
Purpose: Compact state label — “CONFIRMED”, “Processing”, “Waiting” (from the reference demo).
Appearance: Pill shape, tinted background matching the semantic status color, bold small-caps text, small dot or icon.
States: Confirmed (green) / Waiting (amber) / Processing (green) / Cancelled (red) / Pending (gray).
Interaction: Non-interactive; purely informational.
Responsive: Same size at all breakpoints; may shrink to icon-only inside dense mobile tables.
Queue Indicator
Purpose: Visualizes the farmer's position relative to others ahead in line (from the reference demo — row of dots with “YOU” marker).
Appearance: Horizontal row of circles; filled circles represent farmers ahead, the current farmer's circle is enlarged and labeled “YOU”.
States: Ahead / Current (You) / Behind (if shown) / Called (about to be served).
Interaction: Updates live as the queue advances; a brief pulse animation marks movement.
Responsive: Scrollable horizontally on mobile if the queue count is large; full row on desktop.
Progress / Capacity Bar
Purpose: Shows center load as a percentage of capacity (from the reference demo — “Center Capacity 68% / Normal operation”).
Appearance: Horizontal rounded bar, filled proportionally in green/amber/red depending on load band, percentage label at the end.
States: Normal (<70%, green) / High (70–90%, amber) / Overloaded (>90%, red).
Interaction: Non-interactive; may link to a detail breakdown on click (officer view).
Responsive: Full width of its card at all breakpoints.
Alert / Recommendation Card
Purpose: Surfaces actionable insights to the officer — overload warnings and redirect suggestions (from the reference demo).
Appearance: Left color bar + tinted background (red for warning, green for suggestion), icon, short heading, one line of detail, one action button.
States: Warning / Suggestion / Info.
Interaction: Action button (“Manage Slots” / “Redirect Slots”) opens the relevant management screen.
Responsive: Stacks below stat cards on mobile; fixed right-hand column on desktop.
Toast Message — recommended
Purpose: Brief, non-blocking confirmation of an action (e.g., “Slot booked successfully”).
Appearance: Small rounded bar anchored bottom-center (mobile) or bottom-right (desktop), colored left edge matching status.
States: Success / Error / Info.
Interaction: Auto-dismisses after ~4 seconds; swipe-to-dismiss on mobile.
Responsive: Full width minus margin on mobile; fixed 320px width on desktop.
Loading State — recommended
Purpose: Communicates that data is being fetched (slot recommendation, queue refresh).
Appearance: Skeleton cards matching the shape of the content being loaded, or a centered spinner in Primary Green for full-page loads.
States: Skeleton (card-level) / Spinner (page-level) / Inline (button loading spinner).
Interaction: Purely visual; disables interaction with the affected area until resolved.
Responsive: Skeleton layout mirrors the responsive grid of the loaded content.
Empty State — recommended
Purpose: Shown when a list/table has no data (e.g., no notifications, no queue entries).
Appearance: Centered illustration or icon, one-line message, optional single action button.
States: Default only.
Interaction: Optional CTA (e.g., “Book your first slot”) routes to the relevant flow.
Responsive: Illustration scales down on mobile; message remains legible at all widths.
Error State — recommended
Purpose: Shown on failed data loads or network errors.
Appearance: Centered warning icon in red/amber tint, short plain-language message, “Retry” secondary button.
States: Network Error / Server Error / Not Found.
Interaction: “Retry” re-triggers the failed request; persistent failures surface a support contact hint.
Responsive: Same layout at all breakpoints, centered within the content area.
Confirmation Dialog — recommended
Purpose: Confirms high-impact actions (cancel a slot, redirect a large batch of farmers).
Appearance: Centered modal, white surface, `shadow.modal`, short title, one line of consequence text, Secondary (Cancel) + Primary/Danger (Confirm) buttons.
States: Default / Loading (on confirm) / Error.
Interaction: Backdrop click or Cancel dismisses without action; Confirm proceeds and shows a toast on completion.
Responsive: Full-screen sheet on mobile; centered fixed-width (400px) modal on desktop.
Table (`LiveQueueTable`)
Purpose: Row-based tabular data for the officer's live queue (from the reference demo — Token / Farmer Name / Crop / Quantity / Status / Action).
Appearance: White surface, light header row, zebra or divider rows, status column rendered as Status Badge, right-aligned Action column.
States: Default / Row hover / Sorted column / Empty (see Empty State).
Interaction: Column headers sortable by click; “View” action opens a farmer detail drawer.
Responsive: Desktop: full table. Mobile/tablet: converts to a stacked card list, one card per row (see Section 6).
Chart (Crop Distribution)
Purpose: Shows today's crop mix by proportion (from the reference demo — donut/pie chart with legend).
Appearance: Donut chart in brand-adjacent colors (blue, green, purple, gray) with a color-keyed legend and percentage labels.
States: Default / Segment hover (tooltip with exact quantity).
Interaction: Hover or tap a segment to highlight it and show exact value in a tooltip.
Responsive: Legend moves below the chart and stacks vertically on narrow screens.

4. Screen Design Specifications
Layouts below describe the desktop reference view plus the mobile-first restructuring farmers will actually use. Field-level detail supports both design recreation and API/data mapping. Unless marked “recommended,” every element listed reflects the reference demo directly.
4.1 Screen 1 — Farmer Dashboard
Layout
Left: fixed SideNav (Dashboard active).
Top: greeting header “Namaste, {farmer.name}!” with subtext, language selector, notification bell, profile chip.
Row of 3 summary cards: My Slot, Queue Position, Crop & Quantity.
Confirmation banner (status card) with procurement center photo and location pin badge.
Two primary actions side by side: “SHOULD I GO NOW?” (primary) and “BOOK / CHANGE SLOT” (secondary).
Latest Updates timeline (left) + motivational quote card (right).
Persistent farmer illustration + quote in the sidebar footer.
Components used
AppHeader, SideNav, Card ×3, Status Card, Primary Button, Secondary Button, Timeline (list of events), Quote Card, Image with location badge.
Data displayed (dynamic)
User interactions
Tap “SHOULD I GO NOW?” → navigates to Screen 3 (Live Status).
Tap “BOOK / CHANGE SLOT” → navigates to Screen 2 (Smart Slot Booking), pre-filled if a slot already exists.
Tap bell icon → opens notifications panel.
Tap language selector → switches UI language app-wide, persisted to profile.
Responsive design
Mobile: summary cards stack in a single column; confirmation banner image moves below the text; the two action buttons stack full-width, primary on top.
SideNav is replaced by the bottom tab bar; the quote/illustration footer is hidden on mobile to save space.

4.2 Screen 2 — Smart Slot Booking
Layout
Progress Stepper across the top: Enter Details → View Recommendation → Confirm Slot.
Left column: form — Crop (dropdown), Estimated Quantity (input, Quintals), Preferred Date (date picker), Select Procurement Center (dropdown), “FIND BEST SLOT” primary button.
Right column: Smart Recommendation panel — highlighted “Best Slot for You” card with date/time, Expected queue, Center load, Estimated waiting time, “CONFIRM SLOT” button, then a list of “Other Available Slots” with queue-level dot indicators.
Components used
Progress Stepper, Input Field, Dropdown, Date Picker, Primary Button, Recommendation Card (Card variant with star icon), Queue-level list rows with Status Badge dots.
Data displayed (dynamic)
Complete user flow
1. Farmer fills Crop, Estimated Quantity, Preferred Date, Procurement Center.
2. Taps “FIND BEST SLOT” → stepper advances to “View Recommendation”, right panel populates with the recommended slot and 2–3 alternates.
3. Farmer reviews queue level / center load / wait estimate, and may pick an alternate slot instead of the recommended one.
4. Taps “CONFIRM SLOT” → stepper advances to “Confirm Slot”, a confirmation toast appears, and the farmer is routed back to the Dashboard with the new slot reflected in the “My Slot” card.
Responsive design
Mobile: form and recommendation panel stack vertically (form first, recommendation appears below after “Find Best Slot”); stepper labels shrink to numbers only with the current step's label shown beneath.

4.3 Screen 3 — Live Status / “Should I Go Now?”
Layout
Left panel: Token number with CONFIRMED badge, current position (“#7”), “6 farmers ahead of you”, Queue Indicator visual, Estimated waiting time, then a key-value detail list (Procurement Center, Crop, Quantity, Your Slot).
Right panel: “Should I Go Now?” heading with a Live badge, a large green recommendation card (“YES, GO NOW!”), Recommended departure time, Current queue / Center load / Expected wait stats, a plain-language guidance line (“You should reach the center around 10:25 AM”), “VIEW CENTER LOCATION” secondary button, and an SMS-notification info note at the bottom.
Components used
Status Badge (CONFIRMED, Live), Queue Indicator, Alert/Recommendation Card (“YES, GO NOW!” variant), Secondary Button with icon, Info banner.
Data displayed (dynamic)
How real-time data changes the screen
Queue position and “farmers ahead” update live via polling or WebSocket; the Queue Indicator animates the “YOU” marker forward as farmers ahead are served.
Before the recommended window, the right panel shows a neutral “Not yet — check back later” state instead of “YES, GO NOW!” — a recommended state not shown in the reference demo.
Once the system determines it is time to leave, the panel switches to the green “YES, GO NOW!” state shown in the demo, and (per the SMS note) triggers an SMS to the farmer at the same moment.
If the farmer's position moves up unexpectedly fast (e.g., no-shows ahead), the departure time and estimate recompute and the card updates without requiring a manual refresh.
Responsive design
Mobile: right panel (“Should I Go Now?”) is shown first/on top since it is the most time-critical content, with the token/queue detail panel below it — a reordering from the desktop reference to prioritize the answer over the raw data.

4.4 Screen 4 — Procurement Officer Dashboard
Layout
Left: Officer Portal SideNav (Dashboard, Live Queue, Manage Slots, Farmers, Analytics, Notifications, Settings, Logout).
Top: “Welcome, Procurement Officer” + center name, date selector, profile avatar.
Row of 4 stat cards: Expected Today, Arrived, Processed, Waiting, each with a colored icon badge.
Center Capacity progress bar with “Normal operation” status, and a Crop Distribution donut chart with legend, shown side by side.
Live Queue table: Token, Farmer Name, Crop, Quantity, Status, Action.
Right column: Alerts & Recommendations — an overload warning card with “Manage Slots”, and a Smart Suggestion card with “Redirect Slots”.
Footer tagline: “Efficient Centers. Happier Farmers. Stronger India.”.
Components used
Stat Card ×4, Progress/Capacity Bar, Chart (donut), LiveQueueTable, Alert/Recommendation Card ×2, Search Bar (recommended above the table).
Data displayed (dynamic)
How officers monitor and manage the center
The 4 stat cards give an instant read of today's throughput without opening any sub-page.
The Capacity bar and Crop Distribution chart flag operational load and mix at a glance; a red/amber capacity state visually escalates before it becomes a real problem.
The Live Queue table lets an officer act row-by-row (“View” opens farmer/token detail, e.g. to mark as Processed).
Alerts & Recommendations proactively surface what the officer would otherwise have to notice manually — e.g., “Center 03 approaching capacity” — with a direct action button (“Manage Slots”) rather than requiring navigation to find the problem first.
“Smart Suggestion” (e.g., “Move 14 farmers to Center 04”) lets the officer redirect bulk bookings in one action via “Redirect Slots”, which opens a confirmation dialog before applying.
Responsive design
Tablet: stat cards wrap to a 2×2 grid; capacity bar and chart stack vertically; table remains scrollable.
Mobile (secondary use case for officers): stat cards become a horizontally scrollable row; the Live Queue table converts to stacked cards (Section 6); Alerts move above the table since they are highest priority.

5. User Flows
Each flow below maps a straight line from the farmer's or officer's intent to the outcome, matching the steps named in the brief. Branches (where the path can diverge) are called out as sub-steps.
Flow A — Booking a Slot
Farmer logs in and lands on the Dashboard.
Enters crop and estimated quantity.
Selects preferred date and procurement center.
Taps “Find Best Slot.”
Reviews the Smart Recommendation — slot, queue level, and wait estimate.
Optional: picks an alternate slot from “Other Available Slots” instead.
Taps “Confirm Slot.”
Receives a confirmation toast; the Dashboard's “My Slot” card updates immediately.
Flow B — Checking “Should I Go Now?”
Farmer opens the Dashboard and taps “Should I Go Now?”
Live Status screen loads with current queue position and farmers ahead.
The system evaluates timing:
Not yet time — a neutral “check back later” message is shown; the screen keeps polling.
Time to leave — the panel switches to “YES, GO NOW!” with a recommended departure time, and an SMS is sent.
Farmer taps “View Center Location.”
Farmer travels to the procurement center.
Flow C — Officer Managing an Overloaded Center
Officer logs in and lands on the Officer Dashboard.
Monitors center capacity and today's stat cards.
Center capacity crosses the warning threshold; an alert card appears (“Center 03 approaching capacity”).
Officer opens the Live Queue table for detail.
Taps “Manage Slots,” or accepts the Smart Suggestion via “Redirect Slots.”
Confirms the action in a dialog (e.g., “Move 14 farmers to Center 04?”).
Bookings are reassigned, affected farmers are notified, and the dashboard refreshes.

6. Responsive Design
Behavior by element
Sidebar: fixed with labels (desktop) → icon-only collapsed rail (tablet) → bottom tab bar (mobile).
Navigation: hover states (desktop) become tap states (touch); active indicators remain the same light-green pill pattern at every size.
Card stacking: 3–4 columns → 2 columns → 1 column, always preserving the same card order top-to-bottom as left-to-right.
Table conversion: the Live Queue table becomes a list of compact cards below tablet width — each card shows Token + Farmer Name as the title, Crop/Quantity as a subline, Status Badge top-right, and the Action button full-width at the bottom.
Charts: donut chart shrinks and its legend moves from side-by-side to stacked below the chart on tablet and mobile.
Buttons: full-width stacked on mobile (primary above secondary); inline auto-width on tablet/desktop.
Typography: H1 24px→20px, H2 18px→16px, Body stays 14px across all breakpoints for legibility; only headings and display numbers scale down.

7. UX Interactions

8. Accessibility

9. Design Tokens
Structured as a flat JSON-style reference for direct use in a Tailwind config or CSS variables file.

10. Developer Handoff
10.1 Naming Conventions
Components: PascalCase, matching Section 3 names — `AppHeader`, `SideNav`, `Card`, `StatusBadge`, `QueueIndicator`, `ProgressStepper`, `LiveQueueTable`, `AlertCard`, `ConfirmationDialog`.
Pages/Routes: kebab-case — `/dashboard`, `/book-slot`, `/live-status`, `/officer/dashboard`, `/officer/live-queue`, `/officer/manage-slots`.
10.2 Responsive Breakpoints (Tailwind-style)
10.3 CSS / Styling Structure
Tailwind CSS with the Section 9 tokens mapped into `tailwind.config.js` under `theme.extend.colors`, `theme.extend.spacing`, and `theme.extend.borderRadius`.
No component should hardcode a hex value or pixel spacing — always reference a token/utility class.
Shared layout primitives: `<PageShell>` (SideNav + content area), `<CardGrid cols={3|2|1}>` for responsive card rows.
10.4 Reusable Components
Build the component library in Section 3 as standalone, prop-driven components first (Card, StatusBadge, PrimaryButton, SecondaryButton, ProgressStepper, QueueIndicator, AlertCard, Table→CardList responsive wrapper).
Screens are then compositions of these components plus screen-specific layout — no screen should contain one-off styled buttons or cards.
10.5 API Data Per Component (summary)
Full per-screen data mapping is in Section 4; the table below summarizes ownership at the component level.
10.6 Recommended Frontend Architecture
Framework: React + Tailwind CSS, as specified.
State: server data via React Query (or SWR) for caching/polling of queue and recommendation data; local UI state (form values, dialog open/closed) via component state or a lightweight store (Zustand).
Real-time updates: WebSocket connection for queue position and “should I go now” status where available; fall back to short-interval polling (e.g., every 15–30s) for lower-connectivity environments.
Routing: React Router with two top-level layouts — `FarmerLayout` (SideNav/BottomTabBar) and `OfficerLayout` (Officer Portal SideNav).
i18n: a translation-key based library (e.g., i18next) to support the language selector without hardcoded strings.
Charts: a lightweight charting library (e.g., Recharts) for the donut chart and capacity bar.

11. Figma-Style Page Structure
Recommended top-level Figma pages, in order:
Cover
Design System
Colors
Typography
Spacing
Icons
Components
Farmer
Login, Dashboard, Book Slot, Live Status, Notifications
Officer
Login, Dashboard, Live Queue, Manage Slots, Analytics
Prototype Flows
Flow A — Booking a Slot, Flow B — Should I Go Now?, Flow C — Officer Manages Overload
Suggested frame dimensions
Frame organization notes
Each screen frame contains nested component instances from the Design System page — no detached/one-off shapes.
Farmer frames are built at the mobile size (390×844) first, with a desktop variant (1440×900) matching the reference demo layout for presentation purposes.
Officer frames are built desktop-first (1440×900) with a tablet variant (1024×768) for field use.
Interactive states (e.g., “Should I Go Now?” neutral vs. “GO NOW”, table row hover, loading skeletons) live as separate frames or component variants, not baked into the main screen frame.

12. Final Output Notes
This document, “SmartProcure — UI/UX Design Specification,” is intended to serve four audiences directly from a single source:
Designer: Sections 2, 3, and 11 give the full design system and file structure needed to recreate every screen in Figma.
Frontend developer: Sections 3, 6, 9, and 10 give component specs, responsive rules, tokens, and architecture guidance for a React + Tailwind implementation.
Backend developer: Section 4's per-screen data tables and Section 10.5 summarize exactly which fields and APIs each component needs.
SIH team / judges: Sections 1, 4, and 5 explain the concept, screen-by-screen behavior, and end-to-end user journeys in plain language for the final presentation.
Per the brief, the visual language, layout, and feature set of the reference demo have been preserved rather than redesigned. Items marked 'recommended' throughout this document are additions necessary for a functioning prototype (e.g., empty/error/loading states, an explicit spacing scale, a mobile bottom navigation) and are not changes to the demo's existing concept or features.

13. SIH Improvement Addendum — Additional Screens & Features
This addendum extends the specification above with screens and features requested for Smart India Hackathon (SIH) evaluation — farmer registration, payment tracking, a notifications screen, and several judge-facing innovation features (GPS travel time, offline/low-network support, QR token, emergency help, and dashboard refinements). Nothing in Sections 1–12 above has been changed; all items here are additive and follow the same design system (Section 2) and component patterns (Section 3) already defined.

13.1 Screen 5 — Farmer Registration & Login (new)
Layout
•  Centered single-column form on a light green tinted background (page.background), SmartProcure wordmark and tagline above the form.
•  Step 1 — Mobile Number Entry: mobile number input, “SEND OTP” primary button, language selector.
•  Step 2 — OTP Verification: 6-digit OTP input (auto-advancing boxes), countdown timer, “RESEND OTP” text link, “VERIFY” primary button.
•  Step 3 — Farmer Details: Full name, Aadhaar number (masked input, last 4 digits visible), Land details (land size in acres, land location/village, land ownership document upload), Bank account details (account number, IFSC code, bank name auto-lookup from IFSC), “SUBMIT” primary button.
•  Step 4 — Confirmation: success state showing the generated Farmer ID, “GO TO DASHBOARD” primary button.
•  A Progress Stepper (reused from Screen 2) tracks Mobile → OTP → Details → Confirmation across all four steps.
Components used
•  Progress Stepper, Input Field, OTP Input (recommended new component: 6 boxed single-digit inputs), Dropdown, File Upload (recommended new component), Primary Button, Secondary Button, Status Card (success variant).
Data displayed / captured
User interactions
•  Tap “SEND OTP” → validates 10-digit mobile number, calls sendOtp, advances stepper to OTP step.
•  Auto-focus moves between OTP digit boxes as the farmer types; “VERIFY” activates once all 6 digits are entered.
•  Tap “SUBMIT” on Farmer Details → validates Aadhaar format and required fields, calls the registration API, and generates the Farmer ID.
•  Returning users skip registration entirely: the same Mobile + OTP flow (Steps 1–2) is reused as the login flow for anyone with an existing Farmer ID.
Responsive design
•  Mobile (primary use case): full-width single-column form, OTP boxes remain fixed-width and centered, sticky primary button pinned above the keyboard.

13.2 Screen 6 — Payment Tracking (new)
Layout
•  Accessible from the Farmer Dashboard SideNav (“Payments”, recommended new nav item) and from the Officer Portal SideNav (“Payments”, officer-facing view across all farmers at their center).
•  Top summary row (farmer view): Total Procured This Season, Amount Credited, Amount Processing — three summary cards matching the existing Card component.
•  Payment Status table below the summary cards, sorted by most recent procurement first.
Components used
•  Card ×3 (summary), Search Bar, Status Badge (Processing / Credited / Failed), Table (LiveQueueTable pattern reused as PaymentStatusTable).
Data displayed (dynamic)
Table columns map to fields: procurement.id, procurement.date, procurement.crop, payment.amount, payment.status (Processing / Credited / Failed), payment.creditedDate, payment.transactionRef. Data source: Payment/Treasury API, linked to the farmer's bank details captured at registration (13.1).
Benefits
•  Farmers can see exactly when money is credited, without needing to call the procurement center.
•  Increases transparency and builds trust in the procurement process end-to-end.
•  Officer view gives a center-wide reconciliation list to spot delayed or failed payments.
User interactions
•  Tap a row → opens Payment Detail (transaction reference, bank account last 4 digits, credited date).
•  “Processing” rows show an estimated credit date; “Failed” rows (recommended state) surface a “RETRY” / “CONTACT SUPPORT” action.

13.3 Screen 7 — Notifications (new)
The SideNav already includes a Notifications entry (Sections 3.1, 4.4) but no screen design was specified for it. This closes that gap.
Layout
•  Full-height list screen, grouped by day (Today / Yesterday / Earlier), each row using the existing Card pattern with a left icon badge, message, and relative timestamp.
•  Unread notifications show a left accent bar in Primary Green and a filled icon badge; read notifications are visually muted (Text Secondary).
•  Top bar: “Mark all as read” text action, and a filter chip row (All / Slot / Payment / Center).
Notification types
Data displayed (dynamic)
•  notifications[]: {id, type, message, timestamp, read (bool), actionTarget} — Notifications/events API, same source already referenced for the Dashboard's Latest Updates timeline (Section 4.1).
User interactions
•  Tap a notification → deep-links to the relevant screen (Slot → Screen 3, Payment → Screen 6, Center change → Screen 1).
•  Swipe to dismiss (mobile, recommended); “Mark all as read” clears the unread accent across the list.

13.4 Additional Components & Feature Enhancements
GPS-Based Travel Time (enhancement to Screen 3)
•  Current spec (Section 4.3) shows a static Recommended departure time. Recommended addition: use the farmer's device location (with permission) plus a mapping service (e.g. Google Maps / OpenStreetMap routing) to calculate live travel time from the farmer's current location to the procurement center.
•  The “Should I Go Now?” recommendation card dynamically updates its guidance line to a specific, personalized instruction, e.g. “Leave in 18 minutes to arrive by 10:25 AM,” recomputed as traffic/distance conditions change.
•  New data field: farmer.currentLocation (lat/lng, permission-gated) → Routing/Directions API → travelTimeMinutes, feeding recommendation.departureTime alongside the existing queue-based estimate.
Offline / Low-Network Support
•  Many farmers have inconsistent connectivity. Recommended additions: an SMS-only mode (slot confirmation, queue position, and “go now” alerts delivered as plain SMS when the app is offline), an offline cache (last-known slot, queue position, and center details shown with a “Last updated X min ago” label when the device has no connection), and IVR phone support (a toll-free number farmers can call to hear their slot and queue status read aloud).
•  New global UI element: a persistent connectivity banner (recommended) that appears when the app detects it is offline, explaining that SMS updates will continue.
QR Code Token (enhancement to Screen 3)
•  Current spec shows a token number only. Recommended addition: display a QR code alongside the token number on the booking confirmation and Live Status screen, which the procurement center scans on arrival.
•  Benefits: faster entry, faster verification against the queue system, and less manual data entry for center staff.
•  New field: token.qrPayload (signed token containing token.id + booking.id), generated by the Booking API and rendered as a QR image client-side.
Emergency Contact / Help (new global component)
•  No emergency contact or help option currently exists in the spec. Recommended addition: a persistent Help button (floating action button on mobile, header icon on desktop) available from every farmer-facing screen.
•  Opens a Help sheet with three actions: “Call Procurement Center” (tel: link to center.phone), “Raise a Complaint” (short form: category + description, routed to a support/ticketing API), and “Support Chat” (recommended, could reuse the Toast/Alert patterns already defined for confirmation messaging).

13.5 Refinements to Existing Screens
Officer dashboard — Crop Distribution chart (Section 4.4)
•  Increase the donut chart's size relative to the stat cards above it so crop mix is legible at a glance.
•  Add hover/tap tooltips on each chart segment showing the exact percentage and crop name, rather than relying on the legend alone.
“Should I Go Now?” button prominence (Section 4.1)
•  This is the app's core value proposition and currently shares the same Primary Button styling as “Book / Change Slot.” Recommended: give “SHOULD I GO NOW?” a larger footprint (full-width or visually dominant sizing) and a distinct high-emphasis treatment (e.g. Primary Green fill with a subtle icon) so it reads as the primary action on the Farmer Dashboard, with “Book / Change Slot” remaining the Secondary Button style already defined in Section 3.2.
Emergency / help access
•  Addressed by the new global Help component in Section 13.4 above — available from every farmer-facing screen rather than being screen-specific.
Notifications screen
•  Addressed by the new Screen 7 (Section 13.3) above, giving the existing SideNav “Notifications” entry a destination.

13.6 Summary of Additions

As with the rest of this specification, items above are written to be additive: they extend the reference demo's concept for SIH evaluation without altering the screens, design system, or content already specified in Sections 1–12.

| User | Context of use | Primary needs |
| --- | --- | --- |
| Farmer | Mobile-first, often on a shared or budget smartphone, variable network quality, variable digital literacy, may prefer a regional language. | Know the slot time, know current queue position, know exactly when to leave home, get confirmation without confusion. |
| Procurement Officer | Desktop or tablet at the procurement center, used continuously through the day. | See today's load at a glance, spot overloaded centers early, manage/redirect slots quickly, track crop-wise intake. |
| Government / Administrative user | Desktop, periodic use for oversight and reporting. | Aggregate visibility across centers, exportable data, confidence that the system is transparent and auditable. |


| Color | Hex | Usage |
| --- | --- | --- |
| Dark Green (Primary Brand) | #1E5A3A | Header bars, sidebar active state text, screen title bars, footer tagline background |
| Primary Green | #2E8B57 | Primary buttons (“FIND BEST SLOT”, “CONFIRM SLOT”, “SHOULD I GO NOW?”), links, active nav icon |
| Light Green Tint | #E9F5EE | Confirmation banners, active nav background, positive info cards, page section backgrounds |
| Mint Accent | #D3EDDD | Card borders/dividers on light green surfaces, chip backgrounds |


| Color | Hex | Usage |
| --- | --- | --- |
| Page Background | #F5FAF7 | App canvas behind all cards (from the reference demo — subtle off-white/green wash) |
| Card / Surface White | #FFFFFF | All cards, tables, modals, inputs |
| Sidebar Background | #FFFFFF | Left navigation rail |
| Divider / Border | #E1EAE4 | Card borders, table row dividers, input borders |


| Color | Hex | Usage |
| --- | --- | --- |
| Text Primary | #1F2A24 | Headings, primary body copy, table data |
| Text Secondary | #5B6B63 | Helper text, timestamps, sub-labels, placeholder text |
| Text on Dark | #FFFFFF | Text on header bars, primary buttons, dark badges |
| Text Link / Accent | #2E8B57 | Interactive text links, “View” actions |


| Color | Hex | Usage |
| --- | --- | --- |
| Success / Confirmed / Low Queue | #2E8B57 | “CONFIRMED” badge, “Low queue” dot, “Processing” status, “GO NOW” panel |
| Warning / Medium Queue / Waiting | #F0A93C | “Medium queue” dot, “Waiting” status badge, capacity caution |
| Error / High Queue / Overload Alert | #E15B5B | “High queue” dot, “Center approaching capacity” alert card |
| Information | #3B82C4 | Informational banners (e.g. SMS notice), neutral data icon backgrounds |


| Style | Size / Line height | Weight | Usage |
| --- | --- | --- | --- |
| Display / Logo | 28px / 34px | Bold (700) | “SmartProcure” wordmark |
| H1 — Screen Title | 24px / 30px | Bold (700) | “1. Farmer Dashboard” style title-bar headings |
| H2 — Section Heading | 18px / 24px | SemiBold (600) | Card group titles: “Latest Updates”, “Smart Recommendation” |
| H3 — Card Title | 15px / 20px | SemiBold (600) | Card headers: “My Slot”, “Queue Position” |
| Body | 14px / 20px | Regular (400) | Paragraph text, form values |
| Body Bold / Data Value | 16–20px / 24px | Bold (700) | Key figures: “10:30 AM”, “#7”, “124” |
| Small / Caption | 12px / 16px | Regular (400) | Timestamps, helper text, table meta |
| Button Text | 14px / 20px | SemiBold (600), uppercase for primary actions | “SHOULD I GO NOW?”, “FIND BEST SLOT” (from the reference demo — buttons are uppercase) |


| Token | Value | Usage |
| --- | --- | --- |
| space.xs | 4px | Icon-to-label gap, tight inline spacing |
| space.sm | 8px | Inner padding between stacked text lines |
| space.md | 16px | Default card padding, gap between form fields |
| space.lg | 24px | Gap between cards in a grid, section padding |
| space.xl | 32px | Gap between major page sections |
| space.2xl | 48px | Page top/bottom margins, header height padding |


| Element | Radius | Border |
| --- | --- | --- |
| Cards | 12px | 1px solid #E1EAE4, no border on colored/tinted cards |
| Buttons (primary & secondary) | 8px | Secondary buttons: 1.5px solid Primary Green |
| Input fields / dropdowns | 8px | 1px solid #D8E2DC; focus state: 1.5px solid Primary Green |
| Badges / status pills | 999px (full pill) | None — filled with tinted status color |
| Avatars / profile circles | 999px (circle) | None |


| Token | Value | Usage |
| --- | --- | --- |
| shadow.card | 0 1px 3px rgba(16,40,26,0.08) | Default resting state for all cards |
| shadow.cardHover | 0 4px 12px rgba(16,40,26,0.12) | Hover/press state on clickable cards |
| shadow.modal | 0 12px 32px rgba(16,40,26,0.22) | Modals, confirmation dialogs, dropdown menus |


| Field | Source | Notes |
| --- | --- | --- |
| farmer.name, farmer.avatar | User profile API | Greeting + profile chip |
| slot.time, slot.date | Booking API | “My Slot” card |
| queue.position, queue.farmersAhead | Live queue API (polling/WebSocket) | “Queue Position” card, updates live |
| booking.crop, booking.quantity | Booking API | “Crop & Quantity” card |
| slot.status (confirmed/pending/cancelled) | Booking API | Drives Status Card color/copy |
| center.name, center.photoUrl, center.expectedArrival | Center directory API | Confirmation banner + image |
| updates[]: {label, timestamp} | Notifications/events API | Latest Updates timeline |


| Field | Source | Notes |
| --- | --- | --- |
| crops[] | Crop master list API | Populates Crop dropdown |
| centers[] | Center directory API | Populates Procurement Center dropdown |
| recommendation.slot, .queueLevel, .centerLoad, .waitEstimate | Recommendation engine API (input: crop, quantity, date, center) | Fills the “Best Slot for You” card after “Find Best Slot” |
| otherSlots[]: {timeRange, queueLevel} | Recommendation engine API | Populates the alternate slot list with color-coded queue dots |


| Field | Source | Notes |
| --- | --- | --- |
| token.id, token.status | Booking API | Token header + CONFIRMED badge |
| queue.position, queue.farmersAhead, queue.waitEstimate | Live queue API (real-time) | Position, Queue Indicator, wait time |
| recommendation.shouldGoNow (bool), .departureTime, .reachByTime | Recommendation engine API (real-time) | Drives the “YES, GO NOW!” vs. “Not yet” state of the right panel |
| center.currentQueue, center.load | Center live-stats API | Stat row under the recommendation card |
| center.name, .location (lat/lng) | Center directory API | “VIEW CENTER LOCATION” button target |


| Field | Source | Notes |
| --- | --- | --- |
| center.expectedToday, .arrived, .processed, .waiting | Center live-stats API | 4 stat cards |
| center.capacityPercent, .loadStatus | Center live-stats API | Capacity bar + “Normal operation” / “High” / “Overloaded” label |
| cropDistribution[]: {crop, percent} | Daily intake aggregation API | Donut chart + legend |
| queue[]: {token, farmerName, crop, quantity, status} | Live queue API (real-time) | Live Queue table rows |
| alerts[]: {type, message, actionLabel, actionTarget} | Recommendation/alerting engine API | Alerts & Recommendations cards |


| Breakpoint | Width | Layout behavior |
| --- | --- | --- |
| Desktop — Large | 1440px | Full 3-column dashboards, SideNav fixed at 220px, tables show all columns, charts full size. |
| Desktop — Standard | 1280px | Same structure as 1440px with tighter card padding and gutters; SideNav remains fixed. |
| Tablet | 768px | Card grids drop to 2 columns; SideNav collapses to icon-only rail (labels on tap/hover); tables scroll horizontally or convert to cards for the officer view; charts stack under stat cards. |
| Mobile — Standard | 390px | Single-column stacked cards; SideNav replaced by bottom tab bar; forms and recommendation panels stack vertically; tables always convert to a stacked card list. |
| Mobile — Small | 360px | Same as 390px with reduced padding (space.sm/md scale down by ~15%) and button labels shortened where needed (e.g., “CONFIRM” instead of “CONFIRM SLOT”) to avoid text wrapping. |


| Interaction | Behavior / micro-interaction |
| --- | --- |
| Booking a slot | Form validates inline as each field is completed; “FIND BEST SLOT” stays disabled until all fields are valid; button shows a brief inline spinner while the recommendation is fetched. |
| Changing a slot | “BOOK / CHANGE SLOT” reopens the booking flow pre-filled with current selections; changing and confirming replaces the prior slot after a confirmation dialog. |
| Confirming a slot | “CONFIRM SLOT” shows a short success animation (checkmark scale-in) on the recommendation card, then a toast, then redirects to the Dashboard within ~1.5s. |
| Cancelling a slot | Requires a Danger Button + Confirmation Dialog (“Are you sure? This will release your slot”) to prevent accidental loss of a booking. |
| Queue updates | Position number and Queue Indicator update with a subtle 200ms slide/fade rather than an abrupt jump, so the change is noticeable but not jarring. |
| Notifications | New notification increments a small red badge on the bell icon; opening the panel marks items read with a fade of the badge. |
| Smart recommendation | Recommendation panel populates with a brief skeleton-load state (300–600ms) before showing the “Best Slot for You” card, to make the “smart” calculation feel deliberate rather than instant/arbitrary. |
| “Should I Go Now?” | Transition from neutral to “YES, GO NOW!” is accompanied by a color transition (gray/blue → green) and, where permitted, a gentle notification sound/vibration on mobile. |
| Officer redirecting bookings | “Redirect Slots” opens a confirmation dialog listing exactly which farmers/bookings will move before committing; affected farmers receive an automatic notification. |
| Loading | Skeleton cards for dashboards/tables; inline button spinners for actions; never a full blank screen during a refresh. |
| Errors | Inline field-level errors in red with a short plain-language message; page-level errors use the Error State component with a Retry action. |
| Network failure | A persistent but unobtrusive banner (“You're offline — showing last saved data”) appears at the top; actions that require connectivity are disabled with a tooltip explaining why until the connection returns. |


| Consideration | Implementation |
| --- | --- |
| Large readable text | Body text no smaller than 14px; key figures (slot time, queue position) set at 18–24px bold. |
| High contrast | All text meets at least 4.5:1 contrast against its background; Primary Green on white and white on Dark Green both pass comfortably. |
| Simple language | Screen copy uses everyday phrasing (“SHOULD I GO NOW?”, “Your slot is CONFIRMED”) instead of technical or bureaucratic terms. |
| Clear icons + labels | Every icon is paired with a text label; icons are never the sole carrier of meaning. |
| Touch-friendly buttons | Minimum 44×44px tap targets on all mobile buttons and interactive icons, with at least 8px spacing between adjacent targets. |
| Minimal complicated navigation | A maximum of 5 primary destinations per portal (farmer / officer); no nested menus deeper than one level. |
| Screen reader considerations | Semantic headings (H1–H3) per section; status badges include an `aria-label` stating the status in words (e.g., “Status: Confirmed”); charts include a text-equivalent data table. |
| Keyboard navigation | All interactive elements are reachable via Tab in logical order; the booking stepper and dialogs trap focus appropriately and are dismissible via Escape. |
| Color not the only signal | Every colored status (queue level, capacity, badges) is paired with text and/or an icon shape (check, warning triangle, hourglass) so color-blind users are not dependent on hue alone. |
| Multilingual support | Language selector on every farmer screen (from the reference demo); all farmer-facing copy is stored as translation keys, not hard-coded strings, to support regional languages. |


| Token | Value |
| --- | --- |
| colors.primary | #2E8B57 |
| colors.primaryDark | #1E5A3A |
| colors.primaryTint | #E9F5EE |
| colors.success | #2E8B57 |
| colors.warning | #F0A93C |
| colors.error | #E15B5B |
| colors.info | #3B82C4 |
| colors.textPrimary | #1F2A24 |
| colors.textSecondary | #5B6B63 |
| colors.surface | #FFFFFF |
| colors.background | #F5FAF7 |
| colors.border | #E1EAE4 |
| spacing.xs | 4px |
| spacing.sm | 8px |
| spacing.md | 16px |
| spacing.lg | 24px |
| spacing.xl | 32px |
| spacing.2xl | 48px |
| radius.sm | 8px  (buttons, inputs) |
| radius.md | 12px  (cards) |
| radius.full | 999px  (badges, avatars) |
| font.heading | Inter, 600–700 weight |
| font.body | Inter, 400 weight |
| shadow.card | 0 1px 3px rgba(16,40,26,0.08) |
| shadow.modal | 0 12px 32px rgba(16,40,26,0.22) |
| breakpoint.mobileSmall | 360px |
| breakpoint.mobile | 390px |
| breakpoint.tablet | 768px |
| breakpoint.desktop | 1280px |
| breakpoint.desktopLarge | 1440px |


| Alias | Min-width |
| --- | --- |
| sm | 360px |
| md | 768px |
| lg | 1280px |
| xl | 1440px |


| Component | Data it needs | Static or Dynamic |
| --- | --- | --- |
| My Slot Card | slot.time, slot.date | Dynamic — booking API |
| Queue Position Card / QueueIndicator | queue.position, queue.farmersAhead | Dynamic — real-time (poll/WebSocket) |
| Smart Recommendation Card | recommendation.slot/.queueLevel/.centerLoad/.waitEstimate | Dynamic — recommendation engine API, computed on demand |
| Should-I-Go-Now Card | recommendation.shouldGoNow, .departureTime | Dynamic — real-time, recomputed as queue changes |
| Stat Cards (Officer) | center.expectedToday/.arrived/.processed/.waiting | Dynamic — refreshed periodically |
| Crop Distribution Chart | cropDistribution[] | Dynamic — daily aggregation, refreshed periodically |
| Live Queue Table | queue[] | Dynamic — real-time |
| Alerts & Recommendations | alerts[] | Dynamic — generated by an alerting/recommendation service |
| Nav labels, static copy, taglines | — | Static — translation files |


| Screen | Dimensions |
| --- | --- |
| Farmer — Login, Dashboard, Book Slot, Live Status, Notifications | 390 × 844 (mobile); 1440 × 900 (desktop variant) |
| Farmer — Recommendation state | Nested frame within Book Slot |
| Officer — Login, Dashboard, Live Queue, Manage Slots, Analytics | 1440 × 900 (desktop); 1024 × 768 (tablet variant) |


| Field | Source / Destination | Notes |
| --- | --- | --- |
| mobile.number | Registration API (sendOtp) | Triggers SMS OTP dispatch |
| otp.code | Registration API (verifyOtp) | 6-digit, time-limited (recommended: 5 min expiry) |
| farmer.name, aadhaar.number | Registration API + Aadhaar verification service (eKYC) | Aadhaar is verified, not stored in plaintext; only a verification status flag is persisted |
| land.sizeAcres, land.village, land.documentUrl | Registration API | Populates Land Details step; document upload stored via file service |
| bank.accountNumber, bank.ifsc, bank.bankName | Registration API + IFSC lookup service | Used later by the Payment Tracking screen (13.2) to credit procurement payments |
| farmer.id (generated) | Registration API response | Shown on the Confirmation step; used as the farmer's permanent login ID going forward |


| Procurement ID | Amount | Status |
| --- | --- | --- |
| PR001 | ₹84,500 | Processing |
| PR002 | ₹56,000 | Credited |


| Type | Example message | Icon / color |
| --- | --- | --- |
| Slot confirmed | Your slot for 24 Sep, 10:30 AM at Center 03 is confirmed. | Calendar / Success green |
| Queue updated | You have moved up to position #4 in the queue. | Queue / Primary green |
| Payment credited | ₹56,000 has been credited for Procurement PR002. | Rupee / Success green |
| Center changed | Your procurement center has been changed to Center 04. | Location pin / Warning amber |


| # | Addition | Type | Section |
| --- | --- | --- | --- |
| 1 | Farmer Registration & Login (Aadhaar, OTP, Farmer ID, land & bank details) | New screen | 13.1 |
| 2 | Payment Tracking screen | New screen | 13.2 |
| 3 | Notifications screen | New screen | 13.3 |
| 4 | GPS-based dynamic travel time on “Should I Go Now?” | Enhancement | 13.4 |
| 5 | Offline / SMS / IVR support | New capability | 13.4 |
| 6 | QR code token | Enhancement | 13.4 |
| 7 | Emergency contact / help button | New global component | 13.4 |
| 8 | Larger crop distribution chart with hover % | Refinement | 13.5 |
| 9 | More prominent “Should I Go Now?” button | Refinement | 13.5 |
