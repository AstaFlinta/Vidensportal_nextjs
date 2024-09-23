
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, Plus, Settings, MessageSquare, Trash2 } from 'lucide-react'

export default function GreenOrangeChat() {
  const initialMessages = [
    { id: 1, text: "Hello! How can I assist you today?", sender: "bot" },
  ]

  const [messages, setMessages] = useState(initialMessages)
  const [inputText, setInputText] = useState("")

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = { id: Date.now(), text: inputText, sender: "user" }
      setMessages([...messages, newMessage])
      setInputText("")
      // Simulate bot response
      setTimeout(() => {
        const botResponse = { id: Date.now() + 1, text: "I'm processing your request. Please give me a moment.", sender: "bot" }
        setMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  const handleNewChat = () => {
    setMessages(initialMessages)
    setInputText("")
  }

  const handleDeleteMessage = (id: number) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  return (
    <div className="flex h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 flex flex-col shadow-md">
        <Button
          onClick={handleNewChat}
          className="mb-4 bg-[#24611b] hover:bg-[#e76c35] text-white transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" /> New chat
        </Button>
        <div className="flex-grow overflow-y-auto">
          <div className="text-sm font-medium text-gray-500 mb-2">Recent chats</div>
          {[1, 2, 3].map((_, index) => (
            <Button key={index} variant="ghost" className="w-full justify-start text-gray-700 hover:bg-[#e76c35] hover:text-white mb-1 transition-colors duration-200">
              <MessageSquare className="w-4 h-4 mr-2" /> Chat {index + 1}
            </Button>
          ))}
        </div>
        <div className="mt-auto">
          <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-[#e76c35] hover:text-white transition-colors duration-200">
            <Settings className="w-4 h-4 mr-2" /> Settings
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <div className="bg-[#24611b] text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">ChatBot Assistant</h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow ${
                  message.sender === 'user'
                    ? 'bg-[#24611b] text-white'
                    : 'bg-green-100 text-gray-800'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'bot' ? (
                    <Bot className="w-4 h-4 mr-2" />
                  ) : (
                    <User className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">
                    {message.sender === 'user' ? 'You' : 'ChatBot'}
                  </span>
                  <Button
                    onClick={() => handleDeleteMessage(message.id)}
                    variant="ghost"
                    size="icon"
                    className="ml-2 text-gray-400 hover:text-[#e76c35] transition-colors duration-200"
                    aria-label="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-green-200 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 border-green-300 focus:border-[#24611b] focus:ring-[#24611b]"
            />
            <Button onClick={handleSend} className="bg-[#24611b] hover:bg-[#e76c35] text-white transition-colors duration-200">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
