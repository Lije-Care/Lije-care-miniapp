import React, { useEffect, useState } from 'react';

import api from '@/api/axios';

import MessageList from './MessageList';
import { Message } from '@/types';
import socket from '@/utils/socket';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const chatRoomId = '8b365a37-7c90-4bc5-a45c-6f1d07c8e5df'; // example
  const currentUserId = 'c1ab7fd6-c31e-4921-b101-d77c28784672'; // Replace with your logged-in user id

  // Fetch previous messages
  useEffect(() => {
    api
      .get<Message[]>(`chat/room/${chatRoomId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
     
  }, [chatRoomId]);

  // Listen for new messages
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
      
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = {
      content: input,
      chatRoomId,
      senderId: currentUserId,
    };

    socket.emit('send_message', payload);
    setInput('');
  };

  return (
    <div className="border p-4 w-full max-w-md mx-auto mt-10 rounded shadow-md">
      <MessageList messages={messages} currentUserId={currentUserId} />
      <div className="flex mt-4 gap-2">
        <input
          type="text"
          className="border rounded p-2 flex-grow"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
