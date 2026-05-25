import { body } from 'express-validator';

const passwordRule = body('password')
  .isString()
  .withMessage('Password is required')
  .isLength({ min: 8, max: 72 })
  .withMessage('Password must be between 8 and 72 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

export const registerValidation = [
  body('name')
    .isString()
    .withMessage('Name is required')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .isString()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  passwordRule,
];

export const loginValidation = [
  body('email')
    .isString()
    .withMessage('Email is required')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').isString().withMessage('Password is required').notEmpty().withMessage('Password is required'),
];
