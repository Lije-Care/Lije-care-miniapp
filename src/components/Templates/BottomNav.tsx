import { CartIcon, ChatIcon, HomeIcon, PersonIcon } from "@100mslive/react-icons";
import { TabsList } from "@telegram-apps/telegram-ui"
import { useState } from "react";
import { BsWatch } from "react-icons/bs";
import { IoTimeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";


const BottomNav = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("/");

  const tabs = [
    { label: <HomeIcon />, path: "/" },
    { label: <IoTimeOutline />, path: "/meal" },
    { label: <ChatIcon />, path: "/chat" },
    { label: <CartIcon />, path: "/ecommerce" },
    { label: <PersonIcon />, path: "/profile" },
  ];

  return (
    <TabsList
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        height: "7%",
        width: "100%",
        background: "var(--tg-theme-secondary-bg-color, white)",
      }}
    >
      {tabs.map(({ path, label }) => (
        <TabsList.Item
          key={path}
          selected={selected === path}
          onClick={() => {
            setSelected(path);
            navigate(path);
          }}
        >
          <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          {label}
          </div>
        </TabsList.Item>
      ))}
    </TabsList>
  );
};

export default BottomNav;