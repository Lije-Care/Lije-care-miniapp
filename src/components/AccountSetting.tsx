import { useState, useEffect } from 'react';
import { Button, Modal } from '@telegram-apps/telegram-ui';
import toast from 'react-hot-toast';
import api from '@/api/axios';
import axios from 'axios';

const BASE_URL = 'https://lije-care-api-dev.zikollab.com/api/v1';

const AccountSettings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showChange, setShowChange] = useState(false); // ✅ NEW

  const [resetData, setResetData] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [changeData, setChangeData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [resetToken, setResetToken] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUserPhone(localUser?.phone ?? '');
    setUserId(localUser?.id ?? '');

    const tgUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    setTelegramId(tgUserId ? String(tgUserId) : '');
  }, []);

  const handleChangeReset = (e: any) => {
    const { name, value } = e.target;
    setResetData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setChangeData(prev => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async () => {
    if (!userPhone) {
      toast.error('Missing phone number.');
      return;
    }

    try {
      const res = await api.post('/auth/forget-password', {
        phone: userPhone,
        telegramId: telegramId,
      });

      if (res.status === 201) {
        toast.success('OTP sent to your Telegram bot!');
        setResetToken(res.data?.token ?? '');
        setShowForgot(false);
        setShowReset(true);
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleResetPassword = async () => {
    const { otp, password, confirmPassword } = resetData;

    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token: resetToken,
        otp,
        password,
      });

      toast.success(res.data?.message || 'Password reset successfully');
      setShowReset(false);
      setResetData({ otp: '', password: '', confirmPassword: '' });
      setResetToken('');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to reset password.');
    }
  };

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = changeData;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    try {
      const res = await api.post(`/auth/change-password`, {
        oldPassword,
        newPassword,
      });

      toast.success(res.data?.message || 'Password changed successfully');
      setShowChange(false);
      setChangeData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("User ID not found.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/users/delete/${userId}`);
      toast.success("Account deleted successfully.");
      localStorage.clear();
      window.Telegram.WebApp.close();
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

      <Button className="w-full mb-3" onClick={() => setShowChange(true)}>
        🔐 Change Password
      </Button>

      <Button className="w-full bg-red-600 text-white" onClick={() => setIsDeleting(true)}>
        🗑️ Delete Account
      </Button>

      {/* Forgot Password Modal */}
      <Modal open={showForgot} onOpenChange={setShowForgot}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">Send OTP to Telegram</h3>
          <div className="mb-4 text-sm text-gray-600">
            We'll send an OTP to your Telegram using:
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

      {/* Change Password Modal */}
      <Modal open={showChange} onOpenChange={setShowChange}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3 text-center">🔁 Change Password</h3>

          <input
            name="oldPassword"
            type="password"
            placeholder="Old Password"
            value={changeData.oldPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            value={changeData.newPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-2 px-3 py-2 border rounded-md"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            value={changeData.confirmPassword}
            onChange={handleChangePasswordChange}
            className="w-full mb-4 px-3 py-2 border rounded-md"
          />
          <Button className="w-full" onClick={handleChangePassword}>
            🔐 Change Password
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
