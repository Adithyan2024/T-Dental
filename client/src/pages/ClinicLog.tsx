import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { Eye, EyeOff } from "lucide-react";
import { log } from "console";

export default function ClinicLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    entityType: "",
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

  const handleEntitySelect = (type: string) => {
    setForm((prev) => ({
      ...prev,
      entityType: type,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.entityType) {
      toast({
        title: "Please select an entity type",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/user/login`, {
        ...form,
        role: "400", 
      });

      const { token, id, role, email, isApproved ,status} = response.data;
      localStorage.setItem("userToken", token);
      console.log(response.data)
      dispatch(setUser({ 
        id, 
        email, 
        role, 
        token, 
        entityType: form.entityType,
        isApproved: isApproved || false,
        
      }));

      toast({ title: "Login Successful" });
      setForm({ email: "", password: "", entityType: "" });

      setTimeout(() => {
        if (form.entityType === "clinic") {
          navigate("/clinicdash");
        } else if (form.entityType === "pharmacy" || form.entityType === "lab") {
          if (status==="approved") {
            navigate("/entitydash");
          } else {
            navigate("/pending-approval");
          }
        }
      }, 1000);

    } catch (error) {
      console.log("Login error:", error);
      
      if (error.response?.status === 403 && (form.entityType === "pharmacy" || form.entityType === "lab")) {
        dispatch(setUser({ 
          id: null, 
          email: form.email, 
          role: 400, 
          token: null, 
          entityType: form.entityType,
          isApproved: false
        }));
        
        toast({ 
          title: "Account Pending Approval", 
          description: "Your account is waiting for admin approval."
        });
        
        setTimeout(() => {
          navigate("/pending-approval");
        }, 1000);
        
        return;
      }

      const message =
        error.response?.data?.message || "An unexpected error occurred.";
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">Entity Login</h2>

        {/* Enhanced Entity Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Login as:</label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {["clinic", "pharmacy", "lab"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleEntitySelect(type)}
                className={`py-2 px-2 sm:px-4 rounded-md transition-all duration-200 text-sm sm:text-base ${
                  form.entityType === type
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          // className="mb-4"
        />
        
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
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-700" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-700" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-xs sm:text-sm">
            <Link 
              to="/clinic/forgot-password" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md text-sm sm:text-base"
        >
          Sign in
        </button>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
          <p className="text-gray-600">
            Not registered?{" "}
            <Link 
              to="/clinicreg" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}