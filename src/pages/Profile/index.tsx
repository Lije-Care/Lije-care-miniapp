import { FaUser, FaLock, FaBell, FaChild } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import { IoHomeOutline, IoChatbubbleOutline, IoTimeOutline } from "react-icons/io5";
import { Button, Cell, List, Modal, Placeholder, Text } from "@telegram-apps/telegram-ui";
import { useState } from "react";
import ParentProfile from "@/components/ParentProfile";
import ChildProfile from "@/components/ChildProfile";

export default function ProfileScreen() {
    const [isParentOpen, setIsParentOpen] =useState(false);
    const [isChildOpen, setIsChildOpen] =useState(false);
    const [isNotificationOpen, setIsNotificationOpen] =useState(false);
    const [isAddchildOpen, setIsAddchildOpen] =useState(false);
    
    const [isSettingOpen, setIsSettingOpen] =useState(false);
    
    
    const [isFetching, setIsFetching] = useState(false);


    const fetchAndClose = () => {
        setIsFetching(true);
        setTimeout(() => {
          setIsFetching(false);
          setIsParentOpen(false);
        }, 1000);
      };
  return (
    <div style={{height: '80vh'}} className="w-full g-gray-900 text-white flex flex-col">
      {/* Header */}
      {/* <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-lg font-bold flex items-center">
          <span className="mr-2">👤</span> LIJE CARE
        </h1>
        <div className="flex gap-3">
          <button className="text-gray-400">💬</button>
          <button className="text-gray-400">📞</button>
          <button className="text-gray-400">📹</button>
          <button className="text-gray-400">⚙️</button>
        </div>
      </header> */}

      {/* Profile Section */}
      <div className="flex flex-col items-center  p-6">
        <FaUser className="text-6xl" />
        <h2 className="mt-2 text-lg font-semibold">Profile</h2>
      </div>
      <Modal
          
          trigger={undefined}
          open={isParentOpen}
          onOpenChange={setIsParentOpen}
      
        >
        
           
               <ParentProfile/>
           
        </Modal>

        <Modal
          
          trigger={undefined}
          open={isChildOpen}
          onOpenChange={setIsChildOpen}
      
        >
             <ChildProfile/>
        </Modal>

      {/* Profile Options */}
      <div  style={{height: '100vh'}}  className="bg-gray-500 rounded-t-3xl p-4 flex flex-col gap-4">
        <ProfileOption onClick={() => setIsParentOpen(true)} icon={<FaUser />} label="Parent Profile" />
        <ProfileOption onClick={() => setIsChildOpen(true)} icon={<FaChild />} label="Child Profile" />
        <ProfileOption onClick={() => setIsNotificationOpen(true)} icon={<FaBell />} label="Notification" />
        <ProfileOption onClick={() => setIsSettingOpen(true)} icon={<FaLock />} label="Password & Security" />
        <ProfileOption onClick={() => setIsAddchildOpen(true)} icon={<MdPersonAdd />} label="Add Child Profile" />
      </div>

     
    </div>
  );
}

function ProfileOption({ icon, label, onClick }) {
   
  return (
    <div  onClick={onClick} className="flex justify-between items-center p-4 border-b border-gray-300 cursor-pointer">
      <div  className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <p className="text-lg font-medium">{label}</p>
      </div>
      <span className="text-gray-500">▶</span>
    </div>
  );
}

function NavItem({ icon, active }: {icon: any, active: any}) {
  return (
    <button className={`text-2xl ${active ? "text-blue-400" : "text-gray-400"}`}>{icon}</button>
  );
}
