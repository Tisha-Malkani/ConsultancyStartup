import ESG from '../models/ESG.js';

export const calculateESGScore = async (req, res) => {
  try {
    const { logisticsSpend, carbonWaste } = req.body;

    if (logisticsSpend === undefined || carbonWaste === undefined) {
      return res.status(400).json({ error: 'Please provide logisticsSpend and carbonWaste values.' });
    }

    const spendVal = parseFloat(logisticsSpend);
    const wasteVal = parseFloat(carbonWaste);

    if (isNaN(spendVal) || isNaN(wasteVal)) {
      return res.status(400).json({ error: 'All inputs must be valid numbers.' });
    }

    const optimizationPotential = spendVal * 0.15;
    const carbonReduction = wasteVal * 0.20;

    // Guests can calculate instantly; logged-in users also build dashboard history.
    if (req.user?._id) {
      const esgRecord = new ESG({
        userId: req.user._id,
        logisticsSpend: spendVal,
        carbonWaste: wasteVal,
        optimizationPotential,
        carbonReduction,
      });
      await esgRecord.save();
    }

    res.status(200).json({
      optimizationPotential: optimizationPotential.toFixed(2),
      carbonReduction: carbonReduction.toFixed(2),
      savedToDashboard: Boolean(req.user?._id),
      message: 'Optimization and Reduction calculated successfully.',
    });
  } catch (error) {
    console.error('Error in calculateESGScore:', error);
    res.status(500).json({ error: 'Server Error. Could not calculate metrics.' });
  }
};
