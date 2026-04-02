import Thread from "../models/thread.model.js";
import getGeminiResponse from "../utils/gemini.js";

// @route   POST /api/chat
// @desc    Send a message to the AI and save the conversation thread
export const sendMessage = async (req, res) => {
    try {
        const { threadId, message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: "Message is required" });
        }

        let thread;
        if (threadId) {
            // Find existing thread
            thread = await Thread.findOne({ threadId });
            if (!thread) {
                return res.status(404).json({ success: false, error: "Thread not found" });
            }
        } else {
            // Create anew thread if not provided
            const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            thread = new Thread({ threadId: newThreadId, messages: [] });
        }

        // Add user message
        thread.messages.push({ role: "user", content: message });

        // Get AI response
        const aiResponse = await getGeminiResponse(thread.messages);

        // Add AI response as assistant
        thread.messages.push({ role: "assistant", content: aiResponse });
        thread.updatedAt = Date.now();

        // Save thread in database
        await thread.save();

        res.status(200).json({ 
            success: true,
            threadId: thread.threadId, 
            response: aiResponse,
            messages: thread.messages 
        });

    } catch (error) {
        console.error("Chat Error:", error.message);
        
        let errorMessage = "Internal Server Error";
        if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = "The AI is currently receiving too many requests (Free Tier Limit). Please wait about a minute and try again.";
        }

        res.status(500).json({ success: false, error: errorMessage, details: error.message });
    }
};

// @route   GET /api/chat/:threadId
// @desc    Get chat thread history
export const getThread = async (req, res) => {
    try {
        const { threadId } = req.params;
        const thread = await Thread.findOne({ threadId });
        
        if (!thread) {
            return res.status(404).json({ success: false, error: "Thread not found" });
        }
        
        res.status(200).json({ success: true, thread });
    } catch (error) {
        console.error("Fetch Thread Error:", error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
