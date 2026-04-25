import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CaseStudy from './models/CaseStudy.js';
import Blog from './models/Blog.js';

dotenv.config();

const caseStudies = [
  {
    title: 'End-to-End Supply Chain Redesign Cuts Lead Times by 38%',
    client: 'Meridian Consumer Goods',
    category: 'Supply Chain Management',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
    challenge: 'Meridian, a mid-sized FMCG brand with operations across 5 states, was plagued by siloed planning across manufacturing, warehousing, and sales teams. This created chronic over-production of slow movers alongside persistent stockouts of top-selling SKUs, pushing lead times to 21 days and creating write-offs worth ₹4.2 Cr annually.',
    strategy: 'NovaConsult implemented a unified S&OP (Sales & Operations Planning) process, consolidating demand signals from distributors into a single planning platform. We redesigned the distribution network, reducing hub nodes from 11 to 7, and introduced a weekly demand review cadence with cross-functional accountability.',
    metric: '38%',
    metricLabel: 'Reduction in Average Lead Time'
  },
  {
    title: 'Route Optimization Reduces Freight Spend by ₹1.8 Cr Annually',
    client: 'NorthBridge Logistics Pvt. Ltd.',
    category: 'Logistics & Distribution',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80',
    challenge: 'NorthBridge operated a fleet of 60 vehicles across 3 regions with manual trip planning. Vehicles averaged 68% load utilization and 340 km of empty return trips per day. Fuel and driver costs were ₹9.1 Cr annually, with OTIF rates stuck at 81%.',
    strategy: 'We deployed a route optimization model using load-clustering algorithms and introduced a dynamic freight consolidation policy. Milk-run routes replaced point-to-point deliveries for 40% of routes. Real-time GPS integration enabled proactive exception management for delays.',
    metric: '₹1.8 Cr',
    metricLabel: 'Annual Freight Cost Savings'
  },
  {
    title: 'Strategic Sourcing Initiative Delivers 14% Category Cost Reduction',
    client: 'Orion Pharma Manufacturing',
    category: 'Procurement & Purchase Strategy',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    challenge: 'Orion\'s procurement team of 8 managed over 1,200 active suppliers with no formal category strategy. Spend was highly fragmented — the top 3 packaging categories alone had 47 suppliers — and purchase orders were raised reactively, eliminating any negotiation leverage.',
    strategy: 'NovaConsult conducted a full spend analysis and rationalized the supplier base by 35% across 6 indirect and direct categories. We facilitated competitive RFQ events for consolidated volumes and introduced 12-month blanket orders with performance-linked pricing for top-tier suppliers.',
    metric: '14%',
    metricLabel: 'Reduction in Category Procurement Cost'
  },
  {
    title: 'Supplier Development Programme Eliminates 3 Critical Single Points of Failure',
    client: 'Solaris Auto Components',
    category: 'Vendor Development',
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80',
    challenge: 'Solaris, a Tier 1 automotive supplier, had 3 critical sub-assemblies sourced exclusively from single vendors with no approved alternates. A 14-day closure at one vendor during monsoon flooding halted ₹6.5 Cr worth of production in a single quarter.',
    strategy: 'We conducted a structured supplier risk assessment and identified 11 components as "sole-source critical." For the top 3, we ran a 6-month parallel development programme — qualifying alternate vendors, running capability studies (Cpk audits), and building buffer inventory bridges during the transition.',
    metric: '3',
    metricLabel: 'Critical Supply Risks Eliminated'
  },
  {
    title: 'Inventory Optimization Releases ₹3.4 Cr in Working Capital',
    client: 'Cascade Home Products',
    category: 'Inventory Management',
    image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80',
    challenge: 'Cascade carried 112 days of inventory across its warehouse network — nearly double the industry average of 58 days. Simultaneously, their 20 fastest-moving SKUs experienced stockouts 14 times in a single quarter, with lost sales estimated at ₹1.1 Cr. The root cause was a flat reorder-point policy applied uniformly across all 4,800 SKUs.',
    strategy: 'We deployed an ABC-XYZ segmentation model to classify the SKU portfolio by volume and demand variability. Dynamic safety stock formulas, calibrated by lead time and coefficient of variation, replaced the flat reorder policy. Slow-moving and obsolete stock was identified and cleared via structured promotions, releasing ₹3.4 Cr in cash.',
    metric: '₹3.4 Cr',
    metricLabel: 'Working Capital Released'
  },
  {
    title: 'DMAIC Project Reduces Assembly Defect Rate from 4.1% to 0.3%',
    client: 'Titan Automotive Systems',
    category: 'Six Sigma & Process Excellence',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    challenge: 'Titan\'s brake caliper assembly line reported a field defect rate of 4.1%, triggering a recall risk alert from their OEM customer. Internal rework was consuming 1.8 hours per defective unit across 320 units per month, adding ₹18 lakh in direct labour and material costs monthly and threatening a key ₹42 Cr annual contract.',
    strategy: 'A cross-functional DMAIC team was chartered. Using process capability studies and Fishbone analysis, we identified 3 root causes: inconsistent torque application, a worn jig fixture, and inadequate incoming material inspection. Control charts were deployed, jigs were replaced on a 90-day cycle, and an automated optical inspection station was added at the line end.',
    metric: '93%',
    metricLabel: 'Reduction in Field Defect Rate'
  },
  {
    title: 'Scope 3 Emissions Mapped and Reduced by 22% Ahead of CSRD Deadline',
    client: 'Lumina Electronics India',
    category: 'ESG Integration',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    challenge: 'Lumina faced a hard deadline from their European parent company to submit a compliant CSRD report within 9 months. They had zero internal capability for Scope 3 tracking and no visibility into the carbon footprint of their 180+ component suppliers. A failed audit risked delisting from the parent company\'s approved supplier list.',
    strategy: 'NovaConsult executed a 3-phase programme: Scope 3 baselining using industry emission factors across 6 upstream categories; a supplier questionnaire campaign covering 80% of spend; and a corrective action plan targeting the top 15 high-emission vendors. We embedded emission KPIs into the quarterly supplier review scorecard and trained the internal team on GHG Protocol reporting standards.',
    metric: '22%',
    metricLabel: 'Reduction in Scope 3 Emissions'
  }
];

