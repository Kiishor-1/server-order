const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passwordStrengthValidator = require('../utils/passwordStrength');

exports.register = async (req, res) => {
    try {
        const { name, email, password,phoneNumber } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "User Already Exists, Please login to continue",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 16);

        let user = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber:phoneNumber
        });

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "User cannot be registered. Please try again.",
        });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            return res.status(400).json({
                success: false,
                error: `Email cannot be empty`,
            })
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                error: `Password cannot be empty`,
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: `User is not found. Please signup`,
            })
        }

        try {
            passwordStrengthValidator(password);
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id ,tokenVersion: user?.tokenVersion },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            )

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: { _id: user._id, name: user.name, email: user.email ,addresses:user.addresses},
                message: `User Login Success`,
            })
        } else {
            return res.status(401).json({
                success: false,
                error: `Password is incorrect`,
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            error: `Login Failure Please Try Again`,
        })
    }
}

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });

        res.clearCookie("token").status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Logout failure. Please try again.",
        });
    }
};