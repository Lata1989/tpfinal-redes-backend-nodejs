import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb"; // Importa correctamente ObjectId

export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Accede al token del encabezado Authorization

        if (!token) {
            return res.status(400).json({
                message: "Acordate de logearte.",
            });
        }

        // Verifica el token y extrae el payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca al usuario directamente en la base de datos usando el ID decodificado
        const user = await global.db.collection('users').findOne({ _id: new ObjectId(decoded._id) });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        req.user = user; // Asigna el usuario encontrado a req.user

        next(); // Continúa con la siguiente función en la cadena de middleware

    } catch (error) {
        res.status(500).json({
            message: "Logeate mostri",
        });
    }
};


/*
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb"; // Asegúrate de importar MongoClient

export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Accede al token del encabezado Authorization

        if (!token) {
            return res.status(400).json({
                message: "Acordate de logearte.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token

        // Busca al usuario directamente en la base de datos
        const user = await global.db.collection('users').findOne({ _id: new MongoClient.ObjectId(decoded._id) });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado.",
            });
        }

        req.user = user; // Asigna el usuario encontrado a req.user

        next(); // Continúa con la siguiente función en la cadena de middleware

    } catch (error) {
        res.status(500).json({
            message: "Logeate mostri",
        });
    }
};
*/