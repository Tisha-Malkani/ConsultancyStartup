const stores = new Map();

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
};

export const createRateLimiter = ({
  windowMs,
  maxRequests,
  message,
}) => {
  if (!windowMs || !maxRequests) {
    throw new Error('windowMs and maxRequests are required for rate limiting');
  }

  return (req, res, next) => {
    const now = Date.now();
    const clientIp = getClientIp(req);
    const key = `${req.baseUrl || ''}:${req.path}:${clientIp}`;
    const existing = stores.get(key);

    if (!existing || existing.expiresAt <= now) {
      stores.set(key, {
        count: 1,
        expiresAt: now + windowMs,
      });
      return next();
    }

    existing.count += 1;

    if (existing.count > maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: message || 'Too many requests. Please try again later.',
      });
    }

    return next();
  };
};
