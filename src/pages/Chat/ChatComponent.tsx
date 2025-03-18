import { useState } from "react";
import { IoSearch, IoMic, IoHome, IoChatbubble, IoPerson } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import docIcon1 from "@/assets/images/docicon1.png";
import docIcon2 from "@/assets/images/docicon2.png";
import docIcon3 from "@/assets/images/docicon3.png";
import docIcon4 from "@/assets/images/docicon4.png";
const doctors = [
  { name: "Dr. Tomas", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon1, unread: 2, active: true },
  { name: "Dr. Nahom", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon2, unread: 0, active: true },
  { name: "Dr. Kasu", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon3, unread: 0, active: true },
  { name: "Dr. Dagim", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon1, unread: 2, active: true },
  { name: "Dr. Wale", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon2, unread: 0, active: true },
  { name: "Dr. Tedu", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon3, unread: 0, active: true },
  { name: "Dr. Andargachew", message: "Worem consectetur adipiscing elit.", time: "12:50", img: docIcon1, unread: 2, active: true },
  
];

const ChatComponent = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col text-white">
      {/* Header */}
      {/* <div className="p-4 bg-[#001d2b] flex items-center justify-between">
        <h1 className="text-lg font-bold flex items-center">
          <span className="mr-2">💬</span> LIJE CARE
        </h1>
        <button className="text-white">⚙️</button>
      </div> */}

      {/* Title */}
      <h2 className="text-center text-lg text-cyan-400 my-2">Message</h2>

      {/* Search */}
      <div className="relative px-4">
        <input
          type="text"
          placeholder="Search a Doctor"
          className="w-full p-2 pl-10 pr-10 bg-gray-600 rounded-md outline-none text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IoSearch className="absolute left-6 top-3 text-gray-300 text-lg" />
        <IoMic className="absolute right-6 top-3 text-gray-300 text-lg" />
      </div>

      {/* Active Now */}
      <div className="px-4 mt-4">
        <h3 className="text-lg">Active Now</h3>
        <div className="overflow-x-auto whitespace-nowrap mt-2 scrollbar-hide">
  <div className="flex space-x-3">
    {doctors.map((doc, index) => (
      <div key={index} className="relative flex-shrink-0">
        <img 
          src={doc.img} 
          alt={doc.name} 
          className="w-12 h-12 rounded-full border-2 border-white" 
        />
        {doc.active && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#032f48]"></span>
        )}
      </div>
    ))}
  </div>
</div>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 mt-4">
        <h3 className="text-lg">Messages</h3>
        {doctors.map((doc, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3 mt-3 flex items-center justify-between">
            <div className="flex items-center">
              <img src={doc.img} alt={doc.name} className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                <p className="font-bold">{doc.name}</p>
                <p className="text-sm text-gray-300">{doc.message}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">{doc.time}</p>
              {doc.unread > 0 && <span className="bg-cyan-400 text-white text-xs rounded-full px-2 py-1">{doc.unread}</span>}
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
};

export default ChatComponent;
