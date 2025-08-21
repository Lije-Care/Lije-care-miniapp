import { useState, useEffect } from "react";
import { Button, Modal } from "@telegram-apps/telegram-ui";
import toast from "react-hot-toast";
import api from "@/api/axios";

import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    Telegram?: any;
  }
}
import { useNavigate } from "react-router-dom";
// remove url from here

const AccountSettings = () => {
  const { t } = useTranslation();

  const [isDeleting, setIsDeleting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showChange, setShowChange] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [passwordChangeSuccessMessage, setPasswordChangeSuccessMessage] =
    useState<string | null>();

  const [resetData, setResetData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [changeData, setChangeData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [resetToken, setResetToken] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [telegramId, setTelegramId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserPhone(localUser?.phone ?? "");
    setUserId(localUser?.id ?? "");

    const tgUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user
      ?.id;
    setTelegramId(tgUserId ? String(tgUserId) : "");
  }, []);

  const handleChangeReset = (e: any) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    setResetSuccess(null); // Clear success message on input change
  };

  const handleChangePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setChangeData((prev) => ({ ...prev, [name]: value }));
    setChangeError(null); // Clear error on input change
  };

  const handleForgotPassword = async () => {
    if (!userPhone) {
      toast.error(
        t(
          "Missing phone number. Please ensure your account has a valid phone number."
        )
      );
      return;
    }

    try {
      const res = await api.post("/auth/forget-password", {
        phone: userPhone,
        telegramId: telegramId,
      });

      if (res.status === 201) {
        toast.success(t("OTP sent to your Telegram bot!"));
        setResetToken(res.data?.token ?? "");
        setShowForgot(false);
        setShowReset(true);
      } else {
        toast.error(t("Unexpected response from server. Please try again."));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("Failed to send OTP. Please check your connection.")
      );
    }
  };

  const handleResetPassword = async () => {
    const { otp, password, confirmPassword } = resetData;

    if (!otp) {
      toast.error(t("Please enter the OTP sent to your Telegram."));
      return;
    }

    if (!password || !confirmPassword) {
      toast.error(t("Please fill in both password fields."));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("New password and confirm password don't match."));
      return;
    }

    try {
      const res = await api.post(`auth/reset-password`, {
        token: resetToken,
        otp,
        password,
      });

      setResetSuccess(res.data?.message || t("Password reset successfully!"));
      setResetData({ otp: "", password: "", confirmPassword: "" });
      setResetToken("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("Failed to reset password. Please try again.")
      );
    }
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = changeData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setChangeError(t("Please fill in all password fields."));
      toast.error(t("Please fill in all password fields."));
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError(t("New password and confirm password don't match."));
      toast.error(t("New password and confirm password don't match."));
      return;
    }

    try {
      const res = await api.post(`/auth/change-password`, {
        oldPassword,
        newPassword,
      });

      if (res.status === 200 || res.status === 201) {
        setPasswordChangeSuccessMessage(
          "You have Change password Successfully"
        );

        setShowChange(false);
        setChangeData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setChangeError(null);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      if (errorMessage?.includes("old password")) {
        setChangeError(t("The old password is incorrect. Please try again."));
        toast.error(t("The old password is incorrect. Please try again."));
      } else {
        setChangeError(
          errorMessage || t("Failed to change password. Please try again.")
        );
        toast.error(
          errorMessage || t("Failed to change password. Please try again.")
        );
      }
    }
  };

  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error(t("User ID not found. Please log in again."));
      return;
    }

    try {
      const res = await api.delete(`/users/delete/${userId}`);

      if (res.status === 200) {
        toast.success(t("Account deleted successfully."));
        setIsDeleting(false);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        navigate("/signin");
      } else {
        toast.error(t("Unexpected response from server. Please try again."));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          t("Failed to delete account. Please try again.")
      );
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto text-sm">
      <h2 className="text-lg font-bold mb-4 text-center">
        {t("Account Settings")}
      </h2>
      <p className=" py-1 text-sm font-semibold text-green-400">
        {passwordChangeSuccessMessage}
      </p>

      <Button
        className="w-full mb-3"
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          window.Telegram.WebApp.close();
          navigate("/signin");
        }}
      >
        {t("Log out")}
      </Button>

      <Button className="w-full mb-3" onClick={() => setShowChange(true)}>
        🔐 {t("Change Password")}
      </Button>

      <Button
        className="w-full bg-red-600 text-white"
        onClick={() => setIsDeleting(true)}
      >
        {t("Delete Account")}
      </Button>

      {/* Forgot Password Modal */}
      <Modal open={showForgot} onOpenChange={setShowForgot}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">
            {t("Send OTP to Telegram")}
          </h3>
          <div className="mb-4 text-sm text-gray-600">
            {t("We'll send an OTP to your Telegram using")}:
            <ul className="mt-2 list-disc pl-5 text-xs">
              <li>
                <strong>{t("Phone")}:</strong> {userPhone}
              </li>
              <li>
                <strong>{t("Telegram ID")}:</strong> {telegramId}
              </li>
            </ul>
          </div>
          <Button className="w-full" onClick={handleForgotPassword}>
            📤 {t("Send OTP")}
          </Button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={showReset} onOpenChange={setShowReset}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">
            {t("Reset Password Title")}
          </h3>

          {resetSuccess && (
            <div className="mb-2 text-green-600 text-sm">{resetSuccess}</div>
          )}

          <input
            name="otp"
            placeholder={t("Enter OTP")}
            value={resetData.otp}
            onChange={handleChangeReset}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder={t("New Password")}
            value={resetData.password}
            onChange={handleChangeReset}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder={t("Confirm Password")}
            value={resetData.confirmPassword}
            onChange={handleChangeReset}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />
          <Button className="w-full" onClick={handleResetPassword}>
            ✅ {t("Confirm Reset")}
          </Button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={showChange} onOpenChange={setShowChange}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">
            {t("Change Password")}
          </h3>

          {changeError && (
            <div className="mb-2 text-red-600 text-sm">{changeError}</div>
          )}

          <input
            name="oldPassword"
            type="password"
            placeholder={t("Old Password")}
            value={changeData.oldPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="newPassword"
            type="password"
            placeholder={t("New Password")}
            value={changeData.newPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder={t("Confirm New Password")}
            value={changeData.confirmPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />
          <Button className="w-full" onClick={handleChangePassword}>
            🔐 {t("Change Password")}
          </Button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={isDeleting} onOpenChange={setIsDeleting}>
        <div className="p-4 text-center">
          <p className="mb-4 text-red-600 font-semibold">
            {t("Delete Warning")}
          </p>
          <Button
            className="w-full bg-red-600 text-white mb-2"
            onClick={handleDeleteAccount}
          >
            {t("Yes, Delete My Account")}
          </Button>
          <Button className="w-full" onClick={() => setIsDeleting(false)}>
            {t("Cancel")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSettings;
