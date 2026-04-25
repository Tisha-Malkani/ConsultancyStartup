import {
  BarChart2,
  Cpu,
  Factory,
  Pill,
  Settings,
  ShieldAlert,
  ShoppingBag,
  Truck,
} from 'lucide-react';

export const industryOptions = [
  { value: 'general', label: 'General Industry' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'fmcg', label: 'FMCG & Retail' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'pharma', label: 'Pharma & Regulated' },
  { value: 'electronics', label: 'Electronics & High-Tech' },
];

export const industryPreviewCards = [
  { key: 'manufacturing', icon: Factory, title: 'Manufacturing', text: 'Lean operations, production reliability, supplier risk, and quality control.' },
  { key: 'fmcg', icon: BarChart2, title: 'FMCG & Retail', text: 'Forecast accuracy, inventory turns, replenishment, and distribution agility.' },
  { key: 'pharma', icon: ShieldAlert, title: 'Pharma & Regulated', text: 'Compliance visibility, quality governance, and critical supplier assurance.' },
  { key: 'logistics', icon: Truck, title: 'Logistics', text: 'Fleet utilization, route optimization, freight consolidation, and OTIF improvement.' },
];

export const industries = {
  manufacturing: {
    key: 'manufacturing',
    title: 'Manufacturing Sector',
    shortLabel: 'Manufacturing',
    icon: Factory,
    accent: 'blue',
    tagline: 'Building resilient, zero-defect production networks.',
    summary: 'For plants, industrial supply chains, and operations leaders balancing cost, reliability, quality, and supplier resilience.',
    metrics: [
      { label: 'Average OTIF Improvement', value: '+22%' },
      { label: 'Defect Reduction', value: '85%' },
      { label: 'Supply Chain Cost Savings', value: '14%' },
    ],
    pillars: [
      { icon: Settings, title: 'Lean Six Sigma Integration', desc: 'We embed DMAIC methodologies directly onto the factory floor to eliminate variances and reduce scrap rates.' },
      { icon: ShieldAlert, title: 'Tier-N Supplier De-risking', desc: 'Visibility beyond Tier 1. We map your extended supply chain to identify single points of failure before they disrupt production.' },
      { icon: BarChart2, title: 'Scope 3 Decarbonization', desc: 'Auditing raw material sourcing to establish carbon baselines and executing strategies to meet tightening industrial regulations.' },
    ],
  },
  fmcg: {
    key: 'fmcg',
    title: 'FMCG & Retail',
    shortLabel: 'FMCG & Retail',
    icon: ShoppingBag,
    accent: 'indigo',
    tagline: 'Agile, demand-driven networks for fast-moving markets.',
    summary: 'For distribution, planning, and category teams that need faster replenishment, better working capital, and cleaner retail execution.',
    metrics: [
      { label: 'Inventory Holding Reduction', value: '18%' },
      { label: 'Forecast Accuracy Improvement', value: '+30%' },
      { label: 'Carbon Footprint Reduction', value: '25%' },
    ],
    pillars: [
      { icon: BarChart2, title: 'Demand-Driven Replenishment', desc: 'Moving from push to pull. We leverage predictive analytics to align production and distribution exactly with consumer demand.' },
      { icon: Settings, title: 'Omnichannel Logistics Optimization', desc: 'Consolidating DC networks and optimizing last-mile delivery routes to maintain margin in an omnichannel retail environment.' },
      { icon: ShieldAlert, title: 'Sustainable Packaging & Sourcing', desc: 'Revamping procurement strategies to prioritize sustainable materials without sacrificing unit economics or compliance.' },
    ],
  },
  logistics: {
    key: 'logistics',
    title: 'Logistics & Distribution',
    shortLabel: 'Logistics',
    icon: Truck,
    accent: 'emerald',
    tagline: 'Network visibility, transport efficiency, and service reliability at scale.',
    summary: 'For freight, warehousing, and distribution operations where margin, service reliability, and network control must move together.',
    metrics: [
      { label: 'Freight Cost Reduction', value: '12%' },
      { label: 'Route Utilization Gain', value: '+19%' },
      { label: 'Delivery Reliability Improvement', value: '+17%' },
    ],
    pillars: [
      { icon: Truck, title: 'Route and Lane Optimization', desc: 'We redesign lane architecture, carrier mix, and consolidation logic to bring transport costs under control without sacrificing service.' },
      { icon: BarChart2, title: 'Control Tower Visibility', desc: 'Operational dashboards and exception management routines help teams act faster on delays, cost leakage, and service failures.' },
      { icon: ShieldAlert, title: 'Carrier and Network Resilience', desc: 'We strengthen planning buffers, partner scorecards, and network contingency design for a more dependable logistics operation.' },
    ],
  },
  pharma: {
    key: 'pharma',
    title: 'Pharma & Regulated Industries',
    shortLabel: 'Pharma & Regulated',
    icon: Pill,
    accent: 'violet',
    tagline: 'Operational improvement designed for compliance-heavy, quality-critical environments.',
    summary: 'For regulated operations that need performance gains without compromising traceability, validation, or audit readiness.',
    metrics: [
      { label: 'Quality Deviation Reduction', value: '31%' },
      { label: 'Batch Release Acceleration', value: '+14%' },
      { label: 'Audit Readiness Improvement', value: '24%' },
    ],
    pillars: [
      { icon: ShieldAlert, title: 'Compliance-Led Process Design', desc: 'We improve throughput and reliability while protecting validation controls, traceability, and documented quality standards.' },
      { icon: Settings, title: 'Deviation and CAPA Reduction', desc: 'Root-cause diagnostics focus on recurring quality escapes, CAPA closure delays, and unstable execution points across regulated operations.' },
      { icon: BarChart2, title: 'Cold Chain and Supplier Governance', desc: 'We help teams improve supplier oversight, temperature-sensitive logistics, and risk controls across compliant supply networks.' },
    ],
  },
  electronics: {
    key: 'electronics',
    title: 'Electronics & High-Tech',
    shortLabel: 'Electronics',
    icon: Cpu,
    accent: 'cyan',
    tagline: 'Faster planning, component resilience, and better control of volatile supply bases.',
    summary: 'For component-driven supply chains facing volatile demand, constrained parts, expedite cost, and supplier concentration risk.',
    metrics: [
      { label: 'Component Expedite Reduction', value: '27%' },
      { label: 'Planning Stability Improvement', value: '+21%' },
      { label: 'Supplier Risk Visibility', value: '3x' },
    ],
    pillars: [
      { icon: BarChart2, title: 'Component Risk Mapping', desc: 'We identify high-risk parts, constrained categories, and supplier dependencies before they turn into line-down events.' },
      { icon: Settings, title: 'Planning and Inventory Synchronization', desc: 'Cross-functional planning cadence reduces expedite spending, excess stock, and unstable execution between demand and supply teams.' },
      { icon: ShieldAlert, title: 'Supplier Performance Governance', desc: 'We build scorecards and operating reviews that bring quality, continuity, lead time, and ESG visibility into one control rhythm.' },
    ],
  },
};

export const accentClasses = {
  blue: 'text-blue-600',
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  violet: 'text-violet-600',
  cyan: 'text-cyan-600',
};
