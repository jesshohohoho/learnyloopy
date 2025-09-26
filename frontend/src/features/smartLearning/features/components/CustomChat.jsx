import React, { useState, useRef, useEffect } from 'react';
import './CustomChat.css';
import sendIcon from '../../../../assets/sendIcon.png'

const CustomChat = ({ messages, onSendMessage, placeholder = "Type your message..." }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="custom-chat-container">
      {/* Messages Area */}
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-bubble">
              {message.message}
            </div>
            <div className="message-time">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="message-input"
            rows="1"
          />
          <img 
            src={sendIcon} 
            alt="Send" 
            onClick={handleSend}
            className='send-icon'
            style={{
                opacity: inputValue.trim() ? 1 : 0.5, // Fade when disabled
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed'
            }}
        />
        </div>
      </div>
    </div>
  );
};

export default CustomChat;