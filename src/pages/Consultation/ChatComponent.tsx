'use client';

import {
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalVideoEnabled,
  useVideo,
  selectIsPeerVideoEnabled,
  selectIsPeerAudioEnabled,
  selectIsLocalAudioEnabled,
} from '@100mslive/react-sdk';
import {
  ArrowLeftRightIcon,
  PhoneIcon,
  PhotoIcon,
} from '@100mslive/react-icons';
import { MdVideoCameraFront } from 'react-icons/md';
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa';
import api from '@/api/axios';
import { Modal } from '@telegram-apps/telegram-ui';
import { useEffect, useState } from 'react';
import socket from '@/utils/socket';
import MessageList from './MessageList';
import { Message } from '@/types';
import useTelegramUser from '@/hooks/useTelegramUser';
import { useNavigate } from 'react-router-dom';

const ChatScreen = ({ selectedDoctor }: { selectedDoctor: any }) => {
  const [isParentOpen, setIsParentOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [chatRoomId, setChatRoomId] = useState<string | null>(null);
  const isAudioOn = useHMSStore(selectIsLocalAudioEnabled);
  const telegramUser = useTelegramUser();
  const currentUserId = telegramUser?.id;

  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);
  const peers = useHMSStore(selectPeers);
  
  // 📹 Peer video view
  const PeerView = ({ peer }: { peer: any }) => {
    const { videoRef } = useVideo({ trackId: peer.videoTrack });
    const isVideoEnabled = useHMSStore(selectIsPeerVideoEnabled(peer.id));
    const isAudioEnabled = useHMSStore(selectIsPeerAudioEnabled(peer.id));

    return (
      <div className="relative w-full aspect-video max-w-sm rounded-lg overflow-hidden shadow-lg">
        {isVideoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted={peer.isLocal}
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            <span className="text-lg">{peer.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {peer.name} {peer.isLocal && '(You)'}
        </div>
        {!isAudioEnabled && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            Mic Off
          </div>
        )}
      </div>
    );
  };

  // 🎥 Join/Leave Room
  const joinRoom = async () => {
    const authToken = await hmsActions.getAuthTokenByRoomCode({
      roomCode: 'nzk-qbsn-ppv',
    });
    try {
      await hmsActions.join({
        userName:'Parent',
        authToken,
      });
      setIsParentOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const leaveRoom = async () => {
    await hmsActions.leave();
    setIsParentOpen(false);
  };

  const toggleVideo = async () => {
    console.log(isVideoOn);
    await hmsActions.setLocalVideoEnabled(!isVideoOn);
  };

  // 💬 Send Message via API + Socket
  const sendMessage = async () => {
    console.log('Sending message:', message, chatRoomId, currentUserId);
    if (!message.trim() || !chatRoomId || !currentUserId) return;

    const payload = {
      content: message,
      chatRoomId,
      senderId: currentUserId,
    };

    try {
      const res = await api.post('/chat/message', payload);
      // setMessages((prev) => [...prev, res.data]);
      setMessage('');
      socket.emit('send_message', res.data);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // 🔄 Load/Create ChatRoom
  useEffect(() => {
    const fetchOrCreateChatRoom = async () => {
      if (!telegramUser?.id || !selectedDoctor?.id) return;

      try {
        const res = await api.post('/chat/rooms/find-or-create', {
          parentId: telegramUser.id,
          expertId: selectedDoctor.id,
        });
        setChatRoomId(res.data.id);
      } catch (err) {
        console.error('Failed to load or create chat room:', err);
      }
    };

    fetchOrCreateChatRoom();
  }, [telegramUser?.id, selectedDoctor?.id]);

  // 🧾 Fetch previous messages
  useEffect(() => {
    if (!chatRoomId) return;

    api
      .get<Message[]>(`/chat/room/${chatRoomId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [chatRoomId]);

  // 📡 Socket message listener
  useEffect(() => {
    socket.on('receive_message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  // 🎯 Cleanup on modal close
  useEffect(() => {
    if (!isParentOpen) {
      leaveRoom();
    }
  }, [isParentOpen]);




 
 const navigate = useNavigate();
  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!isAudioOn);
  };
const handleBack = () => {
    leaveRoom(); // optional cleanup
    navigate(-1); // go back
  };

  return (
     <div className="flex flex-col h-screen w-screen overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 shadow-md">
        <button className="p-2" onClick={handleBack}>
          <ArrowLeftRightIcon className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-semibold text-teal-700">{selectedDoctor?.name}</h2>
        <div className="flex space-x-2">
          <button className="p-2" onClick={joinRoom} disabled={isConnected}>
            <PhoneIcon className="h-6 w-6" />
          </button>
          <button className="p-2" onClick={joinRoom} disabled={!isConnected}>
            <MdVideoCameraFront className="h-6 w-6" />
          </button>
          <button className="p-2 text-red-600" onClick={leaveRoom} disabled={!isConnected}>
            Leave
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto space-y-1 px-4 py-2">
        <MessageList messages={messages} currentUserId={currentUserId ?? ''} />
      </div>

      {/* Input Footer */}
      <div className="p-4 flex items-center gap-2 shadow-md">
        <button className="p-2">
          <FaMicrophone className="h-6 w-6 text-gray-500" />
        </button>
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Write here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="p-2">
          <PhotoIcon className="h-6 w-6 text-gray-500" />
        </button>
        <button className="p-2 text-teal-600" onClick={sendMessage}>
          <FaPaperPlane className="h-6 w-6" />
        </button>
      </div>

      {/* Modal */}
      <Modal open={isParentOpen} onOpenChange={setIsParentOpen}>
        {/* Video UI */}
      </Modal>
    </div>
  );
};

export default ChatScreen;
