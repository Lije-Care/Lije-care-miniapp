import {
  Button,
  Headline,
  Input,
  Section,
  Text,
  Modal,
} from "@telegram-apps/telegram-ui";
import { useState, useEffect } from "react";
import "./sign-in-page.css";
import { Page } from "@/components/Page";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const SignInPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [forgotPhone, setForgotPhone] = useState(""); // ✅ Separate phone field
  const [telegramId, setTelegramId] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [resetData, setResetData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const tgUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user
      ?.id;
    if (tgUserId) setTelegramId(tgUserId.toString());
  }, []);

  const validatePhone = (value: string) => /^\+2519\d{8}$/.test(value);

  const signin = async () => {
    setError("");

    if (!validatePhone(phone)) {
      setError("Phone must start with +2519 and be 12 digits.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/signin", { phone, password });

      const { access_token, refresh_token, data } = response.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validatePhone(forgotPhone)) {
      toast.error("Enter a valid phone number starting with +2519...");
      return;
    }

    try {
      const res = await api.post("/auth/forget-password", {
        phone: forgotPhone,
        telegramId: telegramId || "359880861",
      });

      if (res.status === 201) {
        toast.success("OTP sent to your Telegram bot.");
        setResetToken(res.data?.token || "");
        setShowForgotModal(false);
        setShowResetModal(true);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async () => {
    const { otp, password, confirmPassword } = resetData;

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await api.post("/auth/reset-password", {
        token: resetToken,
        otp,
        password,
      });

      toast.success(res.data?.message || "Password reset successfully.");
      setResetData({ otp: "", password: "", confirmPassword: "" });
      setResetToken("");
      setShowResetModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <Page back={true}>
      <Section
        style={{
          padding: "20px",
          borderRadius: "20px",
          height: "100vh",
          margin: "auto",
        }}
      >
        <div style={{ padding: "20px", borderRadius: "20px" }}>
          <Headline style={{ margin: "40px 20px" }}>Sign In</Headline>

          <Section>
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+2519XXXXXXXX"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="******"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <Text style={{ color: "red", marginTop: "10px" }}>{error}</Text>
            )}

            <Text
              className="forgot-password"
              style={{ marginTop: "10px", cursor: "pointer" }}
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </Text>

            <Text
              onClick={() => navigate("/onboarding")}
              className="forgot-password"
              style={{ marginTop: "10px", cursor: "pointer" }}
            >
              Don’t have an account? Sign up
            </Text>

            <Button
              size="l"
              stretched
              className="signin-button"
              style={{ marginTop: "40px" }}
              onClick={signin}
              color="primary"
              loading={loading}
            >
              Sign In
            </Button>
          </Section>
        </div>
      </Section>

      {/* Forgot Password Modal */}
      <Modal open={showForgotModal} onOpenChange={setShowForgotModal}>
        <div className="p-4">
          <Headline style={{ marginBottom: "12px" }}>
            📩 Forgot Password
          </Headline>
          <Text className="text-sm text-gray-600 mb-2">
            Enter your phone number to receive a reset OTP via Telegram.
          </Text>

          <Input
            placeholder="+251912345678"
            value={forgotPhone}
            onChange={(e) => setForgotPhone(e.target.value)}
          />

          <Button
            onClick={handleForgotPassword}
            stretched
            style={{ marginTop: "16px" }}
          >
            Send OTP
          </Button>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={showResetModal} onOpenChange={setShowResetModal}>
        <div className="p-4">
          <Headline style={{ marginBottom: "12px" }}>
            🔐 Reset Password
          </Headline>

          <Input
            name="otp"
            placeholder="Enter OTP"
            value={resetData.otp}
            onChange={handleResetChange}
            className="mb-2"
          />
          <Input
            name="password"
            type="password"
            placeholder="New Password"
            value={resetData.password}
            onChange={handleResetChange}
            className="mb-2"
          />
          <Input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={resetData.confirmPassword}
            onChange={handleResetChange}
            className="mb-2"
          />
          <Button onClick={handleResetPassword} stretched>
            Confirm Reset
          </Button>
        </div>
      </Modal>
    </Page>
  );
};

export default SignInPage;
