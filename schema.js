const Joi = require('joi');
const passwordStrengthValidator = require('./utils/passwordStrength');

module.exports.userSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required',
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email',
    }),
    password: Joi.string()
        .custom(passwordStrengthValidator, 'Password Strength Validation')
        .required().messages({
            'any.required': 'Password is required',
        }),
    phoneNumber: Joi.string()
        .length(10)
        .pattern(/^\d+$/)
        .required()
        .messages({
            'any.required': 'Phone number is required',
            'string.length': 'Phone number must be exactly 10 digits long',
            'string.pattern.base': 'Phone number must contain only digits',
        }),
});




