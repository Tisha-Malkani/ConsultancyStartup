import mongoose from 'mongoose';

const workstreamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  status: { type: String, default: 'Active' },
  progress: { type: Number, default: 0 },
  due: { type: String, default: '' },
}, { _id: false });

const actionSchema = new mongoose.Schema({
  task: { type: String, required: true },
  owner: { type: String, required: true },
  due: { type: String, default: '' },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
}, { _id: false });

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, default: 'Governance' },
  status: { type: String, default: 'Open' },
}, { _id: false });

const engagementSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true, lowercase: true, trim: true },
  company: { type: String, default: '' },
  programmeHealth: { type: String, default: 'On Track' },
  status: { type: String, default: 'Active' },
  diagnostic: {
    riskLevel: { type: String, default: 'Medium' },
    opportunity: { type: String, default: 'High' },
    recommendedService: { type: String, default: 'Supply Chain Optimization' },
    nextStep: { type: String, default: 'Book network diagnostic workshop' },
  },
  workstreams: [workstreamSchema],
  actions: [actionSchema],
  documents: [documentSchema],
}, { timestamps: true });

const Engagement = mongoose.model('Engagement', engagementSchema);
export default Engagement;
