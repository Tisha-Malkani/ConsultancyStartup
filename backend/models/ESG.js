import mongoose from 'mongoose';

const esgSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  logisticsSpend: { type: Number, required: true },
  carbonWaste: { type: Number, required: true },
  scenario: { type: String, default: 'expected' },
  industry: { type: String, default: 'general' },
  transportMode: { type: String, default: 'mixed' },
  supplierComplexity: { type: String, default: 'regional' },
  optimizationPotential: { type: Number, required: true },
  annualizedSavings: { type: Number, required: true },
  carbonReduction: { type: Number, required: true },
  opportunityScore: { type: Number, required: true },
  benchmarkStatus: { type: String, required: true },
  impactLevel: { type: String, required: true },
  roiTier: { type: String, required: true },
  recommendedService: { type: String, required: true },
  nextStep: { type: String, required: true }
}, { timestamps: true });

const ESG = mongoose.model('ESG', esgSchema);
export default ESG;
