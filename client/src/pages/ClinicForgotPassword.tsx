import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 
import Input from "../components/Input";
import baseUrl from "../../baseUrl";

export default function ClinicForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    entityType: "",
    otp: "",
    newPassword: "",
  });

  const role = "400"; // Clinic role

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const selectEntity = (type: string) => {
    setForm(prev => ({ ...prev, entityType: type }));
  };

  // Step 1: Request OTP
  const handleRequestOTP = async () => {
    if (!form.email || !form.entityType) {
      toast({ title: "Email & entity type required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/clinic/forgot-password`, {
        email: form.email,
        role,
        entityType: form.entityType,
      });
      toast({ title: "OTP sent to your email" });
      setStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!form.otp) {
      toast({ title: "OTP is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/clinic/verify-otp`, {
        email: form.email,
        role,
        entityType: form.entityType,
        otp: form.otp,
      });
      toast({ title: "OTP verified successfully" });
      setStep(3);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!form.newPassword) {
      toast({ title: "Password is required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseUrl}/api/clinic/reset-password`, {
        email: form.email,
        newPassword: form.newPassword,
        role,
        entityType: form.entityType,
      });
      toast({ title: "Password reset successful" });
      navigate("/cliniclog");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Clinic Forgot Password</h2>

        {/* Step 1: Select entity & email */}
        {step === 1 && (
          <>
            <div className="flex justify-between mb-4">
              {["clinic", "pharmacy", "lab"].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => selectEntity(type)}
                  className={`px-4 py-2 rounded ${
                    form.entityType === type ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <button
              onClick={handleRequestOTP}
              disabled={loading}
              className={`w-full py-2 rounded mt-4 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <Input
              label="Enter OTP"
              type="text"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              required
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className={`w-full py-2 rounded mt-4 ${
                loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Step 3: New Password with eye icon */}
        {step === 3 && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
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
              onClick={handleResetPassword}
              disabled={loading}
              className={`w-full py-2 rounded ${
                loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
              } text-white`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="text-sm mt-4 text-center">
          Remembered?{" "}
          <Link to="/cliniclogin" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
