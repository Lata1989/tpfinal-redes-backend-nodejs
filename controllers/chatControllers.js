import { MongoClient, ObjectId } from "mongodb";
import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";

// OK en Postman
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const newChat = {
      user: userId,
      latestMessage: "New Chat", // Puedes establecer un mensaje predeterminado si lo deseas
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertar el nuevo chat en la base de datos
    const result = await global.db.collection('chats').insertOne(newChat);
    const chat = { ...newChat, _id: result.insertedId }; // Incluir el ID generado

    res.json(chat);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// OK en Postman
export const getAllChats = async (req, res) => {
  try {
    const chats = await global.db.collection('chats')
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .toArray(); // Convertir el cursor a un array

    res.json(chats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// OK en Postman
export const addConversation = async (req, res) => {
  try {
    const chatId = req.params.id; // Obtiene el ID del chat de los parámetros de la solicitud
    const { question, answer } = req.body; // Desestructura la pregunta y la respuesta del cuerpo de la solicitud

    // Busca el chat en la base de datos usando el ObjectId
    const chat = await global.db.collection('chats').findOne({ _id: new ObjectId(chatId) });

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    const newConversation = {
      chat: chatId,
      question,
      answer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Inserta la nueva conversación en la base de datos
    const result = await global.db.collection('conversations').insertOne(newConversation);
    const conversation = { ...newConversation, _id: result.insertedId }; // Incluye el ID generado

    // Actualiza el chat con el último mensaje
    const updatedChat = await global.db.collection('chats').findOneAndUpdate(
      { _id: new ObjectId(chatId) }, // Cambia aquí también
      { $set: { latestMessage: question, updatedAt: new Date() } },
      { returnDocument: 'after' } // Devuelve el documento actualizado
    );

    res.json({
      conversation,
      updatedChat,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// No funca en postman
// export const addConversation = async (req, res) => {
//   try {
//     const chatId = req.params.id;
//     const { question, answer } = req.body;

//     const chat = await global.db.collection('chats').findOne({ _id: new MongoClient.ObjectId(chatId) });

//     if (!chat)
//       return res.status(404).json({
//         message: "No chat with this id",
//       });

//     const newConversation = {
//       chat: chatId,
//       question,
//       answer,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     // Insertar la nueva conversación en la base de datos
//     const result = await global.db.collection('conversations').insertOne(newConversation);
//     const conversation = { ...newConversation, _id: result.insertedId }; // Incluir el ID generado

//     // Actualizar el chat con el último mensaje
//     const updatedChat = await global.db.collection('chats').findOneAndUpdate(
//       { _id: new MongoClient.ObjectId(chatId) },
//       { $set: { latestMessage: question, updatedAt: new Date() } },
//       { returnDocument: 'after' } // Devuelve el documento actualizado
//     );

//     res.json({
//       conversation,
//       updatedChat,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// OK en Postman
export const getConversation = async (req, res) => {
  try {
    const chatId = req.params.id;

    const conversation = await global.db.collection('conversations')
      .find({ chat: chatId })
      .toArray(); // Convertir el cursor a un array

    if (!conversation.length)
      return res.status(404).json({
        message: "No conversation with this id",
      });

    res.json(conversation);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// OK en Postman
export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id; // Obtiene el ID del chat de los parámetros de la solicitud

    // Busca el chat en la base de datos usando el ObjectId
    const chat = await global.db.collection('chats').findOne({ _id: new ObjectId(chatId) });

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    // Verifica que el usuario que intenta eliminar el chat es el propietario
    if (chat.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    // Elimina el chat de la base de datos
    await global.db.collection('chats').deleteOne({ _id: new ObjectId(chatId) });

    res.json({
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// No funca en Postman
/*
export const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.id;

    const chat = await global.db.collection('chats').findOne({ _id: new MongoClient.ObjectId(chatId) });

    if (!chat)
      return res.status(404).json({
        message: "No chat with this id",
      });

    if (chat.user.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "Unauthorized",
      });

    await global.db.collection('chats').deleteOne({ _id: new MongoClient.ObjectId(chatId) });

    res.json({
      message: "Chat Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
*/