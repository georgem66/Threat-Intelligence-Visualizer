import { body, query, param } from 'express-validator';

export const validateAuth = {
  register: [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    body('role')
      .optional()
      .isIn(['admin', 'analyst', 'viewer'])
      .withMessage('Role must be one of: admin, analyst, viewer'),
  ],
  login: [
    body('username')
      .notEmpty()
      .withMessage('Username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

export const validateThreat = {
  create: [
    body('sourceIp')
      .isIP()
      .withMessage('Source IP must be a valid IP address'),
    body('destinationIp')
      .optional()
      .isIP()
      .withMessage('Destination IP must be a valid IP address'),
    body('sourcePort')
      .optional()
      .isInt({ min: 1, max: 65535 })
      .withMessage('Source port must be between 1 and 65535'),
    body('destinationPort')
      .optional()
      .isInt({ min: 1, max: 65535 })
      .withMessage('Destination port must be between 1 and 65535'),
    body('protocol')
      .notEmpty()
      .withMessage('Protocol is required')
      .isLength({ max: 20 })
      .withMessage('Protocol must be at most 20 characters'),
    body('category')
      .isIn(['malware', 'phishing', 'botnet', 'spam', 'scanning', 'other'])
      .withMessage('Category must be one of: malware, phishing, botnet, spam, scanning, other'),
    body('severity')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be one of: low, medium, high, critical'),
    body('confidence')
      .isFloat({ min: 0, max: 100 })
      .withMessage('Confidence must be between 0 and 100'),
    body('description')
      .notEmpty()
      .withMessage('Description is required')
      .isLength({ max: 1000 })
      .withMessage('Description must be at most 1000 characters'),
    body('source')
      .notEmpty()
      .withMessage('Source is required')
      .isLength({ max: 100 })
      .withMessage('Source must be at most 100 characters'),
    body('geolocation')
      .optional()
      .isObject()
      .withMessage('Geolocation must be an object'),
    body('metadata')
      .optional()
      .isObject()
      .withMessage('Metadata must be an object'),
  ],
  update: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Threat ID must be a positive integer'),
    body('sourceIp')
      .optional()
      .isIP()
      .withMessage('Source IP must be a valid IP address'),
    body('destinationIp')
      .optional()
      .isIP()
      .withMessage('Destination IP must be a valid IP address'),
    body('sourcePort')
      .optional()
      .isInt({ min: 1, max: 65535 })
      .withMessage('Source port must be between 1 and 65535'),
    body('destinationPort')
      .optional()
      .isInt({ min: 1, max: 65535 })
      .withMessage('Destination port must be between 1 and 65535'),
    body('protocol')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Protocol must be at most 20 characters'),
    body('category')
      .optional()
      .isIn(['malware', 'phishing', 'botnet', 'spam', 'scanning', 'other'])
      .withMessage('Category must be one of: malware, phishing, botnet, spam, scanning, other'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be one of: low, medium, high, critical'),
    body('confidence')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Confidence must be between 0 and 100'),
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be at most 1000 characters'),
    body('source')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source must be at most 100 characters'),
  ],
};

export const validateQuery = {
  threats: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('category')
      .optional()
      .isIn(['malware', 'phishing', 'botnet', 'spam', 'scanning', 'other'])
      .withMessage('Category must be one of: malware, phishing, botnet, spam, scanning, other'),
    query('severity')
      .optional()
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be one of: low, medium, high, critical'),
    query('source')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source must be at most 100 characters'),
    query('country')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Country must be at most 100 characters'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO 8601 date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO 8601 date'),
    query('search')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Search term must be at most 255 characters'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'updatedAt', 'firstSeen', 'lastSeen', 'severity', 'confidence', 'count'])
      .withMessage('Sort by must be one of: createdAt, updatedAt, firstSeen, lastSeen, severity, confidence, count'),
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Sort order must be asc or desc'),
  ],
};
