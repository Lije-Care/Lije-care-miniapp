import {
  Button,
  Headline,
  Input,
  Section,
  Subheadline,
  Text,
} from "@telegram-apps/telegram-ui";
import { useState } from "react";
import "./sign-in-page.css";
import { Page } from "@/components/Page";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validatePhone = (value: string) => {
    return /^\+2519\d{8}$/.test(value); // Ethiopia mobile pattern
  };

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
      const response = await api.post("/auth/signin", {
        phone,
        password,
      });

      const { access_token, refresh_token, data } = response.data;

      // Store tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect or navigate as needed
      navigate('/'); // Replace with your app's home route
      // window.Telegram.WebApp.close(); // or trigger your app's navigation
    } catch (err: any) {
      setError(err?.response?.data?.message || "Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page back>
      <Section
        style={{
          padding: "20px",
          borderRadius: "20px",
          height: "100vh",
          margin: "auto",
        }}
        
      >
        <div style={{ padding: "20px" , borderRadius: "20px" }}>
        <Headline style={{ margin: "40px 20px" }}>Sign In</Headline>

        <Section >
          <Subheadline>Phone Number</Subheadline>
          <Input
            placeholder="+251912345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />

          <Subheadline>Password</Subheadline>
          <Input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <Text style={{ color: "red", marginTop: "10px" }}>{error}</Text>
          )}

          <Text onClick={()=> navigate('/onboarding')} className="forgot-password" style={{ marginTop: "10px" }}>
             sign up
             
          </Text>

          <Button
            size="l"
            stretched
            className="signin-button"
            style={{ marginTop: "80px" }}
            onClick={signin}
            color="primary"
            loading={loading}
          >
            Sign In
          </Button>
        </Section>
        </div>
      </Section>
    </Page>
  );
};

export default SignInPage;
