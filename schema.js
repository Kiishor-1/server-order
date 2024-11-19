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
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.required': 'Confirm Password is required',
        'any.only': 'Passwords must match',
    }),
    address: Joi.object({
        location: Joi.string().required().messages({
            'any.required': 'Address location is required',
        }),
        country: Joi.string().required().messages({
            'any.required': 'Country is required',
        }),
    }).required().messages({
        'any.required': 'Address is required',
    }),
});




