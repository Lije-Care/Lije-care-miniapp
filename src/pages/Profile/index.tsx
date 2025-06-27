import { FaUser, FaChild } from "react-icons/fa";
import { MdPersonAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { Modal } from "@telegram-apps/telegram-ui";
import { useState } from "react";
import ParentProfile from "@/components/ParentProfile";
import ChildProfile from "@/components/ChildProfile";
import AccountSettings from "@/components/AccountSetting";
import { Page } from "@/components/Page";

import { useTranslation } from "react-i18next";

export default function ProfileScreen() {
  const navigate = useNavigate();

  const [isParentOpen, setIsParentOpen] = useState(false);
  const [isAccountSettingOpen, setIsAccountSettingOpen] = useState(false);
  const [isChildOpen, setIsChildOpen] = useState(false);

  const { t, i18n } = useTranslation();

  // Language change handler with localStorage persistence
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('user-language', selectedLang);
  };

  return (
    <Page back={true}>
      <div style={{ height: '80vh' }} className="w-full g-gray-900 text-white flex flex-col">

        {/* Profile Header */}
        <div className="flex flex-col items-center p-6">
          <FaUser className="text-6xl" />
          <h2 className="mt-2 text-lg font-semibold">{t("Profile")}</h2>

          {/* Language Switcher */}
          <div className="mt-4">
            <label htmlFor="language-select" className="mr-2 font-medium">{t("Change Language")}:</label>
            <select
              id="language-select"
              value={i18n.language}
              onChange={handleLanguageChange}
              className="rounded-md text-black p-1"
              style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
            >
              <option value="en">{t("English")}</option>
              <option value="am">{t("Amharic")}</option>
            </select>
          </div>
        </div>

        {/* Modals */}
        <Modal open={isParentOpen} onOpenChange={setIsParentOpen}>
          <ParentProfile />
        </Modal>

        <Modal open={isAccountSettingOpen} onOpenChange={setIsAccountSettingOpen}>
          <AccountSettings />
        </Modal>

        <Modal open={isChildOpen} onOpenChange={setIsChildOpen}>
          <ChildProfile />
        </Modal>

        {/* Profile Options */}
        <div style={{ height: '100vh' }} className="bg-gray-500 rounded-t-3xl p-4 flex flex-col gap-4">
          <ProfileOption onClick={() => setIsParentOpen(true)} icon={<FaUser />} label={t("Parent Profile")} />
          <ProfileOption onClick={() => navigate('/children')} icon={<FaChild />} label={t("Child Profile")} />
          <ProfileOption onClick={() => setIsAccountSettingOpen(true)} icon={<MdPersonAdd />} label={t("Account setting")} />
        </div>
      </div>
    </Page>
  );
}

function ProfileOption({ icon, label, onClick }: { icon: any; label: any; onClick: any }) {
  return (
    <div onClick={onClick} className="flex justify-between items-center p-4 border-b border-gray-300 cursor-pointer">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <p className="text-lg font-medium">{label}</p>
      </div>
      <span className="text-gray-500">▶</span>
    </div>
  );
}
