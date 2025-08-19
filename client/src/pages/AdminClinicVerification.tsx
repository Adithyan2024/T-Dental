import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Star,
  AlertCircle,
  Building,
  Calendar,
} from "lucide-react";
import { Link ,useNavigate} from "react-router-dom";
import axios from "axios";
import baseUrl from "../../baseUrl";
import { useToast } from "@/hooks/use-toast";


interface ClinicRequest {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  licenseProof?: string;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  urgency: "low" | "medium" | "high";
  mobile?:string;
  date?:string;
  createdAt?:string;
   type: 'lab' | 'clinic'|'pharmacy';
    acceptsEMI?: boolean;
  acceptsInsurance?: boolean;
}

type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "rejected"
  | "under_review";
type UrgencyFilter = "all" | "low" | "medium" | "high";

const ClinicVerificationAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>("all");
  const [emiFilter, setEmiFilter] = useState('all');
  const [insuranceFilter, setInsuranceFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<ClinicRequest | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "documents" | "verification"
  >("details");

  const [clinicRequests, setClinicRequests] = useState([]);
 const { toast } = useToast();
  const navigate = useNavigate();
  const updateRequestStatus = (
    id: string,
    newStatus: "approved" | "rejected" | "under_review"
  ) => {
    setClinicRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: newStatus,
              reviewedBy: "Current Admin",
              reviewedDate: new Date().toISOString().split("T")[0],
            }
          : request
      )
    );
    setShowModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "under_review":
        return <Eye className="w-4 h-4" />;
      case "approved":
        return <Check className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredRequests = clinicRequests.filter(request => {
    const matchesSearch = request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (request.phone && request.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (request.address && request.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    const matchesEmi = emiFilter === 'all' || 
      (emiFilter === 'true' && request.acceptsEMI === true) ||
      (emiFilter === 'false' && request.acceptsEMI === false);
      
    const matchesInsurance = insuranceFilter === 'all' || 
      (insuranceFilter === 'true' && request.acceptsInsurance === true) ||
      (insuranceFilter === 'false' && request.acceptsInsurance === false);
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const getStats = () => {
    const total = clinicRequests.length;
    const pending = clinicRequests.filter(
      (req) => req.status === "pending"
    ).length;
    const under_review = clinicRequests.filter(
      (req) => req.status === "under_review"
    ).length;
    const approved = clinicRequests.filter(
      (req) => req.status === "approved"
    ).length;
    const rejected = clinicRequests.filter(
      (req) => req.status === "rejected"
    ).length;
    return { total, pending, under_review, approved, rejected };
  };

  const stats = getStats();
const normalizeRequest = (item: ClinicRequest, type: string) => {
  return {
    _id: item._id,
    name: item.name || item.name || "N/A",
    email: item.email || "N/A",
    phone: item.phone || item.mobile || "N/A",
    address: item.address || "N/A",
    status: item.status || "pending",
    submittedDate: item.createdAt || item.date || "N/A",
    type,
    licenseProof:item.licenseProof||"N/A",
     acceptsEMI: item.acceptsEMI || false,
    acceptsInsurance: item.acceptsInsurance || false
  };
};


const getAllClinicRequests = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/pending-clinics`);
    const { clinics = [], pharmacies = [], labs = [] } = response.data;
console.log("1212",response.data);

    const combined = [
      ...clinics.map((item) => normalizeRequest(item, "clinic")),
      ...pharmacies.map((item) => normalizeRequest(item, "pharmacy")),
      ...labs.map((item) => normalizeRequest(item, "lab")),
    ];

    // Only update state if data is different
    setClinicRequests((prev) => {
      const prevStr = JSON.stringify(prev);
      const newStr = JSON.stringify(combined);
      return prevStr !== newStr ? combined : prev;
    });
  } catch (error) {
    console.error("Error fetching clinic requests:", error);
    setClinicRequests([]);
  }
};


useEffect(() => {
  let interval: NodeJS.Timeout;

  const startPolling = () => {
    getAllClinicRequests();
    interval = setInterval(() => {
      getAllClinicRequests();
    }, 5000); // Adjust interval as needed
  };

  const stopPolling = () => clearInterval(interval);

  // Start on mount
  startPolling();

  // Pause polling when tab is inactive
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopPolling();
    else startPolling();
  });

  return () => {
    stopPolling();
    document.removeEventListener("visibilitychange", () => {});
  };
}, []);


const updateClinicRequestStatus = async (
  id: string,
  status: "approved" | "rejected",
  type: "clinic" | "pharmacy" | "lab"
) => {
  try {
    const res = await axios.patch(`${baseUrl}/api/admin/verify/${type}/${id}`, { status });
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${status}`,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been ${status} successfully.`,
    });

    await getAllClinicRequests();

    setShowModal(false);
  } catch (err) {
    console.error("Failed to update status:", err);
    toast({
      title: "Error",
      description: err.response?.data?.message || "Failed to update status",
      variant: "destructive",
    });
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo + Title */}
            <div className="flex items-center">
              <div className="w-6 h-6 bg-black rounded-sm mr-3"></div>
              <span className="text-xl font-semibold text-gray-900">
                Tdent Admin
              </span>
            </div>

            {/* Right: Notifications, Dashboard Link, Avatar */}
            <div className="flex items-center space-x-4">
              <Link
                to="/admindash"
                className="text-gray-700 hover:text-gray-900 px-2 py-1 border rounded"
              >
                User Verification
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Clinic Verification
          </h1>
          <p className="text-gray-600 mt-2">
            Review and verify clinic registration requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Under Review
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.under_review}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clinics, email, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) =>
                  setUrgencyFilter(e.target.value as UrgencyFilter)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Priority</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                More Filters
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clinic Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    License Proof
                  </th> */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clinicRequests.map((request,i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {request._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1 mb-1">
                        <Mail className="w-3 h-3" />
                        {request.email}
                      </div>
                      {request.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {request.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.address ? (
                        <div className="text-sm text-gray-900 flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5" />
                          <span>{request.address}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not provided
                        </span>
                      )}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      {request.licenseProof ? (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">
                            {request.licenseProof}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not provided
                        </span>
                      )}
                    </td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(
                          request.urgency
                        )}`}
                      >
                        {request.urgency?.charAt(0).toUpperCase() +
                          request.urgency?.slice(1) || "Unknown"}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status
                          ?.replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          request.status?.replace("_", " ").slice(1) ||
                          "Unknown"}
                      </span>

                      <div className="text-xs text-gray-500 mt-1">
                        {request.submittedDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                          setActiveTab("details");
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No clinic requests found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Detailed Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedRequest.name}
                  </h2>
                  <p className="text-gray-600">Clinic Verification Review</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-8 mt-4">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 text-sm font-medium border-b-2 ${
                    activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Clinic Details
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`pb-2 text-sm font-medium border-b-2 ${
                    activeTab === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab("verification")}
                  className={`pb-2 text-sm font-medium border-b-2 ${
                    activeTab === "verification"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Verification
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Basic Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Clinic Name
                          </p>
                          <p className="text-gray-900">
                            {selectedRequest.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Email
                          </p>
                          <p className="text-gray-900">
                            {selectedRequest.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Phone
                          </p>
                          <p className="text-gray-900">
                            {selectedRequest.phone || "Not provided"}
                          </p>
                        </div>
    
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Location
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Address
                          </p>
                          <p className="text-gray-900">
                            {selectedRequest.address || "Not provided"}
                          </p>
                        </div>
                                              <div>
        <p className="text-sm font-medium text-gray-600">Accepts EMI</p>
        <p className="text-gray-900">
          {selectedRequest.acceptsEMI ? "Yes" : "No"}
        </p>
      </div>

      {/* ✅ Accepts Insurance */}
      <div>
        <p className="text-sm font-medium text-gray-600">
          Accepts Insurance
        </p>
        <p className="text-gray-900">
          {selectedRequest.acceptsInsurance ? "Yes" : "No"}
        </p>
      </div>
                      </div>
                    </div>
                  </div>

                  {/* License Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      License Information
                    </h3>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        License Proof
                      </p>
                      {selectedRequest?.licenseProof ? (
  <img
    src={`${baseUrl}${selectedRequest.licenseProof}`}
    alt="License Proof"
    className="w-40 h-auto rounded shadow"
  />

) : (
  <p className="text-gray-900">Not provided</p>
)}

                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    License Document
                  </h3>

                  <div className="grid grid-cols-1">
                    {selectedRequest.licenseProof ? (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">
                            License Proof
                          </h4>
                          {/* <FileText className="w-5 h-5 text-blue-600" /> */}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Medical license documentation
                        </p>
                        <div className="flex items-center justify-between">
                                              {selectedRequest?.licenseProof ? (
  <img
    src={`${baseUrl}${selectedRequest.licenseProof}`}
    alt="License Proof"
    className="w-40 h-auto rounded shadow"
  />

) : (
  <p className="text-gray-900">Not provided</p>
)}
                          {/* <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button> */}
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-4 text-center">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          No license document provided
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          Document Verification
                        </h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          {selectedRequest.licenseProof
                            ? "Please review the submitted license document carefully before approving."
                            : "No license document provided. Consider if this is acceptable for approval."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "verification" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Verification Checklist
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-gray-700">
                          Clinic name is valid and appropriate
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-gray-700">
                          Email address is valid and reachable
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-gray-700">
                          Phone number confirmed (if provided)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-gray-700">
                          Address verified (if provided)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded mr-3"
                        />
                        <span className="text-gray-700">
                          License documentation reviewed (if provided)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Review Notes
                    </h4>
                    <textarea
                      placeholder="Add any notes or comments about this clinic verification..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                      <div>
                        <h4 className="font-medium text-blue-800">
                          Review Guidelines
                        </h4>
                        <ul className="text-sm text-blue-700 mt-1 space-y-1">
                          <li>
                            • Verify clinic name is professional and appropriate
                          </li>
                          <li>
                            • Confirm email address is valid and belongs to the
                            clinic
                          </li>
                          <li>
                            • Check phone number and address for legitimacy (if
                            provided)
                          </li>
                          <li>• Review license documentation if submitted</li>
                          <li>
                            • Note that license proof is optional but
                            recommended
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Submitted: {selectedRequest.name}
                  {/* {selectedRequest.reviewedBy && (
                    <span className="ml-4">
                      Reviewed by: {selectedRequest.reviewedBy} on{" "}
                      {selectedRequest.reviewedDate}
                    </span>
                  )} */}
                </div>

                {selectedRequest.status === "pending" ||
                selectedRequest.status === "under_review" ? (
                  <div className="flex gap-3">
                    {/* <button
                      onClick={() =>
                        updateRequestStatus(selectedRequest.id, "under_review")
                      }
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Mark Under Review
                    </button> */}
  <button
  onClick={() =>
    updateClinicRequestStatus(
      selectedRequest._id,
      "rejected",
      selectedRequest.type
    )
  }
  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
>
  <X className="w-4 h-4" />
  Reject
</button>

<button
  onClick={() =>
    updateClinicRequestStatus(
      selectedRequest._id,
      "approved",
      selectedRequest.type
    )
  }
  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
>
  <Check className="w-4 h-4" />
  Approve
</button>

                  </div>
                ) : (
                  <div className="text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedRequest.status
                      )}`}
                    >
                      {getStatusIcon(selectedRequest.status)}
                      {selectedRequest.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        selectedRequest.status.replace("_", " ").slice(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicVerificationAdmin;
