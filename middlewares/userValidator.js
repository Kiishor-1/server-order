const { userSchema } = require('../schema');

const userValidator = async (req, res, next) => {
    try {
        const { error } = userSchema.validate(req.body);

        if (error) {
            const errorMessage = error.details[0].message;
            return res.status(400).json({
                success: false,
                error: errorMessage,
            });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
};

module.exports = userValidator;