const blogs = [
  {
    title: 'The Future of Resilient Supply Chains',
    content: 'In recent years, global disruptions have underscored the critical need for resilient supply chains. The era of strictly "just-in-time" inventory models—where efficiency and cost-cutting were prioritized above all else—has proven to be dangerously fragile in the face of unforeseen macroeconomic shocks. Organizations across all sectors are now being forced to adapt, shifting toward "just-in-case" models that build strategic redundancy into their operational DNA.\n\nThe transition requires more than just stockpiling inventory; it demands a fundamental re-architecting of the supply network. Forward-thinking enterprises are leveraging predictive analytics and machine learning to construct digital twins of their physical supply chains. These digital replicas allow supply chain managers to run complex simulations, stress-testing their networks against variables like port closures, raw material shortages, and sudden spikes in consumer demand.\n\nFurthermore, true resilience requires deep, end-to-end visibility. It is no longer sufficient to only understand your Tier 1 suppliers. The modern supply chain leader must have a clear line of sight into Tier 2 and Tier 3 networks, identifying single points of failure hidden deep within the supply base. This level of transparency enables proactive risk mitigation rather than reactive crisis management.\n\nA resilient supply chain is inherently a diversified one. The strategy of relying on a single geographic region for critical components is being rapidly dismantled in favor of nearshoring and "China Plus One" strategies. By distributing manufacturing and sourcing across multiple regions, companies can insulate themselves from localized disruptions, whether they be geopolitical tensions, extreme weather events, or sudden regulatory shifts.\n\nAnother critical pillar of resilience is the integration of advanced automation within the warehouse and distribution centers. Labor shortages have exposed the vulnerability of highly manual fulfillment processes. By investing in autonomous mobile robots (AMRs), automated storage and retrieval systems (AS/RS), and AI-driven sorting mechanisms, companies can maintain high throughput even during severe workforce constraints.\n\nMoreover, the relationship between buyers and suppliers is evolving. The traditional adversarial approach, focused purely on squeezing margins, is giving way to strategic partnerships. In times of crisis, suppliers are more likely to prioritize customers who treat them as true partners. This involves transparent forecasting, joint investment in capacity building, and collaborative risk management strategies.\n\nThe role of the Chief Supply Chain Officer (CSCO) has also been elevated from an operational focus to a strategic, board-level imperative. Supply chain resilience is now widely recognized as a primary driver of enterprise value, directly impacting a company\'s ability to reliably generate revenue. The CSCO must balance the inherent tension between cost efficiency and operational redundancy, justifying resilience investments to shareholders as a form of critical business insurance.\n\nBuilding a resilient supply chain is an investment in business continuity. While it may require higher upfront capital to diversify supplier bases and implement advanced tracking technologies, the long-term ROI is undeniable. Companies that embrace these changes are not only protecting their bottom line from future disruptions but are also positioning themselves to capture market share from slower, less adaptable competitors. The future belongs to those who build to survive and thrive in chaos.',
    author: 'Sarah Jenkins',
    category: 'Supply Chain',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
    readTime: '6 min read'
  },
  {
    title: 'Navigating ESG Compliance in 2026',
    content: 'Environmental, Social, and Governance (ESG) criteria have rapidly evolved from a niche public relations exercise into a foundational pillar of corporate strategy and regulatory compliance. With the implementation of the Corporate Sustainability Reporting Directive (CSRD) in the EU and tightening SEC guidelines in North America, enterprises are facing unprecedented pressure to accurately measure and report their environmental impact. Non-compliance is no longer merely a reputational risk; it carries severe financial and legal penalties.\n\nThe most significant challenge facing organizations today is the tracking and reduction of Scope 3 emissions. Unlike Scope 1 and 2 emissions, which are generated directly by the company through owned facilities and purchased energy, Scope 3 encompasses the entire value chain—from the extraction of raw materials by suppliers to the end-of-life disposal of products by consumers. Because these emissions occur outside of a company’s direct operational control, they are notoriously difficult to quantify. Yet, for most organizations, Scope 3 represents the vast majority (often up to 90%) of their total carbon footprint.\n\nTo navigate this complex landscape, companies must move away from manual, spreadsheet-based tracking and adopt automated data collection platforms. Integrating ESG metrics directly into enterprise resource planning (ERP) systems allows for real-time monitoring and auditing. This requires implementing a robust data architecture capable of ingesting diverse datasets from thousands of suppliers globally, normalizing that data, and applying recognized carbon accounting frameworks to calculate emissions accurately.\n\nAdditionally, procurement departments must shift their focus, evaluating vendors not just on cost and quality, but on their verifiable carbon impact. This involves updating vendor scorecards to heavily weight sustainability metrics and requiring suppliers to commit to science-based emission reduction targets. Companies must be prepared to sever ties with suppliers who refuse to comply, making sustainability a non-negotiable condition of doing business.\n\nBeyond emissions, the "Social" and "Governance" pillars of ESG are facing increased scrutiny. Regulators and investors are demanding transparency regarding labor practices deep within the supply chain, particularly concerning forced labor and fair wages. Supply chain mapping must now extend beyond operational risk to identify human rights vulnerabilities, requiring rigorous third-party audits and the implementation of robust whistleblower mechanisms.\n\nGovernance structures are also adapting. Boards of Directors are establishing dedicated ESG committees, and executive compensation is increasingly tied to the achievement of sustainability goals. This top-down accountability ensures that ESG initiatives are not sidelined when short-term financial pressures arise. It signals to the market that sustainability is embedded into the core fabric of the company\'s strategic decision-making process.\n\nThe transition to sustainable operations is no longer optional. Organizations that proactively build transparent, compliant, and sustainable supply networks will benefit from lower costs of capital, increased consumer trust, and immunity to impending carbon taxes. The future belongs to the green enterprise, where profitability and sustainability are recognized not as opposing forces, but as mutually reinforcing objectives.',
    author: 'David Chen',
    category: 'ESG',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80',
    readTime: '8 min read'
  },
  {
    title: 'Digital Transformation in Procurement',
    content: 'For decades, procurement was viewed primarily as a back-office administrative function focused entirely on transactional cost reduction. Today, procurement has evolved into a strategic powerhouse, heavily reliant on digital transformation to drive holistic value across the enterprise. The modern Chief Procurement Officer (CPO) is as much a technologist as they are a negotiator, responsible for architecting a digital ecosystem that maximizes efficiency and minimizes risk.\n\nThe catalyst for this evolution is the integration of Artificial Intelligence (AI) and advanced analytics into the procure-to-pay (P2P) lifecycle. AI-driven spend analysis tools are capable of instantly categorizing millions of transactions, identifying rogue spending patterns, and highlighting opportunities for vendor consolidation that human analysts would easily miss. This level of granular visibility empowers procurement teams to negotiate from a position of absolute data superiority, uncovering hidden savings across fragmented categories.\n\nBeyond cost savings, digital transformation is revolutionizing vendor management. Automated onboarding portals reduce cycle times from weeks to hours, streamlining compliance checks and accelerating time-to-value. Furthermore, continuous risk-monitoring algorithms scan global news feeds, financial databases, and social media to alert organizations to potential supplier bankruptcies, labor strikes, or compliance violations before they can impact the supply chain.\n\nContract Lifecycle Management (CLM) has also undergone a digital renaissance. Legacy systems relying on static PDFs and fragmented email threads are being replaced by dynamic, AI-powered CLM platforms. These systems automatically extract key clauses, track renewal dates, and highlight contractual deviations from standard templates. This significantly reduces legal review times and ensures that negotiated terms are actually realized throughout the life of the contract.\n\nIn the realm of strategic sourcing, e-sourcing tools are moving beyond basic reverse auctions. Advanced sourcing optimization platforms utilize mathematical modeling to evaluate complex, multi-variable bids. They allow procurement teams to factor in non-price variables such as sustainability scores, delivery lead times, and capacity constraints, ensuring that the total value of the award is maximized rather than simply minimizing the unit price.\n\nThe future of procurement lies in cognitive automation—where routine tactical purchasing, invoice processing, and standard contract renewals are entirely automated. This automation frees up human capital to focus on high-value, strategic activities such as relationship building, innovation sourcing, and complex negotiations. Procurement professionals are evolving from tactical buyers into strategic advisors to the business.\n\nBy embracing digital procurement, organizations are transforming a traditional cost center into a primary driver of competitive advantage. The ability to execute sourcing events faster, manage risks proactively, and leverage data for superior negotiation outcomes separates industry leaders from the laggards. In a rapidly changing global market, a digitally transformed procurement function is essential for long-term operational excellence.',
    author: 'Michael Rodriguez',
    category: 'Digital Transformation',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80',
    readTime: '5 min read'
  }
];

const importData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy';
    await mongoose.connect(uri);

    await CaseStudy.deleteMany();
    await Blog.deleteMany();

    await CaseStudy.insertMany(caseStudies);
    await Blog.insertMany(blogs);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/consultancy';
    await mongoose.connect(uri);

    await CaseStudy.deleteMany();
    await Blog.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
