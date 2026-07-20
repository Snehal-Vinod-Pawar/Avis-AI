import Conversation from "../model/conversation.model.js";
import Message from "../model/message.model.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("userId",userId);
        const converstation = await Conversation.create({
            userId: userId
        })

        return res.status(200).json(converstation);
    } catch (error) {
        return res.status(500).json({ message: `Create Conversation Error ${error}`});
    }
}

export const getConversations = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        console.log("userId",userId);
        const conversations = await Conversation.find({
            userId: userId
        }).sort({updatedAt: -1});

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ message: `Get Conversations Error ${error}`});
    }
}

export const updateConversation = async (req, res) => {
    try {
        const {id,title} = req.body;
        const conversation = await Conversation.findByIdAndUpdate(id, {
            title
        }, { new: true })

        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: `Update Conversation Error ${error}`});
    }
}

export const saveMessage = async (req, res) => {
    try {
        const {conversationId,role,content} = req.body;
        const message = await Message.create({
            conversationId,
            role,
            content
        })
        return res.status(200).json(message);
    } catch (error) {
        return res.status(500).json({ message: `Save Message Error ${error}`});
    }
}

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        })
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ message: `Get Messages Error ${error}`});
    }
}

