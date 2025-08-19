import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/slice";
import { RootState } from "../../redux/store"; 
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function UserLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        ...form,
        role: "300",
      });

      const { token, id, role, email } = response.data;

      
      localStorage.setItem("userToken", token);

    
      dispatch(setUser({
  id,
  email,
  role,
  token,
  entityType: "user" 
}));

  
      toast({
        title: "Login Successful",
        description: "",
      });
      setForm({ email: "", password: "" });
      setTimeout(() => {
        navigate("/clinicMain");
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
      console.error("Login error:", message);
    }
  };

  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    console.log(" Redux store user state:", user);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">User Login</h2>
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        
        {/* Custom Password Field with Eye Icon */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
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
        </div>

        <div className="text-right mb-3">
          <Link
            to="/user/forgot-password"
            className="text-blue-600 text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mt-2 hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm mt-4 text-center">
          Not registered?{" "}
          <Link to="/userreg" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}