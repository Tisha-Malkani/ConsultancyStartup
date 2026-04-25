import CaseStudy from '../models/CaseStudy.js';

export const getCaseStudies = async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find({});
    res.status(200).json(caseStudies);
  } catch (error) {
    console.error('Error in getCaseStudies:', error);
    res.status(500).json({ error: 'Server Error. Could not fetch case studies.' });
  }
};

export const getCaseStudyById = async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    if (!caseStudy) {
      return res.status(404).json({ error: 'Case study not found.' });
    }
    res.status(200).json(caseStudy);
  } catch (error) {
    console.error('Error in getCaseStudyById:', error);
    res.status(500).json({ error: 'Server Error. Could not fetch case study.' });
  }
};

