const User = require('../models/User')

const getUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: "Fetched User Data",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(200).json({
            success: false,
            error: "Internal Server Error",
        })
    }
}

const editUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { name, email, phoneNumber, country ,gender} = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phoneNumber, country ,gender},
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ 
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getUser,
    editUser,
}