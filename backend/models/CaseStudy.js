import mongoose from 'mongoose';

const caseStudySchema = new mongoose.Schema({
  client: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  challenge: { type: String, required: true },
  strategy: { type: String, required: true },
  metric: { type: String, required: true },
  metricLabel: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export default CaseStudy;
