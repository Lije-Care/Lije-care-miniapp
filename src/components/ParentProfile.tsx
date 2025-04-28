import { useState, ChangeEvent, FormEvent } from "react";
import {  useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button, Headline, Input, Spinner } from "@telegram-apps/telegram-ui";
import { FaEdit } from "react-icons/fa";
import { updateParent } from "@/redux/slices/itemSlice";

import type { ParentInfo } from "@/types"; // Adjust the import path to where you define types
import useTelegramUser from "@/hooks/useTelegramUser";

const ParentProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const parentState = useSelector((state: RootState) => state.parent);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const parent = parentState?.parent as unknown as ParentInfo;

  const [formData, setFormData] = useState<ParentInfo>({
    firstName: parent?.firstName || "",
    lastName: parent?.lastName || "",
    phone: parent?.phone || "",
    address: parent?.address || "",
    city: parent?.city || "",
    telegram_username: parent?.telegram_username || "",
    avatarUrl: parent?.avatarUrl || "https://i.pravatar.cc/150",
    email: parent?.email || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const telegramUser= useTelegramUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
    //  const response =  await dispatch(updateParent({formData, telegramUser?.id}));
     
     const response = await dispatch(updateParent({ 
      updatedParent: formData, 
      userID: telegramUser?.id ?? '' 
    }));
    // console.log(response);

    
    } finally {
      setLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="shadow-lg rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <FaEdit size={20} />
        </button>

        <Headline style={{ textAlign: "center" }}>Parent Profile</Headline>

        <div className="flex justify-center my-4">
          <img src={formData.avatarUrl} alt="Parent Avatar" className="w-24 h-24 rounded-full border" />
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {["avatarUrl", "firstName", "lastName", "phone", "address", "city", "telegram_username", "email"].map((field) => (
              <Input
                key={field}
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                placeholder={field.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
                className="border p-2 rounded"
              />
            ))}
            <div className="flex justify-between">
              <Button type="submit" className="bg-blue-500 text-white p-2 rounded">Save</Button>
              <Button type="button" onClick={() => setIsEditing(false)} className="bg-gray-400 text-white p-2 rounded">Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 text-gray-700">
            <span className="font-medium">Parent Name:</span>
            <span>{parent?.firstName} {parent?.lastName}</span>
            <span className="font-medium">Mobile No:</span>
            <span>{parent?.phone || "N/A"}</span>
            <span className="font-medium">Email:</span>
            <span>{parent?.email || "N/A"}</span>
            <span className="font-medium">Address:</span>
            <span>{parent?.address || "N/A"}</span>
            <span className="font-medium">City:</span>
            <span>{parent?.city || "N/A"}</span>
            <span className="font-medium">Telegram username:</span>
            <span>{parent?.telegram_username || "N/A"}</span>
          </div>
        )}

        {loading && <div className="flex justify-center items-center h-20"><Spinner size="l" /></div>}
      </div>
    </div>
  );
};

export default ParentProfile;
