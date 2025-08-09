import { body } from 'express-validator';

export const validateAuth = {
  register: [
    body('username')
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters')
      .isAlphanumeric()
      .withMessage('Username must contain only letters and numbers'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
    body('role')
      .optional()
      .isIn(['admin', 'analyst', 'viewer'])
      .withMessage('Role must be admin, analyst, or viewer'),
  ],
  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
};

export const validateThreat = {
  create: [
    body('type')
      .isIn(['ip', 'domain', 'url', 'hash', 'email'])
      .withMessage('Type must be one of: ip, domain, url, hash, email'),
    body('value')
      .notEmpty()
      .trim()
      .withMessage('Value is required'),
    body('category')
      .isIn(['malware', 'phishing', 'botnet', 'spam', 'ddos', 'bruteforce', 'other'])
      .withMessage('Category must be one of: malware, phishing, botnet, spam, ddos, bruteforce, other'),
    body('severity')
      .isIn(['critical', 'high', 'medium', 'low'])
      .withMessage('Severity must be one of: critical, high, medium, low'),
    body('confidence')
      .isInt({ min: 0, max: 100 })
      .withMessage('Confidence must be a number between 0 and 100'),
    body('source')
      .notEmpty()
      .trim()
      .withMessage('Source is required'),
    body('description')
      .optional()
      .trim(),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
  ],
  update: [
    body('category')
      .optional()
      .isIn(['malware', 'phishing', 'botnet', 'spam', 'ddos', 'bruteforce', 'other'])
      .withMessage('Category must be one of: malware, phishing, botnet, spam, ddos, bruteforce, other'),
    body('severity')
      .optional()
      .isIn(['critical', 'high', 'medium', 'low'])
      .withMessage('Severity must be one of: critical, high, medium, low'),
    body('confidence')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Confidence must be a number between 0 and 100'),
    body('description')
      .optional()
      .trim(),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
  ],
};