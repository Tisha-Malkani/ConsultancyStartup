import mongoose from 'mongoose';

const esgSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  logisticsSpend: { type: Number, required: true },
  carbonWaste: { type: Number, required: true },
  optimizationPotential: { type: Number, required: true },
  carbonReduction: { type: Number, required: true }
}, { timestamps: true });

const ESG = mongoose.model('ESG', esgSchema);
export default ESG;
