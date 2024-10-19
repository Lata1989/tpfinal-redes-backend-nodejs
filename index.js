import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; // Adaptación de la ruta de la base de datos

// Importar rutas
import userRoutes from './routes/userRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes); // Rutas para usuarios
// app.use('/api/chats', chatRoutes); // Rutas para chats

// Conexión a MongoDB
const startServer = async () => {
    try {
        const db = await connectDB(); // Conectar a MongoDB
        global.db = db; // Guardamos la referencia a la base de datos en un objeto global

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Salir si falla la conexión a la base de datos
    }
};

startServer();


/*
    Link tutorial:

    https://www.youtube.com/watch?v=3nL8e7I_9lo&t

    estoy en: 24:25

*/