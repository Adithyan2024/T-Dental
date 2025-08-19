import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import baseUrl from "../../baseUrl.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";


export default function UserRegister() {
  // const [name, setName] = useState("");
  // const [phone, setPhone] = useState("");
  // const [password, setPassword] = useState("");
  //  const [email, setEmail] = useState("");
   const [form,setForm]=useState({
    name:"",
    phone:"",
    email:"",
    password:""
   })
   const { toast } = useToast();
   const navigate = useNavigate();

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axios.post(`${baseUrl}/api/user/register`, form);
    console.log("user reg successful", response);

    if (response.status === 201) {
      toast({
        title: "🎉 Registration Successful",
        description: "You can now log in with your credentials.",
      });
      setForm({ name: "", phone: "", email: "", password: "" });
    }
     setTimeout(() => {
    navigate("/userlog");
  }, 1000);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      toast({
        title: "❌ Registration Failed",
        description: err.response.data?.message || "Something went wrong on the server.",
        variant: "destructive",
      });
    } else if (err.request) {
      toast({
        title: "🚫 No response from server",
        description: "Please check your network and try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "⚠️ Unexpected Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
    console.error("Registration error:", err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">User Register</h2>
        <Input label="Full Name" type="text" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Phone Number" type="tel" name="phone" value={form.phone} onChange={handleChange} required />
        <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required />

        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded mt-2 hover:bg-green-700">
          Register
        </button>
        <p className="text-sm mt-4 text-center">
          Already registered?{" "}
          <Link to="/userlog" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
