import Engagement from '../models/Engagement.js';

export const getMyEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findOne({ clientEmail: req.user.email.toLowerCase() })
      .sort({ updatedAt: -1 });

    res.json({ engagement });
  } catch (error) {
    console.error('Client engagement error:', error);
    res.status(500).json({ error: 'Failed to load engagement data.' });
  }
};
