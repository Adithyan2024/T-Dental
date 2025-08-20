import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import baseUrl from "../../baseUrl";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function ClinicRegister() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    location: "",
    numberOfDoctors: "",
    password: "",
  });

  const [entityType, setEntityType] = useState("clinic");
  const [acceptsEMI, setAcceptsEMI] = useState(""); // Changed to string for radio buttons
  const [acceptsInsurance, setAcceptsInsurance] = useState(""); // New state for insurance
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [customSpecialization, setCustomSpecialization] = useState("");
  const [licenseProof, setLicenseProof] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const specializationOptions = [
    { id: "Cardiology", icon: "❤️" },
    { id: "Neurology", icon: "🧠" },
    { id: "Orthopedics", icon: "🦴" },
    { id: "Pediatrics", icon: "👶" },
    { id: "Gynecology", icon: "🤱" },
    { id: "Dermatology", icon: "🩺" },
    { id: "Ophthalmology", icon: "👁️" },
    { id: "Dentistry", icon: "🦷" },
    { id: "Psychiatry", icon: "🧘" },
    { id: "Gastroenterology", icon: "🫄" },
    { id: "Urology", icon: "💧" },
    { id: "Oncology", icon: "🎗️" },
    { id: "Radiology", icon: "📡" },
    { id: "Anesthesiology", icon: "💉" },
    { id: "Emergency", icon: "🚑" },
    { id: "Surgery", icon: "🔬" },
    { id: "Physiotherapy", icon: "🏃" },
    { id: "Trauma", icon: "🩹" },
    { id: "Ayurveda", icon: "🌿" },
    { id: "Homeopathy", icon: "💊" },
    { id: "Pathology", icon: "🔬" },
    { id: "Pulmonology", icon: "🫁" },
    { id: "Endocrinology", icon: "⚖️" },
    { id: "Rheumatology", icon: "🦴" },
     { id: "Others", icon: "➕" }, 
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEntityTypeChange = (type: string) => {
    setEntityType(type);
  };

 const handleSpecializationChange = (specializationId: string) => {
  if (specializationId === "Others") {
    // toggle "Others" selection
    if (specializations.includes("Others")) {
      setSpecializations((prev) => prev.filter((id) => id !== "Others"));
      setCustomSpecialization(""); // reset input when unchecked
    } else {
      setSpecializations((prev) => [...prev, "Others"]);
    }
  } else {
    setSpecializations((prev) =>
      prev.includes(specializationId)
        ? prev.filter((id) => id !== specializationId)
        : [...prev, specializationId]
    );
  }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Clone specializations to avoid mutation
    let finalSpecializations = [...specializations];

    // Replace "Others" with custom text if provided
    if (finalSpecializations.includes("Others")) {
      finalSpecializations = finalSpecializations.filter((s) => s !== "Others");
      if (customSpecialization.trim() !== "") {
        finalSpecializations.push(customSpecialization.trim());
      }
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("address", form.address);
    formData.append("location", form.location);
    formData.append("numberOfDoctors", form.numberOfDoctors);
    formData.append("password", form.password);
    formData.append("specializations", JSON.stringify(finalSpecializations));
    formData.append("entityType", entityType);
    formData.append("acceptsEMI", acceptsEMI);
    formData.append("acceptsInsurance", acceptsInsurance);
    if (licenseProof) formData.append("licenseProof", licenseProof);

    const res = await axios.post(`${baseUrl}/api/clinic/register`, formData);

    console.log("Entity registered:", res.data);
    toast({
      title: "Registration Successful",
      description: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} registration successful`,
    });

    // Reset form
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      location: "",
      numberOfDoctors: "",
      password: "",
    });
    setSpecializations([]);
    setCustomSpecialization("");
    setAcceptsEMI("");
    setAcceptsInsurance("");

    setTimeout(() => {
      navigate("/clinicLog");
    }, 1000);
  } catch (err) {
    console.error("Registration failed:", err.response?.data || err.message);
    toast({
      title: "Registration Failed",
      description: err.response?.data?.message || "Something went wrong",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow w-full max-w-2xl"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Healthcare Provider Registration
        </h2>

        {/* Entity Type Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Select Entity Type</h3>
          <div className="flex flex-wrap gap-4">
            {["clinic", "pharmacy", "lab"].map((type) => (
              <label
                key={type}
                className={`flex items-center px-4 py-2 border rounded cursor-pointer ${
                  entityType === type
                    ? "border-green-500 bg-green-100 text-green-700"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="entityType"
                  value={type}
                  checked={entityType === type}
                  onChange={(e) => handleEntityTypeChange(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder={`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} Name`}
            value={form.name}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
          <input
            type="number"
            name="numberOfDoctors"
            placeholder={entityType === "pharmacy" ? "Number of Pharmacists" : entityType === "lab" ? "Number of Technicians" : "Number of Doctors"}
            value={form.numberOfDoctors}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <textarea
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="location"
          placeholder="City / Location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded mb-4"
        />

        {/* Specializations - Only show for clinic */}
        {entityType === "clinic" && (
       <div className="mb-6">
  <h3 className="text-lg font-medium mb-3">Select Specializations</h3>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {specializationOptions.map((spec) => (
      <label
        key={spec.id}
        className={`flex flex-col items-center p-3 border rounded cursor-pointer ${
          specializations.includes(spec.id)
            ? "border-green-500 bg-green-100"
            : "border-gray-300"
        }`}
      >
        <input
          type="checkbox"
          checked={specializations.includes(spec.id)}
          onChange={() => handleSpecializationChange(spec.id)}
          className="sr-only"
        />
        <span className="text-2xl">{spec.icon}</span>
        <span className="text-sm text-center">{spec.id}</span>
      </label>
    ))}
  </div>

  {/* Show input if "Others" selected */}
  {specializations.includes("Others") && (
    <input
      type="text"
      placeholder="Enter your specialization"
      value={customSpecialization}
      onChange={(e) => setCustomSpecialization(e.target.value)}
      className="mt-3 w-full border p-3 rounded"
    />
  )}
</div>

        )}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload License Proof</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setLicenseProof(e.target.files?.[0] || null)}
            // required
            className="w-full border p-3 rounded"
          />
        </div>

        {/* EMI Payment Option - Changed to Radio Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you accept EMI payments?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="acceptsEMI"
                value="yes"
                checked={acceptsEMI === "yes"}
                onChange={(e) => setAcceptsEMI(e.target.value)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mr-2"
                required
              />
              <span className="font-medium">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="acceptsEMI"
                value="no"
                checked={acceptsEMI === "no"}
                onChange={(e) => setAcceptsEMI(e.target.value)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mr-2"
                required
              />
              <span className="font-medium">No</span>
            </label>
          </div>
        </div>

        {/* Insurance Payment Option - New Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Do you accept Insurance Payments?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="acceptsInsurance"
                value="yes"
                checked={acceptsInsurance === "yes"}
                onChange={(e) => setAcceptsInsurance(e.target.value)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mr-2"
                required
              />
              <span className="font-medium">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="acceptsInsurance"
                value="no"
                checked={acceptsInsurance === "no"}
                onChange={(e) => setAcceptsInsurance(e.target.value)}
                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mr-2"
                required
              />
              <span className="font-medium">No</span>
            </label>
          </div>
        </div>

        {/* Password field with eye toggle */}
        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 pr-10 rounded"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Register {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
        </button>

        <p className="text-sm text-center mt-4">
          Already registered?{" "}
          <Link to="/cliniclog" className="text-green-600 underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}