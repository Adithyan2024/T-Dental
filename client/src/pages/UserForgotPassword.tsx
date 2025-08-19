import { useState } from "react";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const USER_ROLE = 300; // hardcoded role

export default function UserForgotPassword() {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Loading state for buttons
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}/api/user/forgot-password`, {
        email,
        role: USER_ROLE
      });
      setMaskedEmail(res.data.email);
      toast({ title: "OTP sent", description: "Check your email" });
      setStep(2);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/user/verify-otp`, {
        email,
        role: USER_ROLE,
        otp
      });
      toast({ title: "OTP verified", description: "You can now reset password" });
      setStep(3);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Invalid OTP",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/user/reset-password`, {
        email,
        role: USER_ROLE,
        newPassword: password
      });
      toast({ title: "Password reset", description: "You can now log in" });
      window.location.href = "/userlog";
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Password reset failed",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={
          step === 1 ? handleSendOTP :
          step === 2 ? handleVerifyOTP :
          handleResetPassword
        }
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {step === 1 && (
          <>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm mb-2">OTP sent to: <strong>{maskedEmail}</strong></p>
            <label className="block mb-2 text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block mb-2 text-sm font-medium">New Password</label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
