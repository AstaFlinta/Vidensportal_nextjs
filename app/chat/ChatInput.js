"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "../Button.js";
import { Input } from "../Input.js";
import { Bot, Send, User, Trash2, Plus, Settings } from 'lucide-react'; // Importing necessary icons
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default function GreenOrangeChat() {
  const initialMessages = [
    { id: 1, text: "Hej! Hvordan kan jeg hjælpe dig?", sender: "bot" },
  ];

  const [messages, setMessages] = useState(initialMessages); // Setting initial messages
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef(null);

  // useEffect to generate session ID
  useEffect(() => {
    const generateSessionId = () => `session-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(generateSessionId());
  }, []);

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: "user" };
      setMessages((prev) => [...prev, newMessage]); // Add user message to messages

      const tempInput = inputText; // Store the user's input before clearing
      setInputText(""); // Clear the input field after storing

      try {
        const response = await axios.post('http://localhost:8000/process_query', {
          query: tempInput, // Use stored input text
          session_id: sessionId,
        });

        const botResponse = { id: Date.now() + 1, text: response.data.response, sender: "bot" };
        setMessages((prev) => [...prev, botResponse]); // Add bot response to messages
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 2, text: "Sorry, there was an error processing your request.", sender: "bot" },
        ]);
      }
    }
  };

  const handleReset = () => {
    setMessages(initialMessages); // Reset to initial bot message
    setInputText(""); // Clear the input field
  };

  return (
    <div className="flex h-screen bg-green-50 mt-10">
      {/* Sidebar */}
      <div className="w-64 bg-[#e5e0de] p-4 flex flex-col shadow-md">
        <Button
          onClick={handleReset}
          className="mb-4 flex items-center justify-start bg-[#24611b] hover:bg-[#e76c35] text-white transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" /> Ny chat
        </Button>

        {/* Place the Explanation Text Here */}
        <div className="text-sm font-medium text-gray-500 mb-2">
          <h2 className="font-bold">Hvad er en RAG chatbot?</h2>
          <p>En RAG chatbot kombinerer retrieval og generationsteknikker for at give præcise og kontekstrelevante svar.</p>
          <p>Den søger information fra et databibliotek og bruger det til at generere meningsfulde svar, der kan hjælpe brugeren effektivt.</p>
        </div>

        <div className="mt-auto">
          <Button variant="ghost" className="flex w-full justify-start items-center text-gray-700 hover:bg-[#e76c35] hover:text-white transition-colors duration-200">
            <Settings className="w-4 h-4 mr-2" /> Indstillinger
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="bg-[#24611b] text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">ChatBot Assistant</h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-[#e5e0de] text-gray-800' : 'bg-green-100 text-gray-800'}`}>
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="w-4 h-4 mr-2" />
                  ) : (
                    <User className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">{message.sender === 'user' ? 'Dig' : 'ChatBot'}</span>
                </div>
                <div className="prose">
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-xl font-bold leading-none" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold leading-none" {...props} />, // Adjust h2
                            h3: ({ node, ...props }) => <h3 className="text-base font-medium leading-none" {...props} />,
                        }}>
                        {message.text}
                    </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Reference for scrolling */}
        </div>

        <div className="p-4 border-t border-green-200 bg-white flex flex-col space-y-2">
          {/* Trash Bin for Reset */}
          <div className="flex justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              size="icon"
              className="bg-white hover:bg-gray-100"
              aria-label="Reset chat"
            >
              <Trash2 className="w-4 h-4 text-gray-500" />
            </Button>
          </div>

          <form onSubmit={handleSend}>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Skriv din besked..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(e)} // Ensure event is passed
                className="flex-1"
              />
              <Button onClick={handleSend} className="bg-[#24611b] hover:bg-[#e76c35] text-white transition-colors duration-200">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}