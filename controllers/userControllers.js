import jwt from "jsonwebtoken";
import { sendMail } from "../middlewares/sendMail.js";

export const loginUser = async (req, res) => {
    try {
        const { email } = req.body;

        // Utiliza la API de MongoDB nativa para buscar el usuario en la colección 'users'
        let user = await global.db.collection('users').findOne({ email });

        // Si el usuario no existe, crearlo
        if (!user) {
            const newUser = {
                email,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const result = await global.db.collection('users').insertOne(newUser);

            // Volver a buscar el usuario recién creado con el ID insertado
            user = await global.db.collection('users').findOne({ _id: result.insertedId });
        }

        // Generar un OTP de 6 dígitos
        const otp = Math.floor(Math.random() * 1000000);

        // Crear el token JWT con el usuario y el OTP
        const verifyToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, { expiresIn: "36000000" });

        // Enviar el OTP al correo del usuario
        await sendMail(email, "ChatBot", otp);

        // Responder con un mensaje de éxito y el token de verificación
        res.json({
            message: "OTP enviado correctamente.",
            verifyToken,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { otp, verifyToken } = req.body;

        const verify = jwt.verify(verifyToken, process.env.ACTIVATION_SECRET);

        // Verifica que el OTP no haya expirado
        if (!verify) {
            return res.status(400).json({
                message: "OTP expirado.",
            });
        }

        if (verify.otp !== otp) {
            return res.status(400).json({
                message: "OTP incorrecto."
            });
        }

        // Generar el token JWT con el ID del usuario
        const token = jwt.sign({ _id: verify.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Logeado correctamente",
            user: verify.user, // Asegúrate de enviar solo la información necesaria
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
/*
export const verifyUser = async (req, res) => {
    try {

        const { otp, verifyToken } = req.body;

        const verify = jwt.verify(verifyToken, process.env.ACTIVATION_SECRET);

        if (!verify) {
            return res.status(400).json({
                message: "OTP expirado.",
            })
        }

        if (verify.otp !== otp) {
            return res.status(400).json({
                message: "OTP incorrecto."
            })
        }

        const token = jwt.sign({ _id: verify.user._id }, process.env.JWT_SECRET, { expiresIn: "7d", });

        res.json({
            message: "Logeado correctamente",
            user: verify,
            token,
        })

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
*/
export const myProfile = async (req, res) => {
    try {
        // Usar req.user que ya se ha definido en el middleware isAuth
        const user = req.user;

        // Si necesitas hacer más validaciones, puedes hacerlo aquí
        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        // Devuelve el usuario
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};