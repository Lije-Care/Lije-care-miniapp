import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Button, Headline, Spinner } from "@telegram-apps/telegram-ui";
import { FaEdit } from "react-icons/fa";
import { updateParent } from "@/redux/slices/itemSlice";
import type { ParentInfo } from "@/types";

import { useTranslation } from "react-i18next";

const ParentProfile = () => {
  const { t } = useTranslation();

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
    avatarUrl: parent?.avatarUrl || "",
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

        <Headline style={{ textAlign: "center" }}>{t("Parent Profile")}</Headline>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {[
              { name: "firstName", label: t("First Name") },
              { name: "lastName", label: t("Last Name") },
              { name: "phone", label: t("Phone Number") },
              { name: "address", label: t("Address") },
              { name: "city", label: t("City") },
              { name: "telegram_username", label: t("Telegram Username") },
              { name: "email", label: t("Email") },
            ].map(({ name, label }) => (
              <div key={name} className="flex flex-col">
                <label
                  htmlFor={name}
                  className="text-sm font-medium text-gray-700 mb-1"
                >
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type="text"
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                  placeholder={`${t("Enter")} ${label.toLowerCase()}`}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button type="submit" className="w-full sm:w-1/2">
                {loading ? <Spinner size="s" /> : t("Save")}
              </Button>
              <Button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-1/2"
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 text-gray-700 mt-4">
            <span className="font-medium">{t("Parent Name")}:</span>
            <span>
              {parent?.firstName} {parent?.lastName}
            </span>
            <span className="font-medium">{t("Mobile No")}:</span>
            <span>{parent?.phone || t("N/A")}</span>
            <span className="font-medium">{t("Address")}:</span>
            <span>{parent?.address || t("N/A")}</span>
            <span className="font-medium">{t("City")}:</span>
            <span>{parent?.city || t("N/A")}</span>
            <span className="font-medium">{t("Telegram Username")}:</span>
            <span>{parent?.telegram_username || t("N/A")}</span>
            <span className="font-medium">{t("Email")}:</span>
            <span>{parent?.email || t("N/A")}</span>
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
