import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Conectado a MongoDB');
        return client.db('ChatBot');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};