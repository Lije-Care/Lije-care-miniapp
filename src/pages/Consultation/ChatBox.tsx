import React, { useEffect, useState } from 'react';

import api from '@/api/axios';

import MessageList from './MessageList';
import { Message } from '@/types';
import socket from '@/utils/socket';
import useTelegramUser from '@/hooks/useTelegramUser';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const telegramUser = useTelegramUser();
  const chatRoomId = '2a8692c9-4852-4b41-b8de-f3d377b2247f'; // example
  const currentUserId = telegramUser?.id; // Replace with your logged-in user id

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
      <MessageList messages={messages} currentUserId={currentUserId ?? ''} />
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
