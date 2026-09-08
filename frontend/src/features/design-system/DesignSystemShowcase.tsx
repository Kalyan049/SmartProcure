import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  Toast,
  Card,
  KpiCard,
  QueueCard,
  RecommendationCard,
  TokenCard,
  AlertCard,
  NotificationItem,
  StatusBadge,
  CapacityMeter,
  ProgressBar,
  Timeline,
  TimelineStep,
  DataTable,
  ColumnDef,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from '@/components';
import {
  Users,
  Clock,
  TrendingUp,
  Package,
  Calendar,
  Layers,
  Smartphone,
  Monitor,
  CheckCircle,
  HelpCircle,
  Wheat,
} from 'lucide-react';

interface MockOfficerQueueRow {
  token: string;
  farmer: string;
  crop: string;
  quantity: string;
  appointment: string;
  status: string;
  waitTime: string;
  priority: string;
}

export const DesignSystemShowcase: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  } | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [sampleCapacity, setSampleCapacity] = useState(45);

  // Mock table data
  const mockTableData: MockOfficerQueueRow[] = [
    {
      token: 'SP-1042',
      farmer: 'Ramesh Kumar',
      crop: 'Wheat (Sharbati)',
      quantity: '45 qtl',
      appointment: '10:00 AM',
      status: 'COMPLETED',
      waitTime: '20 min',
      priority: 'Normal',
    },
    {
      token: 'SP-1045',
      farmer: 'Sunita Devi',
      crop: 'Paddy (Basmati)',
      quantity: '30 qtl',
      appointment: '10:20 AM',
      status: 'WEIGHING',
      waitTime: '15 min',
      priority: 'High',
    },
    {
      token: 'SP-1047',
      farmer: 'Harpreet Singh',
      crop: 'Wheat',
      quantity: '55 qtl',
      appointment: '10:40 AM',
      status: 'INSPECTION',
      waitTime: '35 min',
      priority: 'Normal',
    },
    {
      token: 'SP-1049',
      farmer: 'Baldev Prasad',
      crop: 'Gram',
      quantity: '25 qtl',
      appointment: '11:00 AM',
      status: 'WAITING',
      waitTime: '50 min',
      priority: 'Normal',
    },
  ];

  const tableColumns: ColumnDef<MockOfficerQueueRow>[] = [
    {
      key: 'token',
      header: 'Token',
      render: (row) => (
        <span className="font-mono font-bold text-brand-primary">{row.token}</span>
      ),
    },
    {
      key: 'farmer',
      header: 'Farmer Name',
      render: (row) => <span className="font-medium text-text-primary">{row.farmer}</span>,
    },
    {
      key: 'crop',
      header: 'Crop',
      render: (row) => <span className="text-text-secondary">{row.crop}</span>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => <span className="font-semibold tabular-nums">{row.quantity}</span>,
    },
    {
      key: 'appointment',
      header: 'Slot Time',
      render: (row) => <span className="tabular-nums text-text-secondary">{row.appointment}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
    {
      key: 'waitTime',
      header: 'Wait',
      render: (row) => <span className="tabular-nums text-text-muted">{row.waitTime}</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      render: () => (
        <Button size="sm" variant="secondary">
          Update
        </Button>
      ),
    },
  ];

  const sampleTimelineSteps: TimelineStep[] = [
    {
      id: '1',
      label: 'Booked Online',
      state: 'completed',
      timestamp: 'Today, 08:30 AM',
      description: 'Slot SP-1047 confirmed for Center B.',
    },
    {
      id: '2',
      label: 'Arrived at Gate',
      state: 'completed',
      timestamp: 'Today, 10:28 AM',
      description: 'Vehicle verified at check-in barrier.',
    },
    {
      id: '3',
      label: 'Quality Inspection',
      state: 'completed',
      timestamp: 'Today, 10:35 AM',
      description: 'Moisture content: 11.8% (standard limit: 12%). Approved.',
      details: { moisture: '11.8%', grade: 'Grade A', officer: 'S. Rawat' },
    },
    {
      id: '4',
      label: 'Grading & Sorting',
      state: 'current',
      timestamp: 'In Progress (Started 10:42 AM)',
      description: 'Separating crop lots into government standardized silos.',
      details: { lotNumber: 'LOT-992', targetSilo: 'Silo 4' },
    },
    {
      id: '5',
      label: 'Weighbridge Weighing',
      state: 'upcoming',
      description: 'Gross and tare vehicle weight determination.',
    },
    {
      id: '6',
      label: 'Officer Verification',
      state: 'upcoming',
      description: 'Final signoff and acceptance certification.',
    },
    {
      id: '7',
      label: 'Procurement Completed',
      state: 'upcoming',
      description: 'Warehouse receipt generation.',
    },
    {
      id: '8',
      label: 'Payment Initiation',
      state: 'upcoming',
      description: 'Direct Benefit Transfer (DBT) credit to bank account.',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-page text-text-primary p-4 sm:p-8">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto mb-8 bg-white border border-surface-border rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-brand-tint text-brand-primary border border-brand-mint">
              Module 2
            </span>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              SmartProcure Design System
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Official implementation of{' '}
            <strong className="text-brand-primary">DESIGN_STYLE.md</strong> — reusable UI
            components for Farmer and Officer experiences.
          </p>
        </div>

        {/* Viewport toggle for testing mobile responsiveness */}
        <div className="flex items-center gap-2 bg-surface-page p-1 rounded-sm border border-surface-border self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setIsMobileView(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              !isMobileView
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Desktop View</span>
          </button>
          <button
            onClick={() => setIsMobileView(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
              isMobileView
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile View (390px)</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`mx-auto transition-all duration-300 ${
          isMobileView
            ? 'max-w-[420px] bg-white border-2 border-brand-primary/30 rounded-2xl shadow-xl p-4 my-4'
            : 'max-w-6xl'
        }`}
      >
        {isMobileView && (
          <div className="text-center py-1.5 mb-4 bg-brand-tint rounded text-[11px] font-bold text-brand-primary border border-brand-mint">
            Farmer Mobile Viewport Simulator (390px)
          </div>
        )}

        <div className="space-y-12">
          {/* 1. Brand Colors & Design Tokens */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                1. Colors & Design Tokens
              </h2>
              <p className="text-xs text-text-muted">
                Section 4: Restrained agricultural & government-inspired palette
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#166534] mb-2" />
                <span className="text-xs font-bold block text-text-primary">Deep Green</span>
                <span className="text-[11px] font-mono text-text-muted">#166534</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Primary brand & CTA
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#22C55E] mb-2" />
                <span className="text-xs font-bold block text-text-primary">Fresh Green</span>
                <span className="text-[11px] font-mono text-text-muted">#22C55E</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Healthy / Progress
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#F59E0B] mb-2" />
                <span className="text-xs font-bold block text-text-primary">Warm Amber</span>
                <span className="text-[11px] font-mono text-text-muted">#F59E0B</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Warnings / Pending
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#DC2626] mb-2" />
                <span className="text-xs font-bold block text-text-primary">Critical Red</span>
                <span className="text-[11px] font-mono text-text-muted">#DC2626</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Errors / Critical load
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#2563EB] mb-2" />
                <span className="text-xs font-bold block text-text-primary">Info Blue</span>
                <span className="text-[11px] font-mono text-text-muted">#2563EB</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Information / Links
                </span>
              </div>

              <div className="p-3 bg-white rounded border border-surface-border shadow-sm">
                <div className="h-12 rounded bg-[#F8FAFC] border border-surface-border mb-2" />
                <span className="text-xs font-bold block text-text-primary">Surface Page</span>
                <span className="text-[11px] font-mono text-text-muted">#F8FAFC</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">
                  Neutral background
                </span>
              </div>
            </div>
          </section>

          {/* 2. Typography Hierarchy */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                2. Typography & Operational Numbers
              </h2>
              <p className="text-xs text-text-muted">
                Section 6: Clean Inter font with high-contrast hierarchy and readable numbers
              </p>
            </div>

            <div className="bg-white p-5 rounded-md border border-surface-border shadow-card space-y-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-text-muted block">
                  Display (32–40px, font-bold)
                </span>
                <div className="text-3xl sm:text-4xl font-bold text-text-primary">
                  Smart Capacity Coordination
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-text-muted block">
                  Page Heading (24–32px, font-bold)
                </span>
                <div className="text-2xl font-bold text-text-primary">
                  Arrival Slot Recommendation
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-text-muted block">
                  Section Heading (18–22px, font-semibold)
                </span>
                <div className="text-lg font-semibold text-text-primary">
                  Center B Live Queue Status
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-text-muted block">
                  Card Heading (16–18px, font-semibold)
                </span>
                <div className="text-base font-semibold text-text-primary">
                  Farmer Verification & Grading
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-text-muted block">
                  Large Operational Numbers (tabular-nums font-mono/bold)
                </span>
                <div className="flex flex-wrap items-baseline gap-6 mt-1">
                  <div>
                    <span className="text-3xl font-extrabold text-brand-primary tabular-nums font-mono">
                      SP-1047
                    </span>
                    <span className="text-xs text-text-muted block">Token ID</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-text-primary tabular-nums">
                      35 min
                    </span>
                    <span className="text-xs text-text-muted block">Estimated Wait</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-text-primary tabular-nums">
                      ₹88,000
                    </span>
                    <span className="text-xs text-text-muted block">Net Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Buttons & Controls */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                3. Buttons & Touch Targets
              </h2>
              <p className="text-xs text-text-muted">
                Section 36 & 12.1: Action-oriented labels, touch targets &gt;= 44px
              </p>
            </div>

            <div className="bg-white p-5 rounded-md border border-surface-border shadow-card space-y-5">
              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-2">
                  Variants
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Confirm Booking</Button>
                  <Button variant="secondary">View Details</Button>
                  <Button variant="danger">Cancel Booking</Button>
                  <Button variant="outline">See Alternatives</Button>
                  <Button variant="ghost">Dismiss</Button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-2">
                  Sizes & Touch Targets (sm: 36px, md: 44px, lg: 48px)
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (36px)</Button>
                  <Button size="md">Medium / Farmer (44px)</Button>
                  <Button size="lg">Large Dominant (48px)</Button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-2">
                  States
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button isLoading>Processing...</Button>
                  <Button disabled>Disabled Action</Button>
                  <Button leftIcon={<CheckCircle className="w-4 h-4" />}>
                    With Left Icon
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveToast({
                        type: 'success',
                        message: 'Button clicked! Design system is interactive.',
                      });
                    }}
                  >
                    Test Toast Trigger
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Open Test Modal
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Form Controls */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                4. Form Controls & Units
              </h2>
              <p className="text-xs text-text-muted">
                Section 35: Clear labels, explicit units (e.g. quintals), inline validation
              </p>
            </div>

            <div className="bg-white p-5 rounded-md border border-surface-border shadow-card grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Produce Quantity"
                isRequired
                defaultValue="40"
                unitSuffix="quintals"
                helperText="Estimated yield to be procured"
              />

              <Select
                label="Crop Type"
                isRequired
                options={[
                  { value: 'wheat', label: 'Wheat (Grade A)' },
                  { value: 'paddy', label: 'Paddy (Basmati)' },
                  { value: 'gram', label: 'Gram (Chana)' },
                ]}
                defaultValue="wheat"
              />

              <Input
                label="Farmer Contact Number"
                defaultValue="9876543210"
                error="Invalid mobile number format"
              />

              <div className="col-span-1 md:col-span-3">
                <Textarea
                  label="Grievance / Operational Feedback"
                  placeholder="Describe your issue or delay at the center..."
                  rows={3}
                  helperText="Submitted directly to the Procurement Grievance Officer"
                />
              </div>
            </div>
          </section>

          {/* 5. Status Badges & Capacity Visualizations */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                5. Status Badges & Capacity Meter
              </h2>
              <p className="text-xs text-text-muted">
                Sections 23 & 24: Standard status badges and 4-tier capacity thresholds
              </p>
            </div>

            <div className="bg-white p-5 rounded-md border border-surface-border shadow-card space-y-6">
              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-3">
                  Complete Status Badges (Color + Text + Icon)
                </span>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="OPEN" />
                  <StatusBadge status="NORMAL" />
                  <StatusBadge status="COMPLETED" />
                  <StatusBadge status="PAID" />
                  <StatusBadge status="WAITING" />
                  <StatusBadge status="BUSY" />
                  <StatusBadge status="ARRIVED" />
                  <StatusBadge status="INSPECTION" />
                  <StatusBadge status="GRADING" />
                  <StatusBadge status="WEIGHING" />
                  <StatusBadge status="HIGH" />
                  <StatusBadge status="CLOSED" />
                  <StatusBadge status="CRITICAL" />
                  <StatusBadge status="FAILED" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-text-muted uppercase">
                    Interactive 4-Tier Capacity Meter
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span>Adjust:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sampleCapacity}
                      onChange={(e) => setSampleCapacity(Number(e.target.value))}
                      className="cursor-pointer"
                    />
                    <span className="font-bold tabular-nums w-8">{sampleCapacity}%</span>
                  </div>
                </div>

                <div className="space-y-3 p-4 bg-surface-page rounded border border-surface-border">
                  <CapacityMeter
                    percent={sampleCapacity}
                    centerName="Center B (Primary Mandi)"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-text-muted border-t border-surface-border">
                    <div>0–60%: <strong>NORMAL</strong> (Green)</div>
                    <div>60–80%: <strong>BUSY</strong> (Amber)</div>
                    <div>80–90%: <strong>HIGH</strong> (Amber-Red)</div>
                    <div>90%+: <strong>CRITICAL</strong> (Red)</div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-text-muted uppercase block mb-2">
                  Accessible Progress Bar
                </span>
                <ProgressBar value={72} label="Procurement Target Progress" />
              </div>
            </div>
          </section>

          {/* 6. Signature Component: Recommendation Card */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-brand-tint text-brand-primary text-xs font-bold border border-brand-mint">
                  Signature Component
                </span>
                <h2 className="text-lg font-bold text-text-primary">
                  6. Smart Recommendation Card
                </h2>
              </div>
              <p className="text-xs text-text-muted">
                Section 16: Explainable automation with queue, capacity, ETA, and alternative options
              </p>
            </div>

            <RecommendationCard
              centerName="Procurement Center B — Malwa North"
              slotTime="10:40 AM"
              estimatedWaitMinutes={35}
              queueLength={32}
              capacityPercent={45}
              distanceKm={2.4}
              recommendationReason="Lower current queue length (32 farmers vs 85 at Center A) and healthy capacity (45%) make this the fastest procurement option."
              onSelect={() => {
                setActiveToast({
                  type: 'success',
                  message: 'Slot selected for Center B at 10:40 AM',
                });
              }}
              alternatives={[
                {
                  id: 'alt-1',
                  name: 'Center C — Grain Terminal',
                  slotTime: '11:15 AM',
                  waitMinutes: 42,
                  distanceKm: 4.1,
                  queueLength: 18,
                  capacityPercent: 30,
                },
              ]}
              onSelectAlternative={(alt) => {
                setActiveToast({
                  type: 'info',
                  message: `Alternative selected: ${alt.name}`,
                });
              }}
            />
          </section>

          {/* 7. Signature Component: Token Card & Guidance */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-brand-tint text-brand-primary text-xs font-bold border border-brand-mint">
                  Signature Component
                </span>
                <h2 className="text-lg font-bold text-text-primary">
                  7. Token Card & "Should I Go Now?"
                </h2>
              </div>
              <p className="text-xs text-text-muted">
                Section 18 & 20: Large readable token typography with actionable arrival guidance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TokenCard
                tokenNumber="SP-1047"
                centerName="Center B — Malwa North"
                appointmentTime="Today, 10:40 AM"
                queuePosition={12}
                farmersAhead={11}
                estimatedWaitMinutes={35}
                shouldIGoState="PREPARE_TO_GO"
                shouldIGoReason="Your turn is approaching in ~35 minutes. Prepare to leave."
                onAction={() => {
                  setActiveToast({
                    type: 'info',
                    message: 'Navigating to live queue status...',
                  });
                }}
              />

              <TokenCard
                tokenNumber="SP-1042"
                centerName="Center B — Malwa North"
                appointmentTime="Today, 10:00 AM"
                queuePosition={2}
                farmersAhead={1}
                estimatedWaitMinutes={10}
                shouldIGoState="GO_NOW"
                shouldIGoReason="Queue is moving smoothly. Depart immediately to gate."
                actionLabel="View Directions to Gate"
                onAction={() => {
                  setActiveToast({
                    type: 'success',
                    message: 'Opening directions map...',
                  });
                }}
              />
            </div>
          </section>

          {/* 8. Live Queue Card */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                8. Live Queue Card
              </h2>
              <p className="text-xs text-text-muted">
                Section 19: Clear queue standing, farmers ahead, ETA, and processing rate
              </p>
            </div>

            <QueueCard
              tokenNumber="SP-1047"
              currentToken="SP-1035"
              position={12}
              farmersAhead={11}
              estimatedWaitMinutes={35}
              centerName="Procurement Center B"
              centerCapacityPercent={45}
              processingRateMinutes={6}
              lastUpdatedText="Updated 2 minutes ago"
              onRefresh={() => {
                setActiveToast({
                  type: 'info',
                  message: 'Queue refreshed with latest real-time events.',
                });
              }}
            />
          </section>

          {/* 9. Operational KPI Cards */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                9. Officer KPI Cards
              </h2>
              <p className="text-xs text-text-muted">
                Section 14.2 & 41: Operational numbers, scannable units, trend indications
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <KpiCard
                title="Expected Arrivals"
                value="142"
                unit="farmers"
                icon={<Users className="w-5 h-5" />}
                iconColor="green"
                trend={{ direction: 'up', value: '+12%', isPositive: true }}
                subtitle="Today's total bookings"
              />

              <KpiCard
                title="Current Queue"
                value="32"
                unit="waiting"
                icon={<Clock className="w-5 h-5" />}
                iconColor="amber"
                trend={{ direction: 'down', value: '-4', isPositive: true }}
                subtitle="Avg wait: 35 min"
              />

              <KpiCard
                title="Procured Today"
                value="1,840"
                unit="quintals"
                icon={<Wheat className="w-5 h-5" />}
                iconColor="blue"
                trend={{ direction: 'up', value: '82%', label: 'of daily target' }}
              />

              <KpiCard
                title="Center Load"
                value="45%"
                icon={<Layers className="w-5 h-5" />}
                iconColor="green"
                subtitle="Normal operation"
                badge={<StatusBadge status="NORMAL" size="sm" />}
              />
            </div>
          </section>

          {/* 10. Procurement Vertical Timeline */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                10. Vertical Procurement Timeline
              </h2>
              <p className="text-xs text-text-muted">
                Section 21: Complete 8-stage lifecycle from Booking to Payment Initiation
              </p>
            </div>

            <div className="bg-white p-5 rounded-md border border-surface-border shadow-card">
              <Timeline steps={sampleTimelineSteps} />
            </div>
          </section>

          {/* 11. Alerts & Notifications */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                11. Operational Alerts & Notifications
              </h2>
              <p className="text-xs text-text-muted">
                Section 26 & 27: Operational consequences alerts and concise notification cards
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AlertCard
                  type="warning"
                  title="Queue Surge Alert"
                  message="Arrival velocity at Center B has increased by 30%. Estimated wait is now ~45 minutes."
                  actionLabel="Reroute Queue"
                  onAction={() =>
                    setActiveToast({
                      type: 'warning',
                      message: 'Rerouting recommendation triggered.',
                    })
                  }
                />

                <AlertCard
                  type="critical"
                  title="Center A Near Capacity"
                  message="Center A has reached 92% storage threshold. Directing incoming bookings to Center B."
                  actionLabel="Acknowledge"
                  onAction={() =>
                    setActiveToast({
                      type: 'error',
                      message: 'Critical alert acknowledged.',
                    })
                  }
                />
              </div>

              <div className="bg-white p-4 rounded-md border border-surface-border shadow-card space-y-2.5">
                <h3 className="text-xs font-semibold uppercase text-text-muted tracking-wider mb-2">
                  Recent Notifications
                </h3>
                <NotificationItem
                  id="notif-1"
                  type="booking"
                  title="Booking Confirmed"
                  message="Your slot at Center B is confirmed for 10:40 AM with Token SP-1047."
                  timestamp="10 min ago"
                  isRead={false}
                />
                <NotificationItem
                  id="notif-2"
                  type="payment"
                  title="Payment Credited"
                  message="Direct Benefit Transfer of ₹88,000 initiated for 38.5 qtl Wheat."
                  timestamp="2 hours ago"
                  isRead={true}
                />
              </div>
            </div>
          </section>

          {/* 12. Officer Data Table */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                12. Officer Operational Data Table
              </h2>
              <p className="text-xs text-text-muted">
                Section 25 & 39: Clear columns, status badges, scannable spacing, responsive container
              </p>
            </div>

            <DataTable
              columns={tableColumns}
              data={mockTableData}
              keyExtractor={(row) => row.token}
              currentPage={1}
              totalPages={3}
              onPageChange={(page) =>
                setActiveToast({
                  type: 'info',
                  message: `Switched to page ${page}`,
                })
              }
            />
          </section>

          {/* 13. Feedback States (Skeleton, Empty, Error) */}
          <section>
            <div className="border-b border-surface-border pb-2 mb-4">
              <h2 className="text-lg font-bold text-text-primary">
                13. Loading Skeletons, Empty & Error States
              </h2>
              <p className="text-xs text-text-muted">
                Section 32, 33 & 34: Graceful fallback states with actionable instructions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-md border border-surface-border shadow-sm space-y-3">
                <span className="text-xs font-bold text-text-muted uppercase block">
                  Loading Skeleton
                </span>
                <LoadingSkeleton variant="text" />
                <LoadingSkeleton variant="kpi" />
                <LoadingSkeleton variant="button" />
              </div>

              <EmptyState
                title="No Upcoming Bookings"
                description="Choose a crop and quantity to find the best capacity-aware procurement slot."
                actionLabel="Book a Slot"
                onAction={() =>
                  setActiveToast({
                    type: 'success',
                    message: 'Navigating to booking wizard...',
                  })
                }
              />

              <ErrorState
                title="Unable to Load Queue"
                message="Your last position (#12) is cached locally. Please check your connection and retry."
                retryLabel="Retry Connection"
                onRetry={() =>
                  setActiveToast({
                    type: 'info',
                    message: 'Retrying connection...',
                  })
                }
              />
            </div>
          </section>
        </div>
      </div>

      {/* Test Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Procurement Slot"
        description="Please review your slot details before final confirmation."
        footer={
          <>
            <Button variant="outline" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsModalOpen(false);
                setActiveToast({
                  type: 'success',
                  message: 'Slot SP-1047 confirmed successfully!',
                });
              }}
            >
              Confirm Booking
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-surface-page rounded border border-surface-border flex justify-between">
            <span className="text-text-muted">Center</span>
            <span className="font-bold text-text-primary">Center B (Malwa North)</span>
          </div>
          <div className="p-3 bg-surface-page rounded border border-surface-border flex justify-between">
            <span className="text-text-muted">Appointment Time</span>
            <span className="font-bold text-brand-primary">10:40 AM</span>
          </div>
          <div className="p-3 bg-surface-page rounded border border-surface-border flex justify-between">
            <span className="text-text-muted">Estimated Wait</span>
            <span className="font-bold text-text-primary">~35 minutes</span>
          </div>
        </div>
      </Modal>

      {/* Active Toast Notification */}
      {activeToast && (
        <Toast
          type={activeToast.type}
          message={activeToast.message}
          onClose={() => setActiveToast(null)}
        />
      )}
    </div>
  );
};
