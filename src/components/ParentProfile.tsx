import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button, Headline, Input, Spinner } from "@telegram-apps/telegram-ui";
import { FaEdit } from "react-icons/fa";
import { updateParent } from "@/redux/slices/itemSlice";
import type { ParentInfo } from "@/types";
import useTelegramUser from "@/hooks/useTelegramUser";
import axios from "axios";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ParentProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const parentState = useSelector((state: RootState) => state.parent);
  const parent = parentState?.parent as unknown as ParentInfo;

  const [formData, setFormData] = useState<ParentInfo>({
    firstName: parent?.firstName || "",
    lastName: parent?.lastName || "",
    phone: parent?.phone || "",
    address: parent?.address || "",
    city: parent?.city || "",
    telegram_username: parent?.telegram_username || "",
    avatarUrl: parent?.avatarUrl || "https://lije-care-api-dev.zikollab.com/uploads/images/PROFILE/default-avatar.png",
    email: parent?.email || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const telegramUser = useTelegramUser();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Client-side validation
  if (file.size > MAX_FILE_SIZE) {
    setImageError("Image must be smaller than 10MB.");
    return;
  }

  setImageError("");
  setUploading(true);

  const formDataImage = new FormData();
  formDataImage.append("image", file);
  formDataImage.append("type", "PROFILE");

  try {
    const token = localStorage.getItem("access_token") || "";
    const response = await axios.post(
      "https://lije-care-api-dev.zikollab.com/api/v1/file-upload/upload-image",
      formDataImage,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const imageUrl = response?.data?.url;
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: `https://lije-care-api-dev.zikollab.com/uploads/images/PROFILE${imageUrl}`,
      }));
    }
  } catch (error: any) {
    // Server-side error handling
    if (axios.isAxiosError(error) && error.response) {
      const serverMessage = error.response.data?.message?.[0] || "Image upload failed.";
      
      // Optional: Convert numeric size message to readable text
      const maxSizeMatch = serverMessage.match(/Maximum file size is (\d+)/);
      if (maxSizeMatch) {
        const readableSize = (parseInt(maxSizeMatch[1]) / (1024 * 1024)).toFixed(1);
        setImageError(`Image too large. Max size allowed is ${readableSize}MB.`);
      } else {
        setImageError(serverMessage);
      }
    } else {
      setImageError("Failed to upload image. Please try again.");
    }
  } finally {
    setUploading(false);
  }
};


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(
        updateParent({
          updatedParent: formData,
          userID: telegramUser?.id ?? "",
        })
      );
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

        {/* 👤 Avatar Upload */}
        <div className="flex flex-col items-center my-4 gap-2">
          <img
            src={formData.avatarUrl}
            alt="Parent Avatar"
            className="w-24 h-24 rounded-full border object-cover"
          />

          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600"
              />
              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
              {uploading && <Spinner size="s" />}
            </>
          )}
        </div>

        {/* 📝 Form / Info View */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {[
              "firstName",
              "lastName",
              "phone",
              "address",
              "city",
              "telegram_username",
              "email",
            ].map((field) => (
              <Input
                key={field}
                type="text"
                name={field}
                value={(formData as any)[field]}
                onChange={handleChange}
                placeholder={field.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())}
              />
            ))}

            <div className="flex justify-between">
              <Button type="submit" className="w-full mr-2">
                {loading ? <Spinner size="s" /> : "Save"}
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} className="w-full ml-2">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 text-gray-700 mt-4">
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
            <span className="font-medium">Telegram:</span>
            <span>{parent?.telegram_username || "N/A"}</span>
          </div>
        )}

        {loading && !isEditing && (
          <div className="flex justify-center items-center h-16">
            <Spinner size="l" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProfile;
