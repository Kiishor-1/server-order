const User = require("../models/User");

const UserAddresses = async (req, res) => {
    try {
        console.log('request')
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            success: true,
            message: "Address fetched",
            data: user.addresses
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message || 'Internal Server Error',
            success:false,
        });
    }
}


const AddAddress = async (req, res) => {
    try {
        const { fullName, phone, cityOrDistrict, state, zip, fullAddress } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({
            error: 'User Not Found',
            success:false,
         });

        const newAddress = {
            fullName,
            phone,
            cityOrDistrict,
            state,
            zip,
            fullAddress,
            isDefault: user.addresses.length === 0, // Set first address as default
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ 
            message: 'Address added successfully', 
            address: newAddress,
            success:true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const UpdateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ 
            error: 'User not found',
            success:false,
        });

        const addressIndex = user.addresses.findIndex(
            (address) => address._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });

        Object.assign(user.addresses[addressIndex], req.body); // Update fields
        await user.save();

        res.status(200).json({ 
            message: 'Address updated successfullyy', 
            address: user.addresses[addressIndex] ,
            success:true,
        });
    } catch (error) {
        res.status(500).json({ 
            error: error.message || 'Internal Server Error',
            success:false,
         });
    }
}


const RemoveAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ 
            error: 'User not found',
            success:false,
        });

        const addressIndex = user.addresses.findIndex(
            (address) => address._id.toString() === req.params.addressId
        );

        if (addressIndex === -1) return res.status(404).json({ message: 'Address not found' });

        const removedAddress = user.addresses[addressIndex];
        user.addresses.splice(addressIndex, 1);

        // Reset default address if the removed address was default
        if (removedAddress.isDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.status(200).json({ 
            message: 'Address removed successfully',
            success:true,
         });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const  SetDefaultAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found', success:false });

        user.addresses.forEach((address) => {
            address.isDefault = address._id.toString() === req.params.addressId;
        });

        await user.save();
        res.status(200).json({ message: 'Default address updated successfully', success:true });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal Server Error', success:false });
    }
}

module.exports = {
    UserAddresses,
    AddAddress,
    UpdateAddress,
    RemoveAddress,
    SetDefaultAddress,
}