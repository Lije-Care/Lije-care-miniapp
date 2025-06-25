import { useState, useEffect } from 'react';
import { Button, Modal } from '@telegram-apps/telegram-ui';
import toast from 'react-hot-toast';
import api from '@/api/axios';


const AccountSettings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [resetData, setResetData] = useState({
    token: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [userPhone, setUserPhone] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserPhone(localUser?.phone ?? '');
    setUserId(localUser?.id ?? '');

    const tgUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    setTelegramId(tgUserId ?? '');
  }, []);

  const handleChangeReset = (e: any) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async () => {
     console.log('OTP sent to Telegram bot', { phone: userPhone, telegramId });
    if (!userPhone || !telegramId) {
      toast.error('Missing phone number or Telegram ID.');
      return;
    }

    try {
      await api.post(`/auth/forget-password`, {
        phone: userPhone,
        telegramId,
      });
      console.log('OTP sent to Telegram bot');
      toast.success('OTP sent to your Telegram bot!');
      setShowForgot(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleResetPassword = async () => {
    if (resetData.password !== resetData.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: resetData.token,
        otp: resetData.otp,
        password: resetData.password,
      });
      toast.success('Password has been reset successfully!');
      setShowReset(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to reset password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/users/delete?id=${userId}`);
      toast.success("Account deleted successfully.");
      // Optionally clear localStorage and redirect
      localStorage.clear();
      window.Telegram.WebApp.close(); // Closes the Mini App
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete account.");
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto text-sm">
      <h2 className="text-lg font-bold mb-4 text-center">⚙️ Account Settings</h2>

      <Button className="w-full mb-3" onClick={() => setShowForgot(true)}>
        📩 Forgot Password (OTP)
      </Button>

      <Button className="w-full mb-3" onClick={() => setShowReset(true)}>
        🔐 Reset Password
      </Button>

      <Button className="w-full bg-red-600 text-white" onClick={() => setIsDeleting(true)}>
        🗑️ Delete Account
      </Button>

      {/* Forgot Password Modal */}
      <Modal open={showForgot} onOpenChange={setShowForgot}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">Send OTP to Telegram</h3>
          <div className="mb-4 text-sm text-gray-600">
            We’ll send an OTP to your Telegram using:
            <ul className="mt-2 list-disc pl-5 text-xs">
              <li><strong>Phone:</strong> {userPhone}</li>
              <li><strong>Telegram ID:</strong> {telegramId}</li>
            </ul>
          </div>
          <Button className="w-full" onClick={handleForgotPassword}>
            📤 Send OTP
          </Button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={showReset} onOpenChange={setShowReset}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">🔐 Reset Password</h3>

          <input
            name="token"
            placeholder="Reset token"
            value={resetData.token}
            onChange={handleChangeReset}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="otp"
            placeholder="Enter OTP"
            value={resetData.otp}
            onChange={handleChangeReset}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="password"
            type="password"
            placeholder="New Password"
            value={resetData.password}
            onChange={handleChangeReset}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={resetData.confirmPassword}
            onChange={handleChangeReset}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />
          <Button className="w-full" onClick={handleResetPassword}>
            ✅ Confirm Reset
          </Button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={isDeleting} onOpenChange={setIsDeleting}>
        <div className="p-4 text-center">
          <p className="mb-4 text-red-600 font-semibold">
            Are you sure you want to delete your account?
          </p>
          <Button className="w-full bg-red-600 text-white mb-2" onClick={handleDeleteAccount}>
            Yes, Delete My Account
          </Button>
          <Button className="w-full" onClick={() => setIsDeleting(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AccountSettings;
