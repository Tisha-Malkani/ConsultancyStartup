import ESG from '../models/ESG.js';

const SCENARIO_CONFIG = {
  conservative: { savingsRate: 0.1, carbonRate: 0.12, scoreBoost: 4, label: 'Conservative' },
  expected: { savingsRate: 0.15, carbonRate: 0.2, scoreBoost: 10, label: 'Expected' },
  aggressive: { savingsRate: 0.22, carbonRate: 0.28, scoreBoost: 18, label: 'Aggressive' },
};

const INDUSTRY_MULTIPLIERS = {
  general: { savings: 1, carbon: 1 },
  manufacturing: { savings: 1.08, carbon: 1.12 },
  fmcg: { savings: 1.05, carbon: 0.98 },
  logistics: { savings: 1.12, carbon: 1.04 },
  pharma: { savings: 0.97, carbon: 1.08 },
  electronics: { savings: 1.04, carbon: 0.97 },
};

const TRANSPORT_MULTIPLIERS = {
  mixed: { savings: 1, carbon: 1 },
  road: { savings: 1.06, carbon: 1.04 },
  ocean: { savings: 0.92, carbon: 0.9 },
  air: { savings: 1.12, carbon: 1.18 },
  warehousing: { savings: 0.96, carbon: 0.94 },
};

const COMPLEXITY_MULTIPLIERS = {
  local: { savings: 0.95, carbon: 0.92, scoreBoost: 0 },
  regional: { savings: 1, carbon: 1, scoreBoost: 4 },
  global: { savings: 1.08, carbon: 1.1, scoreBoost: 9 },
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const roundToTwo = (value) => Number(value.toFixed(2));

export const calculateESGScore = async (req, res) => {
  try {
    const {
      logisticsSpend,
      carbonWaste,
      scenario = 'expected',
      industry = 'general',
      transportMode = 'mixed',
      supplierComplexity = 'regional',
    } = req.body;

    if (logisticsSpend === undefined || carbonWaste === undefined) {
      return res.status(400).json({ error: 'Please provide logisticsSpend and carbonWaste values.' });
    }

    const spendVal = parseFloat(logisticsSpend);
    const wasteVal = parseFloat(carbonWaste);

    if (Number.isNaN(spendVal) || Number.isNaN(wasteVal)) {
      return res.status(400).json({ error: 'All inputs must be valid numbers.' });
    }

    if (spendVal < 0 || wasteVal < 0) {
      return res.status(400).json({ error: 'Inputs must be zero or greater.' });
    }

    const scenarioConfig = SCENARIO_CONFIG[scenario] || SCENARIO_CONFIG.expected;
    const industryConfig = INDUSTRY_MULTIPLIERS[industry] || INDUSTRY_MULTIPLIERS.general;
    const transportConfig = TRANSPORT_MULTIPLIERS[transportMode] || TRANSPORT_MULTIPLIERS.mixed;
    const complexityConfig = COMPLEXITY_MULTIPLIERS[supplierComplexity] || COMPLEXITY_MULTIPLIERS.regional;

    const savingsRate = clamp(
      scenarioConfig.savingsRate * industryConfig.savings * transportConfig.savings * complexityConfig.savings,
      0.08,
      0.3
    );
    const carbonRate = clamp(
      scenarioConfig.carbonRate * industryConfig.carbon * transportConfig.carbon * complexityConfig.carbon,
      0.1,
      0.35
    );

    const optimizationPotential = roundToTwo(spendVal * savingsRate);
    const annualizedSavings = roundToTwo(optimizationPotential * 12);
    const carbonReduction = roundToTwo(wasteVal * carbonRate);

    const spendSignal = clamp((spendVal / 500000) * 24, 0, 24);
    const carbonSignal = clamp((wasteVal / 12000) * 28, 0, 28);
    const efficiencySignal = clamp((savingsRate / 0.3) * 22, 0, 22);
    const complexitySignal = complexityConfig.scoreBoost + scenarioConfig.scoreBoost;
    const opportunityScore = Math.round(clamp(spendSignal + carbonSignal + efficiencySignal + complexitySignal, 18, 98));

    let benchmarkStatus = 'Within benchmark';
    if (opportunityScore >= 78) {
      benchmarkStatus = 'Above benchmark opportunity';
    } else if (opportunityScore <= 45) {
      benchmarkStatus = 'Stable baseline';
    }

    let impactLevel = 'Moderate';
    if (opportunityScore >= 85 || annualizedSavings >= 1500000) {
      impactLevel = 'Transformational';
    } else if (opportunityScore >= 68 || annualizedSavings >= 600000) {
      impactLevel = 'High';
    }

    let roiTier = 'Focused';
    if (annualizedSavings >= 1000000 || carbonReduction >= 2500) {
      roiTier = 'Strategic';
    } else if (annualizedSavings >= 350000 || carbonReduction >= 1000) {
      roiTier = 'Strong';
    }

    let recommendedService = 'Supply Chain Optimization Diagnostic';
    let nextStep = 'Book a network diagnostic workshop';

    if (wasteVal >= 9000 || carbonReduction >= 1800 || industry === 'manufacturing') {
      recommendedService = 'ESG Scope 3 Baseline';
      nextStep = 'Launch supplier mapping and emissions baseline review';
    } else if (transportMode === 'air' || spendVal >= 450000) {
      recommendedService = 'Route Optimization Diagnostic';
      nextStep = 'Review lane mix, shipment consolidation, and carrier strategy';
    } else if (supplierComplexity === 'global') {
      recommendedService = 'Supplier Rationalization Sprint';
      nextStep = 'Prioritize supplier segmentation and sourcing opportunity scan';
    }

    if (req.user?._id) {
      const esgRecord = new ESG({
        userId: req.user._id,
        logisticsSpend: spendVal,
        carbonWaste: wasteVal,
        scenario,
        industry,
        transportMode,
        supplierComplexity,
        optimizationPotential,
        annualizedSavings,
        carbonReduction,
        opportunityScore,
        benchmarkStatus,
        impactLevel,
        roiTier,
        recommendedService,
        nextStep,
      });
      await esgRecord.save();
    }

    res.status(200).json({
      optimizationPotential: optimizationPotential.toFixed(2),
      annualizedSavings: annualizedSavings.toFixed(2),
      carbonReduction: carbonReduction.toFixed(2),
      opportunityScore,
      benchmarkStatus,
      impactLevel,
      roiTier,
      recommendedService,
      nextStep,
      assumptions: {
        scenario: scenarioConfig.label,
        logisticsRate: `${Math.round(savingsRate * 100)}%`,
        carbonRate: `${Math.round(carbonRate * 100)}%`,
      },
      savedToDashboard: Boolean(req.user?._id),
      message: 'Optimization and reduction model calculated successfully.',
    });
  } catch (error) {
    console.error('Error in calculateESGScore:', error);
    res.status(500).json({ error: 'Server Error. Could not calculate metrics.' });
  }
};
