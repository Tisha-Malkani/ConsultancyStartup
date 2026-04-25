import Booking from '../models/Booking.js';
import ESG from '../models/ESG.js';
import User from '../models/User.js';
import Engagement from '../models/Engagement.js';

const defaultEngagementData = (body) => ({
  clientName: body.clientName,
  clientEmail: body.clientEmail,
  company: body.company || '',
  programmeHealth: body.programmeHealth || 'On Track',
  status: body.status || 'Active',
  diagnostic: {
    riskLevel: body.riskLevel || 'Medium',
    opportunity: body.opportunity || 'High',
    recommendedService: body.recommendedService || 'Supply Chain Optimization',
    nextStep: body.nextStep || 'Run diagnostic workshop',
  },
  workstreams: body.workstreams?.length ? body.workstreams : [
    { name: 'Supply Chain Diagnostic', owner: 'NovaConsult + Operations', status: 'Active', progress: 72, due: '14 May 2026' },
    { name: 'Supplier Risk Scorecard', owner: 'Procurement Lead', status: 'In Review', progress: 54, due: '21 May 2026' },
    { name: 'ESG Baseline Model', owner: 'Sustainability Lead', status: 'Awaiting Data', progress: 38, due: '28 May 2026' },
  ],
  actions: body.actions?.length ? body.actions : [
    { task: 'Upload top 50 supplier spend file', owner: 'Client Procurement', due: '29 Apr', priority: 'High' },
    { task: 'Validate logistics lane baseline', owner: 'Operations PMO', due: '02 May', priority: 'Medium' },
  ],
  documents: body.documents?.length ? body.documents : [
    { title: 'Statement of Work', type: 'Commercial', status: 'Signed' },
    { title: 'Baseline Data Request', type: 'Data Pack', status: 'Open' },
  ],
});

export const getAdminOverview = async (req, res) => {
  try {
    const [users, bookings, esgRuns, engagements, bookingCount, esgCount] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select('name email role createdAt'),
      Booking.find().sort({ createdAt: -1 }).limit(20),
      ESG.find().sort({ createdAt: -1 }).limit(20),
      Engagement.find().sort({ updatedAt: -1 }),
      Booking.countDocuments(),
      ESG.countDocuments(),
    ]);

    const clientUsers = users.filter((u) => u.role !== 'admin');
    const clientUserIds = clientUsers.map((user) => user._id);
    const clientEmails = clientUsers.map((user) => user.email?.toLowerCase()).filter(Boolean);

    const [engagementBookings, engagementESGRuns] = await Promise.all([
      Booking.find({ email: { $in: clientEmails } })
        .sort({ createdAt: -1 })
        .select('email interestArea createdAt'),
      ESG.find({ userId: { $in: clientUserIds } })
        .sort({ createdAt: -1 })
        .select('userId optimizationPotential carbonReduction logisticsSpend carbonWaste createdAt'),
    ]);

    const userIdByEmail = new Map(clientUsers.map((user) => [user.email?.toLowerCase(), String(user._id)]));
    const bookingsByEmail = engagementBookings.reduce((acc, booking) => {
      const email = booking.email?.toLowerCase();
      if (!email) return acc;
      acc[email] = acc[email] || [];
      acc[email].push(booking);
      return acc;
    }, {});
    const esgByUserId = engagementESGRuns.reduce((acc, run) => {
      const key = String(run.userId);
      acc[key] = acc[key] || [];
      acc[key].push(run);
      return acc;
    }, {});

    const enrichedEngagements = engagements.map((engagement) => {
      const email = engagement.clientEmail?.toLowerCase();
      const userId = userIdByEmail.get(email);
      const relatedBookings = bookingsByEmail[email] || [];
      const relatedESGRuns = userId ? (esgByUserId[userId] || []) : [];
      const totalESGSavings = relatedESGRuns.reduce((sum, run) => sum + run.optimizationPotential, 0);
      const totalCarbonReduced = relatedESGRuns.reduce((sum, run) => sum + run.carbonReduction, 0);
      const serviceFrequency = relatedBookings.reduce((acc, booking) => {
        const key = booking.interestArea || 'Other';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      const primaryPainPoint = Object.entries(serviceFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      return {
        ...engagement.toObject(),
        analyticsPreview: {
          totalBookings: relatedBookings.length,
          totalESGRuns: relatedESGRuns.length,
          totalESGSavings,
          totalCarbonReduced,
          primaryPainPoint,
          latestBookingAt: relatedBookings[0]?.createdAt || null,
          latestESGRun: relatedESGRuns[0] || null,
        },
      };
    });

    res.json({
      kpis: {
        clients: clientUsers.length,
        admins: users.filter((u) => u.role === 'admin').length,
        bookings: bookingCount,
        esgRuns: esgCount,
        engagements: enrichedEngagements.length,
      },
      users,
      recentBookings: bookings,
      recentESGRuns: esgRuns,
      engagements: enrichedEngagements,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ error: 'Failed to load admin overview.' });
  }
};

export const createEngagement = async (req, res) => {
  try {
    const { clientName, clientEmail } = req.body;
    if (!clientName || !clientEmail) {
      return res.status(400).json({ error: 'Client name and client email are required.' });
    }

    const engagement = await Engagement.create(defaultEngagementData(req.body));
    res.status(201).json(engagement);
  } catch (error) {
    console.error('Create engagement error:', error);
    res.status(500).json({ error: 'Failed to create engagement.' });
  }
};

export const updateEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findByIdAndUpdate(
      req.params.id,
      defaultEngagementData(req.body),
      { new: true, runValidators: true }
    );

    if (!engagement) {
      return res.status(404).json({ error: 'Engagement not found.' });
    }

    res.json(engagement);
  } catch (error) {
    console.error('Update engagement error:', error);
    res.status(500).json({ error: 'Failed to update engagement.' });
  }
};
