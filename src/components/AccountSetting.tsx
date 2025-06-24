// src/components/AccountSettings.tsx
import { useState } from 'react';
import { Button, Modal, Textarea } from '@telegram-apps/telegram-ui';
import { toast } from 'react-hot-toast'; // Optional for better UX

const AccountSettings = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    // Sample API call
    await fakeApi('/api/auth/reset-password', {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    toast.success('Password updated!');
    setShowReset(false);
  };

  const handleForgotPassword = async () => {
    await fakeApi('/api/auth/forgot-password', { email: form.email });
    toast.success('Reset link sent!');
    setShowForgot(false);
  };

  const handleDeleteAccount = async () => {
    await fakeApi('/api/user/delete');
    toast.success('Account deleted');
    // log out or redirect
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto text-sm">
      <h2 className="text-lg font-bold mb-4 text-center">⚙️ Account Settings</h2>

      <Button className="w-full mb-3" onClick={() => setShowReset(true)}>
        🔐 Reset Password
      </Button>

      <Button className="w-full mb-3" onClick={() => setShowForgot(true)}>
        ❓ Forgot Password
      </Button>

      <Button
        className="w-full bg-red-600 text-white"
        onClick={() => setIsDeleting(true)}
      >
        🗑️ Delete Account
      </Button>

      {/* Reset Password Modal */}
      <Modal open={showReset} onOpenChange={setShowReset}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3">Reset Password</h3>
          <Textarea
            // label="Current Password"
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="mb-2 w-full"
          />
          <Textarea
            // label="New Password"
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="mb-2 w-full"
          />
          <Textarea
            // label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mb-4 w-full"
          />
          <Button className="w-full" onClick={handleResetPassword}>
            ✅ Confirm
          </Button>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal open={showForgot} onOpenChange={setShowForgot}>
        <div className="p-4">
          <h3 className="text-md font-semibold mb-3">Forgot Password</h3>
          <Textarea
            // label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mb-4 w-full"
          />
          <Button className="w-full" onClick={handleForgotPassword}>
            📩 Send Reset Link
          </Button>
        </div>
      </Modal>

      {/* Confirm Delete Modal */}
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

// Simulated API function
const fakeApi = (url: string, data?: any) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log('API CALL:', url, data);
      resolve(true);
    }, 1000)
  );
