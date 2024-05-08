import React, { useState, useEffect, useRef } from 'react';
import './chatbox.css'; 

function Chatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const userMessage = input.trim();
    if (!userMessage) return;
    setMessages(messages => [...messages, { text: userMessage, sender: 'user' }]);
    setInput('');

    // Simulate a typing indicator
    const botThinking = { text: '...', sender: 'bot' };
    setMessages(messages => [...messages, botThinking]);

    try {
      const response = await fetch('http://localhost:8080/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();

      // Update messages by removing typing indicator and adding bot response
      setMessages(messages => messages.filter(msg => msg.text !== '...').concat({ text: data.response, sender: 'bot' }));
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(messages => messages.filter(msg => msg.text !== '...').concat({ text: 'Error: Could not reach the server.', sender: 'bot' }));
    }
  };

  return (
    <div className="chatbox">
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
            {msg.text}
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chatbox;
