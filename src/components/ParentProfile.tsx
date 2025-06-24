import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button, Headline, Spinner } from "@telegram-apps/telegram-ui";
import { FaEdit } from "react-icons/fa";
import { updateParent } from "@/redux/slices/itemSlice";
import type { ParentInfo } from "@/types";

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
    email: parent?.email || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const telegramUser = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {[
              { name: "firstName", label: "First Name" },
              { name: "lastName", label: "Last Name" },
              { name: "phone", label: "Phone Number" },
              { name: "address", label: "Address" },
              { name: "city", label: "City" },
              { name: "telegram_username", label: "Telegram Username" },
              { name: "email", label: "Email" },
            ].map(({ name, label }) => (
              <div key={name} className="flex flex-col">
                <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button type="submit" className="w-full sm:w-1/2">
                {loading ? <Spinner size="s" /> : "Save"}
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)} className="w-full sm:w-1/2">
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
            <span className="font-medium">Address:</span>
            <span>{parent?.address || "N/A"}</span>
            <span className="font-medium">City:</span>
            <span>{parent?.city || "N/A"}</span>
            <span className="font-medium">Telegram Username:</span>
            <span>{parent?.telegram_username || "N/A"}</span>
            <span className="font-medium">Email:</span>
            <span>{parent?.email || "N/A"}</span>
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
