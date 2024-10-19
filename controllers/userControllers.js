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
        const verifyToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, { expiresIn: "360000" });

        // Enviar el OTP al correo del usuario
        await sendMail(email, "ChatBot", otp);

        // Responder con un mensaje de éxito y el token de verificación
        res.json({
            message: "OTP sent to your mail",
            verifyToken,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
