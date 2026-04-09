import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import api from '../api';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "I'm your IntelliCar assistant. I can help you with document renewals, finding RTOs/service centers, or getting car recommendations. How can I help today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userMsg, threadId });
      const data = res.data;
      
      if (data.success) {
          if (!threadId) setThreadId(data.threadId);
          setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      } else {
          setMessages(prev => [...prev, { sender: 'bot', text: "Error: " + data.error }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Systems offline. Cannot reach chat endpoint." }]);
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-container-high">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">IntelliBot</h1>
          <p className="text-xs text-secondary tracking-widest uppercase">NLP Processing Active</p>
        </div>
      </div>

      <div className="flex-grow glass-card p-6 overflow-y-auto mb-6 flex flex-col gap-4 border border-outline-variant/10">
        {messages.map((msg, i) => (
          <div key={i} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl p-4 flex gap-3 ${msg.sender === 'user' ? 'bg-primary-gradient text-white rounded-br-none' : 'bg-surface-container-highest text-gray-200 border border-outline-variant/10 rounded-bl-none'}`}>
              <div className="shrink-0 mt-0.5">
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} className="text-primary" />}
              </div>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
             <div className="bg-surface-container-highest py-3 px-5 rounded-2xl rounded-bl-none flex gap-2 items-center">
               <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
               <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '100ms'}}></div>
               <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '200ms'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative mt-auto">
        <input 
          style={{color:"#2C3041",fontWeight:"600"}}
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-full py-4 pl-6 pr-16 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary shadow-glow"
        />
        <button type="submit" disabled={loading} className="absolute right-2 top-2 p-2 rounded-full bg-primary text-surface-lowest hover:bg-primary-container transition-colors disabled:opacity-50">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
