import { ArrowLeftRightIcon, PhoneIcon, PhotoIcon } from "@100mslive/react-icons";
import { useEffect, useState } from "react";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { MdVideoCameraFront } from "react-icons/md";
import {
  HMSRoomProvider,
  useHMSActions,
  useHMSStore,
  selectIsConnectedToRoom,
  selectPeers,
  selectIsLocalVideoEnabled,
  useVideo,
  selectIsPeerVideoEnabled,
  selectIsPeerAudioEnabled,
} from "@100mslive/react-sdk";
import VideoCall from "./VideoCall";
import Peer from "./VideoCall/Peer";
import { Modal } from "@telegram-apps/telegram-ui";

const messages = [
  { id: 1, text: "Rorem ipsum dolor sit adipiscing elit.", sender: "other" },
  { id: 2, text: "Rorem ipsum dolor sit adipiscing elit.", sender: "me" },
  { id: 3, text: "Rorem adipiscing elit.", sender: "me" },
];

const ChatScreen = () => {
  //  const { videoRef } = useVideo({
  //     trackId: peer.videoTrack,
  //   });
  const [isParentOpen, setIsParentOpen] =useState(false);
  const [chatMessages, setChatMessages] = useState(messages);
  const [message, setMessage] = useState("");
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isVideoOn = useHMSStore(selectIsLocalVideoEnabled);

  const peers = useHMSStore(selectPeers);
  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!isVideoOn);
  };

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

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { id: Date.now(), text: message, sender: "me" }]);
      setMessage("");
    }
  };
 

  const joinRoom = async () => {

    const authToken = await hmsActions.getAuthTokenByRoomCode({
      roomCode: 'nzk-qbsn-ppv',
    });
    
    try {
      await hmsActions.join({
        userName: "Mintesnot",
        authToken,
      });
      setIsParentOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(()=>{
      if(isParentOpen == false)
      {
        leaveRoom()
      }
  },[isParentOpen])

  const leaveRoom = async () => {
    await hmsActions.leave();
  };

  return (
    <div className="flex flex-col " style={{ height: "91vh" }}>
    {/* Header */}

       <Modal
              
              trigger={undefined}
              open={isParentOpen}
              onOpenChange={setIsParentOpen}
          
            >
            
                {/* Video Section */}
                {isConnected && (
                  <div className="p-4">
                    <h3 className="text-center text-lg font-semibold">Call inprogress</h3>
                    <div className="flex flex-wrap justify-center gap-4 p-4">
                      {peers.map((peer) => (
                        <PeerView key={peer.id} peer={peer} />
                      ))}
                    </div>
                  </div>
                )}

                   {/* <ParentProfile/> */}
               
            </Modal>
    <div className="flex items-center justify-between p-4 shadow-md">
      <button className="p-2">
        <ArrowLeftRightIcon className="h-6 w-6" />
      </button>
      <h2 className="text-lg font-semibold text-teal-700">Dr. Tomas</h2>
      <div className="flex space-x-2">
        <button className="p-2" onClick={joinRoom} disabled={isConnected}>
          <PhoneIcon className="h-6 w-6" />
        </button>
        <button className="p-2" onClick={toggleVideo} disabled={!isConnected}>
          <MdVideoCameraFront className={`h-6 w-6 ${isVideoOn ? 'text-green-500' : 'text-gray-500'}`} />
        </button>
        <button className="p-2" onClick={leaveRoom} disabled={!isConnected}>
          Leave
        </button>
      </div>
    </div>

    {/* Chat Body */}
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {chatMessages.length > 0 ? (
        chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-3 rounded-lg ${msg.sender === "me" ? "bg-teal-600 text-white self-end ml-auto" : "bg-gray-200 text-black self-start"}`}
          >
            {msg.text}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 mt-10">No messages yet...</div>
      )}
    </div>

   
    {/* Chat Input */}
    <div className="p-4 flex items-center gap-2 shadow-md">
      <button className="p-2">
        <FaMicrophone className="h-6 w-6 text-gray-500" />
      </button>
      <input
        type="text"
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
        placeholder="Write here"
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
  </div>
  );
};

export default ChatScreen;
