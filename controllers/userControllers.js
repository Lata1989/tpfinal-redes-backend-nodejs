import { User } from "../models/User.js";

export const loginUer = async (req, res) => {
    try {
        const { email } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};