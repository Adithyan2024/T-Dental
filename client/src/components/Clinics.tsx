import React, { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Building2,
  Pill,
  FlaskConical,
  MapPin,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "redux/store";
import axios from "axios";
import NotificationBell from "./NotificationBell";
import baseUrl from "../../baseUrl";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";
import { decode } from "punycode";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slice";

type TabType = "Clinic" | "Pharmacy" | "Laboratory";
type ViewType = "services" | "consultation" | "pharmacyForm" | "labForm";
type TokenPayload = {
  id: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

interface Clinic {
  _id: string;
  name: string;
  specializations: string[];
  numberOfDoctors: number;
  location: string;
  address: string;
  phone: string;
  entityType?: string;
  acceptsEMI?: boolean;
  acceptsInsurance?: boolean;
}

interface Pharmacy {
  _id: string;
  name: string;
  location: string;
  entityType?: string;
  acceptsEMI?: boolean;
}

interface Laboratory {
  _id: string;
  name: string;
  location: string;
  entityType?: string;
  acceptsEMI?: boolean;
}

interface ServiceData {
  Clinic: Clinic[];
  Pharmacy: Pharmacy[];
  Laboratory: Laboratory[];
}

interface ConsultationFormData {
  fullName: string;
  phoneNumber: string;
  consultationDate: string;
  consultationTime: string;
  purpose: string;
}

interface PharmacyFormData {
  username: string;
  mobile: string;
  doctor: string;
  date: string;
  prescription: File | null;
}

interface LabFormData {
  username: string;
  mobile: string;
  doctor: string;
  date: string;
  prescription: File | null;
}

interface SpecializationOption {
  name: string;
  icon: string;
}

const HealthHubClinicServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("Clinic");
  const [currentView, setCurrentView] = useState<ViewType>("services");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(""); // Add this to store the service ID
  const [consultationFormData, setConsultationFormData] =
    useState<ConsultationFormData>({
      fullName: "",
      phoneNumber: "",
      consultationDate: "",
      consultationTime: "",
      purpose: "",
    });
  const [pharmacyFormData, setPharmacyFormData] = useState<PharmacyFormData>({
    username: "",
    mobile: "",
    doctor: "",
    date: "",
    prescription: null,
  });
  const [labFormData, setLabFormData] = useState<LabFormData>({
    username: "",
    mobile: "",
    doctor: "",
    date: "",
    prescription: null,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fetchedClinics, setFetchedClinics] = useState<Clinic[]>([]);
  const [fetchedPharmacies, setFetchedPharmacies] = useState<Pharmacy[]>([]);
  const [fetchedLaboratories, setFetchedLaboratories] = useState<Laboratory[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const[userDetails,setUserDetails]=useState({});

  // Redux state and API base URL
  const userToken = useSelector((state: RootState) => state.user.token);

  if (userToken) {
    const decoded = jwtDecode<TokenPayload>(userToken);
    console.log("📜 Decoded token payload:", decoded);
    console.log("🆔 Extracted User ID from token:", decoded.id);
    // setUserDetails(decoded)
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Your actual API base URL
  // const token = userToken?.token;

  const serviceData: ServiceData = {
    Clinic: [],
    Pharmacy: [],
    Laboratory: [],
  };

  const specializationOptions: Record<string, SpecializationOption> = {
    cardiology: { name: "Cardiology", icon: "❤️" },
    neurology: { name: "Neurology", icon: "🧠" },
    orthopedics: { name: "Orthopedics", icon: "🦴" },
    pediatrics: { name: "Pediatrics", icon: "👶" },
    gynecology: { name: "Gynecology", icon: "🤱" },
    dermatology: { name: "Dermatology", icon: "🩺" },
    ophthalmology: { name: "Ophthalmology", icon: "👁️" },
    dentistry: { name: "Dentistry", icon: "🦷" },
    psychiatry: { name: "Psychiatry", icon: "🧘" },
    gastroenterology: { name: "Gastroenterology", icon: "🫄" },
    urology: { name: "Urology", icon: "💧" },
    oncology: { name: "Oncology", icon: "🎗️" },
    radiology: { name: "Radiology", icon: "📡" },
    anesthesiology: { name: "Anesthesiology", icon: "💉" },
    emergency: { name: "Emergency", icon: "🚑" },
    surgery: { name: "Surgery", icon: "🔬" },
  };

  const tabs: TabType[] = ["Clinic", "Pharmacy", "Laboratory"];

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "Clinic":
        return <Building2 className="w-5 h-5" />;
      case "Pharmacy":
        return <Pill className="w-5 h-5" />;
      case "Laboratory":
        return <FlaskConical className="w-5 h-5" />;
    }
  };

  const getCurrentItems = (): Clinic[] | Pharmacy[] | Laboratory[] => {
    switch (activeTab) {
      case "Clinic":
        return fetchedClinics.length > 0
          ? fetchedClinics
          : serviceData[activeTab];
      case "Pharmacy":
        return fetchedPharmacies.length > 0
          ? fetchedPharmacies
          : serviceData[activeTab];
      case "Laboratory":
        return fetchedLaboratories.length > 0
          ? fetchedLaboratories
          : serviceData[activeTab];
      default:
        return [];
    }
  };

  const getSectionTitle = (): string =>
    `Available ${
      activeTab === "Clinic"
        ? "Hospitals/Clinics"
        : activeTab === "Pharmacy"
        ? "Pharmacies"
        : "Laboratories"
    }`;

  const handleServiceClick = (service: Clinic | Pharmacy | Laboratory) => {
    console.log("Service selected:", service.name, "ID:", service._id);
    setSelectedService(service.name);
    setSelectedServiceId(service._id); // Store the service ID
    if (activeTab === "Pharmacy") setCurrentView("pharmacyForm");
    else if (activeTab === "Laboratory") setCurrentView("labForm");
    else setCurrentView("consultation");
  };

  const handleBackToServices = () => {
    console.log("Returning to services view");
    setCurrentView("services");
    setSelectedService("");
    setSelectedServiceId(""); // Reset the service ID
    setConsultationFormData({
      fullName: "",
      phoneNumber: "",
      consultationDate: "",
      consultationTime: "",
      purpose: "",
    });
    setPharmacyFormData({
      username: "",
      mobile: "",
      doctor: "",
      date: "",
      prescription: null,
    });
    setLabFormData({
      username: "",
      mobile: "",
      doctor: "",
      date: "",
      prescription: null,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConsultationFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConsultationFormData((prev) => ({
      ...prev,
      consultationDate: value,
      consultationTime: "",
    }));
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    console.log("Time slot selected:", timeSlot);
    setConsultationFormData((prev) => ({
      ...prev,
      consultationTime: timeSlot,
    }));
    setIsDropdownOpen(false);
  };

  // API call function for booking consultation
  const bookConsultationAPI = async (consultationData: any) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/user/consultations`,
        consultationData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast({
        title: "Consultation Booked ✅",
        description: "Your consultation has been successfully booked.",
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error;
      toast({
        title: "Booking Failed ❌",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitConsultation = async () => {
    if (
      !consultationFormData.consultationDate ||
      !consultationFormData.consultationTime
    ) {
      toast({
        description: "Please select both date and time for consultation.",
      });
      return;
    }

    if (
      !consultationFormData.fullName.trim() ||
      !consultationFormData.phoneNumber.trim() ||
      !consultationFormData.purpose.trim()
    ) {
      toast({ description: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      // Combine date and time for the API
      const consultationDateTime = `${consultationFormData.consultationDate} ${consultationFormData.consultationTime}`;

      const consultationData = {
        fullName: consultationFormData.fullName.trim(),
        phoneNumber: consultationFormData.phoneNumber.trim(),
        consultationTime: consultationDateTime,
        purpose: consultationFormData.purpose.trim(),
        service: selectedServiceId, // Send the service ID instead of the name
        serviceType: activeTab, // 'Clinic' or 'Laboratory'
      };

      console.log("Submitting consultation data:", consultationData);

      const response = await bookConsultationAPI(consultationData);

      console.log("Consultation booked successfully:", response);

      toast({
        description: `Consultation request submitted successfully for ${selectedService} on ${formatSelectedDate(
          consultationFormData.consultationDate
        )} at ${
          consultationFormData.consultationTime
        }! Your request is now under admin review.`,
      });

      handleBackToServices();
    } catch (error: any) {
      console.error("Error booking consultation:", error);
      toast({
        title: `Error booking consultation: ${
          error.message || "Please try again later."
        }`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePharmacyInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, files } = e.target;
    if (name === "prescription" && files) {
      setPharmacyFormData((f) => ({ ...f, prescription: files[0] }));
    } else {
      setPharmacyFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmitPharmacy = async () => {
    try {
      if (!pharmacyFormData.prescription) {
        toast({ title: "Please upload a prescription file." });
        return;
      }

      if (!userToken) {
        toast({ description: "User not authenticated" });
        return;
      }
      const formData = new FormData();
      formData.append("prescription", pharmacyFormData.prescription);
      formData.append("doctor", pharmacyFormData.doctor || "");
      formData.append(
        "date",
        pharmacyFormData.date || new Date().toISOString()
      );
      formData.append("service", selectedService || "");
      formData.append("type", "pharmacy");
      formData.append("username", pharmacyFormData.username || "");
      formData.append("mobile", pharmacyFormData.mobile || "");
      formData.append("providerId", selectedServiceId || "");
      // formData.append('notes', pharmacyFormData.notes || '');

      const response = await fetch(`${baseUrl}/api/user/prescriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          description: `✅Prescription uploaded and sent to ${selectedService} successfully!`,
        });
        console.log("Upload response:", data);
        handleBackToServices(); // navigate back
      } else {
        toast({
          description: `❌ Upload failed: ${data.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        description: "❌ An error occurred while uploading the prescription.",
      });
    }
  };

  const handleLabInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "prescription" && files) {
      setLabFormData((f) => ({ ...f, prescription: files[0] }));
    } else {
      setLabFormData((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmitLab = async () => {
    if (!userToken) {
      toast({ title: "User not authenticated" });
      return;
    }

    if (!labFormData.prescription) {
      toast({ title: "Please upload a prescription file." });
      return;
    }

    const formData = new FormData();
    formData.append("prescription", labFormData.prescription);
    formData.append("doctor", labFormData.doctor || "");
    formData.append("date", labFormData.date || new Date().toISOString());
    formData.append("service", selectedService || "");
    formData.append("type", "lab");
    formData.append("username", labFormData.username || "");
    formData.append("mobile", labFormData.mobile || "");
    formData.append("providerId", selectedServiceId || "");
    // formData.append("notes", labFormData.notes || "");

    try {
      const response = await fetch(`${baseUrl}/api/user/prescriptions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          description: `✅ Lab prescription uploaded and sent to ${selectedService} successfully!`,
        });
        handleBackToServices();
      } else {
        toast({
          description: `❌ Upload failed: ${data.message || "Unknown error"}`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        description:
          "❌ An error occurred while uploading the lab prescription.",
      });
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    return maxDate.toISOString().split("T")[0];
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // REAL API FUNCTIONS - Updated to use actual backend endpoints
  const getAllVerifiedClinics = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching clinics...");

      const response = await axios.get(
        `${baseUrl}/api/clinic/approved-clinics`
      );
      console.log("Clinics API response:", response.data);

      // Your API returns clinics directly in the clinics array
      const allClinics = response.data.clinics || [];

      console.log("Fetched clinics:", allClinics);
      console.log("Number of clinics:", allClinics.length);
      setFetchedClinics(allClinics);
    } catch (error) {
      console.error("Error fetching clinics:", error);
      setFetchedClinics([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllPharmacies = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching pharmacies...");

      const response = await axios.get(
        `${baseUrl}/api/clinic/approved-clinics`
      );
      console.log("Pharmacies API response:", response.data);

      // Your API returns pharmacies directly in the pharmacies array
      const allPharmacies = response.data.pharmacies || [];

      console.log("Fetched pharmacies:", allPharmacies);
      console.log("Number of pharmacies:", allPharmacies.length);
      setFetchedPharmacies(allPharmacies);
    } catch (error) {
      console.error("Error fetching pharmacies:", error);
      setFetchedPharmacies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllLaboratories = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching laboratories...");

      const response = await axios.get(
        `${baseUrl}/api/clinic/approved-clinics`
      );
      console.log("Laboratories API response:", response.data);

      // Your API returns laboratories in the 'laboratories' field
      const allLaboratories = response.data.laboratories || [];

      console.log("Fetched laboratories:", allLaboratories);
      console.log("Number of laboratories:", allLaboratories.length);
      setFetchedLaboratories(allLaboratories);
    } catch (error) {
      console.error("Error fetching laboratories:", error);
      setFetchedLaboratories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug function to check API response structure
  const debugAPIResponse = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/clinic/approved-clinics`
      );

      console.log("=== API RESPONSE DEBUG ===");
      console.log("Full response:", response);
      console.log("Response data:", response.data);
      console.log("Response success:", response.data.success);
      console.log("Response message:", response.data.message);

      console.log("=== CLINICS ===");
      console.log("Clinics array:", response.data.clinics);
      console.log("Clinics count:", response.data.clinics?.length || 0);
      if (response.data.clinics?.length > 0) {
        console.log("First clinic:", response.data.clinics[0]);
      }

      console.log("=== LABORATORIES ===");
      console.log("Laboratories array:", response.data.laboratories);
      console.log(
        "Laboratories count:",
        response.data.laboratories?.length || 0
      );
      if (response.data.laboratories?.length > 0) {
        console.log("First laboratory:", response.data.laboratories[0]);
      }

      console.log("=== PHARMACIES ===");
      console.log("Pharmacies array:", response.data.pharmacies);
      console.log("Pharmacies count:", response.data.pharmacies?.length || 0);
      if (response.data.pharmacies?.length > 0) {
        console.log("First pharmacy:", response.data.pharmacies[0]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      console.error("Error response:", error.response);
    }
  };

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);

    // Optional: Enable this for debugging API response structure
    // debugAPIResponse();

    switch (activeTab) {
      case "Clinic":
        getAllVerifiedClinics();
        break;
      case "Pharmacy":
        getAllPharmacies();
        break;
      case "Laboratory":
        getAllLaboratories();
        break;
    }
  }, [activeTab]);
  console.log("🏥 Clinic component rendering...");
  //user logout
  const handleLogout = async () => {
    try {
      if (!userToken) throw new Error("No token found");

      const decoded = jwtDecode<TokenPayload>(userToken);
      if (!decoded?.id) throw new Error("Invalid token");

      // 1. First clear client-side state immediately
      dispatch(clearUser());
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");

      try {
        // 2. Then attempt API logout (fire-and-forget)
        axios
          .post(
            `${baseUrl}/api/user/logout`,
            { userId: decoded.id },
            { headers: { Authorization: `Bearer ${userToken}` } }
          )
          .catch((apiError) => {
            console.warn("Logout API failed (non-critical)", apiError);
          });
      } catch (apiError) {
        console.warn("Logout API failed", apiError);
      }

      // 3. Finally redirect
      navigate("/userlog");
      toast({ title: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      // Ensure cleanup happens even if something failed
      dispatch(clearUser());
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      navigate("/userlog");
      toast({ title: "Logout failed", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <button
          className="fixed top-5 right-20 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 z-10"
          onClick={handleLogout}
        >
          Logout
        </button>
        <NotificationBell />
      </div>

      {currentView === "services" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Health Services
          </h1>

          {/* Tabs with more spacing */}
          <div className="mb-12">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-12">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      console.log("Tab clicked:", tab);
                      setActiveTab(tab);
                    }}
                    className={`flex items-center gap-3 py-3 px-2 border-b-2 font-medium text-base ${
                      activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {getTabIcon(tab)}
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content based on active tab */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              {getSectionTitle()}
            </h2>

            {/* Hospital/Clinic Cards */}
            {activeTab === "Clinic" && (
              <div className="grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 gap-3 min-[400px]:gap-4 md:gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center py-6 min-[400px]:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 min-[400px]:h-8 min-[400px]:w-8 border-b-2 border-blue-600 mx-auto mb-3 min-[400px]:mb-4"></div>
                    <div className="text-xs min-[400px]:text-sm text-gray-600">
                      Loading clinics...
                    </div>
                  </div>
                ) : (getCurrentItems() as Clinic[]).length > 0 ? (
                  (getCurrentItems() as Clinic[]).map((clinic) => (
                    <div
                      key={clinic._id}
                      className="border border-gray-400 rounded-lg p-3 min-[400px]:p-4 md:p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col min-[400px]:flex-row justify-between items-start gap-3 min-[400px]:gap-2 mb-3 min-[400px]:mb-4">
                        <h3 className="text-base min-[400px]:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                          {clinic.name}
                        </h3>
                        <button
                          onClick={() => {
                            console.log("Booking clinic:", clinic.name);
                            handleServiceClick(clinic);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 min-[400px]:px-5 md:px-6 py-1.5 min-[400px]:py-2 rounded-lg text-xs min-[400px]:text-sm font-medium transition-colors w-full min-[400px]:w-auto whitespace-nowrap"
                        >
                          BOOK NOW
                        </button>
                      </div>

                      <div className="mb-3 min-[400px]:mb-4">
                        <h4 className="text-xs min-[400px]:text-sm font-medium text-gray-700 mb-2 min-[400px]:mb-3">
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-1 min-[400px]:gap-2">
                          {clinic.specializations?.map((spec, index) => (
                            <div
                              key={`${spec}-${index}`}
                              className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2 min-[400px]:px-3 py-0.5 min-[400px]:py-1"
                            >
                              <span className="text-[10px] min-[400px]:text-xs font-medium text-blue-700 leading-tight">
                                {spec}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center gap-2 min-[400px]:gap-4 text-xs min-[400px]:text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 min-[400px]:w-4 min-[400px]:h-4 flex-shrink-0" />
                          <span className="truncate">
                            {clinic.numberOfDoctors} Doctors
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 min-[400px]:w-4 min-[400px]:h-4 flex-shrink-0" />
                          <span className="truncate">{clinic.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 min-[400px]:gap-2">
                        {clinic.acceptsEMI && (
                          <span className="bg-green-100 text-green-800 text-[9px] min-[400px]:text-[10px] min-[500px]:text-xs font-medium px-1.5 min-[400px]:px-2 py-0.5 rounded-full">
                            💳 EMI Available
                          </span>
                        )}
                        {clinic.acceptsInsurance && (
                          <span className="bg-blue-100 text-blue-800 text-[9px] min-[400px]:text-[10px] min-[500px]:text-xs font-medium px-1.5 min-[400px]:px-2 py-0.5 rounded-full">
                            🛡️ Insurance Accepted
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 min-[400px]:py-8">
                    <div className="text-gray-500 text-xs min-[400px]:text-sm">
                      {isLoading
                        ? "Loading..."
                        : "No clinics available at the moment"}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Pharmacy List */}
            {activeTab === "Pharmacy" && (
              <div className="space-y-3 min-[350px]:space-y-4">
                {isLoading ? (
                  <div className="text-center py-6 min-[350px]:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 min-[350px]:h-8 min-[350px]:w-8 border-b-2 border-blue-600 mx-auto mb-3 min-[350px]:mb-4"></div>
                    <p className="text-xs min-[350px]:text-sm">
                      Loading pharmacies...
                    </p>
                  </div>
                ) : (getCurrentItems() as Pharmacy[]).length > 0 ? (
                  (getCurrentItems() as Pharmacy[]).map((pharmacy) => (
                    <div
                      key={pharmacy._id}
                      className="flex flex-col min-[350px]:flex-row items-start min-[350px]:items-center justify-between py-3 min-[350px]:py-4 px-4 min-[350px]:px-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="mb-2 min-[350px]:mb-0">
                        <h3 className="text-base min-[350px]:text-lg font-semibold text-gray-900 line-clamp-1">
                          {pharmacy.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs min-[350px]:text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
                          <span className="line-clamp-1">
                            {pharmacy.location}
                          </span>
                        </div>
                        {pharmacy.acceptsEMI && (
                          <span className="bg-green-100 text-green-800 text-[10px] min-[350px]:text-xs font-medium px-1.5 min-[350px]:px-2 py-0.5 rounded-full mt-2 inline-block">
                            💳 EMI Available
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 min-[350px]:gap-3 w-full min-[350px]:w-auto">
                        <button
                          onClick={() => {
                            console.log("Booking pharmacy:", pharmacy.name);
                            handleServiceClick(pharmacy);
                          }}
                          className="w-full min-[350px]:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 min-[350px]:px-6 py-1.5 min-[350px]:py-2 rounded-lg font-medium transition-colors text-xs min-[350px]:text-sm"
                        >
                          BOOK NOW
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 min-[350px]:py-8">
                    <div className="text-gray-500 text-xs min-[350px]:text-sm">
                      {isLoading
                        ? "Loading..."
                        : "No pharmacies available at the moment"}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Laboratory List */}
            {activeTab === "Laboratory" && (
              <div className="space-y-3 min-[350px]:space-y-4">
                {isLoading ? (
                  <div className="text-center py-6 min-[350px]:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 min-[350px]:h-8 min-[350px]:w-8 border-b-2 border-blue-600 mx-auto mb-3 min-[350px]:mb-4"></div>
                    <p className="text-xs min-[350px]:text-sm">
                      Loading laboratories...
                    </p>
                  </div>
                ) : (getCurrentItems() as Laboratory[]).length > 0 ? (
                  (getCurrentItems() as Laboratory[]).map((lab) => (
                    <div
                      key={lab._id}
                      className="flex flex-col min-[350px]:flex-row items-start min-[350px]:items-center justify-between py-3 min-[350px]:py-4 px-4 min-[350px]:px-6 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="mb-2 min-[350px]:mb-0">
                        <h3 className="text-base min-[350px]:text-lg font-semibold text-gray-900 line-clamp-1">
                          {lab.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs min-[350px]:text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
                          <span className="line-clamp-1">{lab.location}</span>
                        </div>
                        {lab.acceptsEMI && (
                          <span className="bg-green-100 text-green-800 text-[10px] min-[350px]:text-xs font-medium px-1.5 min-[350px]:px-2 py-0.5 rounded-full mt-2 inline-block">
                            💳 EMI Available
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 min-[350px]:gap-3 w-full min-[350px]:w-auto">
                        <button
                          onClick={() => {
                            console.log("Booking laboratory:", lab.name);
                            handleServiceClick(lab);
                          }}
                          className="w-full min-[350px]:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 min-[350px]:px-6 py-1.5 min-[350px]:py-2 rounded-lg font-medium transition-colors text-xs min-[350px]:text-sm"
                        >
                          BOOK
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 min-[350px]:py-8">
                    <div className="text-gray-500 text-xs min-[350px]:text-sm">
                      {isLoading
                        ? "Loading..."
                        : "No laboratories available at the moment"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Clinic Consultation Form with Date & Time Picker */}
      {currentView === "consultation" && (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <button
              onClick={handleBackToServices}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={isSubmitting}
            >
              ← Back to Services
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Consultation Details
            </h1>
            <p className="text-gray-600 mb-2">
              Service: <span className="font-medium">{selectedService}</span>
            </p>
            <p className="text-gray-600 mb-8">
              Please provide your information for the consultation.
            </p>

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={consultationFormData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={consultationFormData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Date Selection with Calendar */}
              <div>
                <label
                  htmlFor="consultationDate"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Preferred Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="consultationDate"
                  name="consultationDate"
                  value={consultationFormData.consultationDate}
                  onChange={handleDateChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
                {consultationFormData.consultationDate && (
                  <p className="mt-2 text-sm text-blue-600">
                    Selected:{" "}
                    {formatSelectedDate(consultationFormData.consultationDate)}
                  </p>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Preferred Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      consultationFormData.consultationDate &&
                      setIsDropdownOpen(!isDropdownOpen)
                    }
                    disabled={
                      !consultationFormData.consultationDate || isSubmitting
                    }
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-left flex items-center justify-between ${
                      !consultationFormData.consultationDate || isSubmitting
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={
                        consultationFormData.consultationTime
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    >
                      {consultationFormData.consultationTime ||
                        "Select time slot"}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {!consultationFormData.consultationDate && (
                    <p className="mt-1 text-sm text-gray-500">
                      Please select a date first
                    </p>
                  )}
                  {isDropdownOpen && consultationFormData.consultationDate && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => handleTimeSlotSelect(slot)}
                              disabled={isSubmitting}
                              className="px-3 py-2 text-sm text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none rounded border border-gray-200 hover:border-blue-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Appointment Summary */}
                {consultationFormData.consultationDate &&
                  consultationFormData.consultationTime && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Scheduled for:</strong>{" "}
                        {formatSelectedDate(
                          consultationFormData.consultationDate
                        )}{" "}
                        at {consultationFormData.consultationTime}
                      </p>
                    </div>
                  )}
              </div>

              {/* Purpose */}
              <div>
                <label
                  htmlFor="purpose"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Purpose of Consultation{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={consultationFormData.purpose}
                  onChange={handleInputChange}
                  placeholder="Describe the purpose of your consultation"
                  rows={5}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-gray-400 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleSubmitConsultation}
                  disabled={
                    isSubmitting ||
                    !consultationFormData.fullName.trim() ||
                    !consultationFormData.phoneNumber.trim() ||
                    !consultationFormData.consultationDate ||
                    !consultationFormData.consultationTime ||
                    !consultationFormData.purpose.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Pharmacy Prescription Upload Form */}
      {currentView === "pharmacyForm" && (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <button
              type="button"
              onClick={handleBackToServices}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Services
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Prescription
            </h1>
            <p className="text-gray-600 mb-2">
              Pharmacy: <span className="font-medium">{selectedService}</span>
            </p>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block mb-1 text-gray-700">Username</label>
                <input
                  name="username"
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your name"
                  value={pharmacyFormData.username}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Mobile Number
                </label>
                <input
                  name="mobile"
                  type="tel"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your mobile number"
                  value={pharmacyFormData.mobile}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>

              {/* Prescription upload */}
              <div>
                <label className="block mb-1 font-semibold text-gray-900">
                  Upload Prescription
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <span className="text-lg font-semibold text-gray-800 mb-1">
                    Upload Prescription
                  </span>
                  <span className="text-sm text-gray-400 mb-2">
                    Upload your prescription here
                  </span>
                  <input
                    name="prescription"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePharmacyInputChange}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="px-4 py-2 mt-1 bg-gray-200 rounded cursor-pointer text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Upload
                  </label>
                  {pharmacyFormData.prescription && (
                    <span className="mt-2 text-xs text-green-600">
                      {pharmacyFormData.prescription.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Doctor & Date */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Doctor's Name
                </label>
                <input
                  name="doctor"
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter doctor's name"
                  value={pharmacyFormData.doctor}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">
                  Prescribed Date
                </label>
                <input
                  name="date"
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  value={pharmacyFormData.date}
                  onChange={handlePharmacyInputChange}
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  onClick={handleSubmitPharmacy}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-colors text-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Laboratory Prescription Upload Form */}
      {currentView === "labForm" && (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <button
              type="button"
              onClick={handleBackToServices}
              className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Services
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Upload Lab Test Prescription
            </h1>
            <p className="text-gray-600 mb-2">
              Laboratory: <span className="font-medium">{selectedService}</span>
            </p>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block mb-1 text-gray-700">Username</label>
                <input
                  name="username"
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your name"
                  value={labFormData.username}
                  onChange={handleLabInputChange}
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Mobile Number
                </label>
                <input
                  name="mobile"
                  type="tel"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your mobile number"
                  value={labFormData.mobile}
                  onChange={handleLabInputChange}
                  required
                />
              </div>

              {/* Prescription upload */}
              <div>
                <label className="block mb-1 font-semibold text-gray-900">
                  Upload Lab Test Prescription
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  <span className="text-lg font-semibold text-gray-800 mb-1">
                    Upload Lab Test Prescription
                  </span>
                  <span className="text-sm text-gray-400 mb-2">
                    Upload your lab test prescription here
                  </span>
                  <input
                    name="prescription"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleLabInputChange}
                    className="hidden"
                    id="lab-prescription-upload"
                  />
                  <label
                    htmlFor="lab-prescription-upload"
                    className="px-4 py-2 mt-1 bg-gray-200 rounded cursor-pointer text-gray-700 font-semibold hover:bg-gray-300 transition"
                  >
                    Upload
                  </label>
                  {labFormData.prescription && (
                    <span className="mt-2 text-xs text-green-600">
                      {labFormData.prescription.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Doctor & Date */}
              <div>
                <label className="block mb-1 text-gray-700">
                  Doctor's Name
                </label>
                <input
                  name="doctor"
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter doctor's name"
                  value={labFormData.doctor}
                  onChange={handleLabInputChange}
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-700">
                  Prescribed Date
                </label>
                <input
                  name="date"
                  type="date"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-200"
                  value={labFormData.date}
                  onChange={handleLabInputChange}
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  onClick={handleSubmitLab}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold transition-colors text-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default HealthHubClinicServices;
