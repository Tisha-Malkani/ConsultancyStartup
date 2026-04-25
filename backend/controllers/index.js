export const healthCheck = (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Consultancy API is healthy and functioning correctly.',
    timestamp: new Date().toISOString()
  });
};
