import Booking from '../models/Booking.js';
import ESG from '../models/ESG.js';

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // ── User's own bookings ───────────────────────────────────────
    const myBookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .select('firstName lastName email interestArea createdAt');

    // ── User's own ESG runs ────────────────────────────────────────
    const myESGRuns = await ESG.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    // ── KPIs ──────────────────────────────────────────────────────
    const totalESGSavings = myESGRuns.reduce((sum, r) => sum + r.optimizationPotential, 0);
    const totalCarbonReduced = myESGRuns.reduce((sum, r) => sum + r.carbonReduction, 0);

    // ── Booking trend by month (last 6 months) ────────────────────
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const bookingTrendRaw = await Booking.aggregate([
      { $match: { userId, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const bookingTrend = bookingTrendRaw.map((b) => ({
      month: monthNames[b._id.month - 1],
      bookings: b.count,
    }));

    // ── Bookings by service area ──────────────────────────────────
    const bookingsByServiceRaw = await Booking.aggregate([
      { $match: { userId } },
      { $group: { _id: '$interestArea', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const bookingsByService = bookingsByServiceRaw.map((b) => ({
      name: b._id || 'Other',
      value: b.count,
    }));

    // ── ESG runs as chart data ────────────────────────────────────
    const esgTrend = [...myESGRuns].reverse().map((r, i) => ({
      label: `Run ${i + 1}`,
      savings: Math.round(r.optimizationPotential),
      carbonReduction: Math.round(r.carbonReduction),
    }));

    res.json({
      kpis: {
        totalBookings: myBookings.length,
        totalESGRuns: myESGRuns.length,
        totalESGSavings: totalESGSavings >= 1e6
          ? `$${(totalESGSavings / 1e6).toFixed(2)}M`
          : `$${Math.round(totalESGSavings).toLocaleString()}`,
        totalCarbonReduced: `${Math.round(totalCarbonReduced).toLocaleString()} Tons`,
      },
      recentBookings: myBookings.slice(0, 5),
      bookingsByService,
      bookingTrend,
      esgTrend,
      // Benchmark data — static industry comparison for vendor radar
      vendorPerformanceData: [
        { subject: 'Quality',       score: 95, avg: 80 },
        { subject: 'Speed',         score: 88, avg: 75 },
        { subject: 'Cost',          score: 72, avg: 70 },
        { subject: 'Reliability',   score: 98, avg: 85 },
        { subject: 'Communication', score: 90, avg: 80 },
        { subject: 'Compliance',    score: 100, avg: 90 },
      ],
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
};
