import React, { useState } from "react";
import "./ChatSection.css";

const ChatSection = () => {
  const [messages, setMessages] = useState([
    {
      sender: "S",
      text: "What's the time complexity of a binary search tree?",
      time: "10:45 AM",
    },
    {
      sender: "Z",
      text: "It's O(log n) for balanced trees, but O(n) if unbalanced.",
      time: "10:46 AM",
    },
    {
      sender: "S",
      text: "Can anyone explain how a hash table handles collisions?",
      time: "10:50 AM",
    },
    {
      sender: "Z",
      text: "Chaining and open addressing are common methods for handling collisions.",
      time: "10:50 AM",
    },
    {
      sender: "M",
      text: "Which is better for sorting: merge sort or quicksort?",
      reply: "",
      time: "11:00 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          sender: "You",
          text: newMessage,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-section">
      <div className="chat-header">
        <h3>Team AlgoSkool</h3>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            className={`message ${
              msg.sender === "You" ? "message-sent" : "message-received"
            }`}
            key={index}
          >
            <div className="sender-avatar">{msg.sender[0]}</div>
            <div className="message-text">
              <p>{msg.text}</p>
              <span className="message-time">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-div">
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        <button className="send-btn" onClick={handleSend}>
          <img
            src="https://img.icons8.com/?size=100&id=100004&format=png&color=000000"
            width="25em"
            height="25rem"
          />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
