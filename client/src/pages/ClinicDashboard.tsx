import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from 'redux/store';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slice";
import baseUrl from "../../baseUrl"


interface AdmittedUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  admissionDate: string;
  department: string;
  roomNumber: string;
  doctor: string;
  status: 'admitted' | 'discharged' | 'pending';
  totalBill: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  insurance?: string;
  emergencyContact: string;
  diagnosis: string;
}

interface PaymentLink {
  id: string;
  userId: string;
  amount: number;
  description: string;
  link: string;
  status: 'active' | 'paid' | 'expired';
  createdAt: string;
  expiresAt: string;
}

// Updated interface to match your actual consultation schema
interface PendingRequest {
  _id: string;
  fullName: string;
  phoneNumber: string;
  consultationTime: string;
  purpose: string;
  service: string;
  serviceType: 'Clinic' | 'Laboratory';
  status: 'pending' | 'approved' | 'rejected';
  patientId?: string;
  createdAt: string;
  updatedAt: string;
}

// Updated interface to match your actual API response
interface ApiResponse {
  success: boolean;
  consultations: PendingRequest[]; // Changed from 'requests' to 'consultations'
  count: number;
  message?: string;
}
type TokenPayload = {
  id: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  entityType:string
};
export default function ClinicDashboard() {
  const [admittedUsers, setAdmittedUsers] = useState<AdmittedUser[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<AdmittedUser | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDescription, setPaymentDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
const navigate=useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  // Redux token management
  const clinicToken = useSelector((state: RootState) => state.user.token);
 const decoded = jwtDecode<TokenPayload>(clinicToken);
  console.log("Decoded clinic id",decoded);
  

  useEffect(() => {
    fetchAdmittedUsers();
    fetchPaymentLinks();
    fetchPendingClinicRequests();
  }, [clinicToken]);

  // Fetch Admitted Users (existing mock - replace with real API when ready)
  const fetchAdmittedUsers = async () => {
    try {
      // For now keeping mock data - replace when you have the real API
      const mockUsers: AdmittedUser[] = [
        {
          id: "1",
          name: "John Doe",
          phone: "+1234567890",
          email: "john@example.com",
          admissionDate: "2024-07-20",
          department: "Cardiology",
          roomNumber: "A-101",
          doctor: "Dr. Smith",
          status: "admitted",
          totalBill: 2500.00,
          paymentStatus: "pending",
          insurance: "Blue Cross",
          emergencyContact: "+1234567891",
          diagnosis: "Chest pain investigation"
        },
        {
          id: "2",
          name: "Jane Smith",
          phone: "+1234567892",
          email: "jane@example.com",
          admissionDate: "2024-07-18",
          department: "Orthopedics",
          roomNumber: "B-205",
          doctor: "Dr. Johnson",
          status: "admitted",
          totalBill: 3200.00,
          paymentStatus: "partial",
          insurance: "Aetna",
          emergencyContact: "+1234567893",
          diagnosis: "Fractured femur"
        },
        {
          id: "3",
          name: "Mike Wilson",
          phone: "+1234567894",
          email: "mike@example.com",
          admissionDate: "2024-07-15",
          department: "Emergency",
          roomNumber: "E-001",
          doctor: "Dr. Brown",
          status: "discharged",
          totalBill: 1800.00,
          paymentStatus: "paid",
          emergencyContact: "+1234567895",
          diagnosis: "Food poisoning"
        }
      ];

      setAdmittedUsers(mockUsers);
    } catch (error) {
      console.error("Error fetching admitted users:", error);
    }
  };

  // Fetch Payment Links (existing mock - replace with real API when ready)
  const fetchPaymentLinks = async () => {
    try {
      // Mock data for now
      const mockLinks: PaymentLink[] = [
        {
          id: "pl_1",
          userId: "1",
          amount: 2500.00,
          description: "Hospital Bill - John Doe",
          link: "https://pay.clinic.com/pl_1",
          status: "active",
          createdAt: "2024-07-21",
          expiresAt: "2024-08-21"
        }
      ];

      setPaymentLinks(mockLinks);
    } catch (error) {
      console.error("Error fetching payment links:", error);
    }
  };

  // Fetch Pending Clinic Requests from your backend API
  const fetchPendingClinicRequests = async () => {
    if (!clinicToken) {
      console.log("No clinic token available");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching pending clinic requests with token:", clinicToken);
      
      const response = await axios.get<ApiResponse>(`${baseUrl}/api/clinic/my-patients`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clinicToken}`,
        }
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Fixed: Use 'consultations' instead of 'requests'
        setPendingRequests(response.data.consultations || []);
        console.log(`Successfully fetched ${response.data.count} pending requests`);
      } else {
        console.error('Failed to fetch pending requests:', response.data.message);
        alert(`Failed to fetch pending requests: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error fetching pending clinic requests:', error);
      
      // More detailed error handling
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.status === 401) {
          alert('Authentication failed. Please login again.');
        } else if (error.response.status === 403) {
          alert('Access forbidden. Please check your clinic permissions.');
        } else {
          alert(`Server error: ${error.response.data.message || 'Unknown error'}`);
        }
      } else if (error.request) {
        console.error('Network error:', error.request);
        alert('Network error. Please check your connection.');
      } else {
        console.error('Error:', error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to admit a patient (new functionality you might want)
  const admitPatient = async (patientId: string) => {
    if (!clinicToken) {
      alert("Authentication required");
      return;
    }

    try {
      // Replace with your actual admit patient API endpoint
      const response = await axios.post(
        `${baseUrl}/api/clinic/admit-patient`,
        { patientId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clinicToken}`,
          }
        }
      );

      if (response.data.success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req._id !== patientId));
        alert("Patient admitted successfully!");
        
        // Optionally refresh the data
        fetchPendingClinicRequests();
      } else {
        alert(`Failed to admit patient: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("Error admitting patient:", error);
      alert(`Error admitting patient: ${error.response?.data?.message || error.message}`);
    }
  };

  // Function to reject a patient request
  const rejectPatientRequest = async (patientId: string) => {
    if (!clinicToken) {
      alert("Authentication required");
      return;
    }

    try {
      // Replace with your actual reject patient API endpoint
      const response = await axios.post(
        `${baseUrl}/api/clinic/reject-patient`,
        { patientId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clinicToken}`,
          }
        }
      );

      if (response.data.success) {
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(req => req._id !== patientId));
        alert("Patient request rejected.");
        
        // Optionally refresh the data
        fetchPendingClinicRequests();
      } else {
        alert(`Failed to reject request: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error("Error rejecting patient:", error);
      alert(`Error rejecting patient: ${error.response?.data?.message || error.message}`);
    }
  };

  const generatePaymentLink = async (user: AdmittedUser) => {
    try {
      const amount = parseFloat(paymentAmount);
      if (!amount || amount <= 0) {
        alert("Please enter a valid amount");
        return;
      }

      // Mock payment link generation for now
      const newLink: PaymentLink = {
        id: `pl_${Date.now()}`,
        userId: user.id,
        amount,
        description: paymentDescription || `Medical Bill - ${user.name}`,
        link: `https://pay.clinic.com/pl_${Date.now()}`,
        status: "active",
        createdAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      setPaymentLinks(prev => [...prev, newLink]);
      setShowPaymentModal(false);
      setPaymentAmount("");
      setPaymentDescription("");
      setSelectedUser(null);

      // Copy to clipboard
      navigator.clipboard.writeText(newLink.link);
      alert(`Payment link generated and copied to clipboard!\nLink: ${newLink.link}`);

    } catch (error) {
      console.error("Error generating payment link:", error);
      alert("Error generating payment link");
    }
  };

  const sendPaymentLink = async (user: AdmittedUser, paymentLink: PaymentLink) => {
    try {
      // Replace with actual API call to send SMS/Email when ready
      alert(`Payment link sent to ${user.name} via SMS and Email!\nLink: ${paymentLink.link}`);
    } catch (error) {
      console.error("Error sending payment link:", error);
      alert("Error sending payment link");
    }
  };

  const updateUserStatus = async (userId: string, status: AdmittedUser['status']) => {
    try {
      // Replace with actual API call when available
      setAdmittedUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const filteredUsers = admittedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm) ||
                          user.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'admitted': return 'bg-green-100 text-green-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
const handleLogout = async () => {
  try {
    if (!clinicToken) throw new Error("No token found");

    const decoded = jwtDecode<TokenPayload>(clinicToken);
    if (!decoded?.id) throw new Error("Invalid token");

    // 1. First clear client-side state immediately
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    try {
      // 2. Then attempt API logout (fire-and-forget)
      axios.post(`${baseUrl}/api/clinic/logout`, 
        { id: decoded.id,entityType:decoded.entityType },
        { headers: { Authorization: `Bearer ${clinicToken}` } }
      ).catch(apiError => {
        console.warn("Logout API failed (non-critical)", apiError);
      });
    } catch (apiError) {
      console.warn("Logout API failed", apiError);
    }

    // 3. Finally redirect
    navigate("/cliniclog");
    toast({ title: "Logged out successfully" });
    
  } catch (error) {
    console.error("Logout error:", error);
    // Ensure cleanup happens even if something failed
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/cliniclog");
    toast({ title: "Logout failed", variant: "destructive" });
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Clinic Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link 
                to="/clinic/settings" 
                className="text-gray-600 hover:text-gray-900"
              >
                Settings
              </Link>
              <button 
                onClick={() => {handleLogout()}}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Admitted</h3>
            <p className="text-3xl font-bold text-blue-600">
              {admittedUsers.filter(u => u.status === 'admitted').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Discharged Today</h3>
            <p className="text-3xl font-bold text-green-600">
              {admittedUsers.filter(u => u.status === 'discharged').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending Payments</h3>
            <p className="text-3xl font-bold text-red-600">
              {admittedUsers.filter(u => u.paymentStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
            <p className="text-3xl font-bold text-purple-600">
              {pendingRequests.length}
            </p>
          </div>
        </div>

        {/* Pending Clinic Requests Section - Moved up for priority */}
        <div className="mb-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Admission Requests ({pendingRequests.length})
            </h3>
          </div>
          <div className="p-6">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending admission requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{request.fullName}</h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Phone:</span> {request.phoneNumber}</p>
                          <p><span className="font-medium">Consultation Time:</span> {request.consultationTime}</p>
                          <p><span className="font-medium">Purpose:</span> {request.purpose}</p>
                          <p><span className="font-medium">Service Type:</span> {request.serviceType}</p>
                          <p><span className="font-medium">Status:</span> 
                            <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            <span className="font-medium">Request Date:</span> {new Date(request.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => admitPatient(request._id)}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                        >
                          Admit Patient
                        </button>
                        <button
                          onClick={() => rejectPatientRequest(request._id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Admitted Users ({filteredUsers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const userPaymentLinks = paymentLinks.filter(link => link.userId === user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">Room: {user.roomNumber}</div>
                          <div className="text-sm text-gray-500">Dr. {user.doctor}</div>
                          <div className="text-sm text-gray-500">{user.department}</div>
                          <div className="text-sm text-gray-500">Admitted: {user.admissionDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">${user.totalBill.toFixed(2)}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(user.paymentStatus)}`}>
                            {user.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPaymentModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            Generate Payment Link
                          </button>
                          
                          {userPaymentLinks.length > 0 && (
                            <button
                              onClick={() => sendPaymentLink(user, userPaymentLinks[0])}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              Send Payment Link
                            </button>
                          )}
                          
                          <select
                            value={user.status}
                            onChange={(e) => updateUserStatus(user.id, e.target.value as AdmittedUser['status'])}
                            className="text-xs border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="admitted">Admitted</option>
                            <option value="discharged">Discharged</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Links Section */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Payment Links
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentLinks.map((link) => {
                  const user = admittedUsers.find(u => u.id === link.userId);
                  return (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${link.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            link.status === 'active' ? 'bg-green-100 text-green-800' :
                            link.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigator.clipboard.writeText(link.link)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Copy link to clipboard"
                        >
                          Copy Link
                        </button>
                        {user && (
                          <button
                            onClick={() => sendPaymentLink(user, link)}
                            className="text-green-600 hover:text-green-900"
                            title="Resend payment link"
                          >
                            Resend
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Link Modal */}
      {showPaymentModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Generate Payment Link for {selectedUser.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={`${selectedUser.totalBill.toFixed(2)}`}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    placeholder={`Medical Bill - ${selectedUser.name}`}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedUser(null);
                    setPaymentAmount("");
                    setPaymentDescription("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => generatePaymentLink(selectedUser)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Generate Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}