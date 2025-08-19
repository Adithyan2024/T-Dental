import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter, Download, Eye, Check, X, Clock, Calendar, MessageSquare } from 'lucide-react';
import axios from 'axios';
import baseUrl from "../../baseUrl"

import { Link } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from 'redux/store';
import { jwtDecode } from "jwt-decode";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slice";


interface ConsultationApplication {
  _id: string;
  fullName: string;
  phoneNumber: string;
  service: {
    _id: string;
    name: string;
    address: string;
    location: string;
    specializations: string[];
  };
  dateTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  serviceType: string;
  patientId?: {
    name: string;
    email: string;
    phone: string;
  };
  alternativeTime?: string;
  hasAlternativeTime?: boolean;
  adminNote?: string;
}

interface ActionModalData {
  type: 'approve' | 'reject' | 'reschedule';
  application: ConsultationApplication;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type TokenPayload = {
  id: string;
  role: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  entityType:string
};
const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedApplication, setSelectedApplication] = useState<ConsultationApplication | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [applications, setApplications] = useState<ConsultationApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Action modal states
  const [actionModal, setActionModal] = useState<ActionModalData | null>(null);
  const [alternativeDate, setAlternativeDate] = useState<string>('');
  const [alternativeTime, setAlternativeTime] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');

  // API Base URL - replace with your actual API base URL
  const API_BASE_URL = 'http://localhost:8000/api';
const navigate=useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  // Redux token management
  const adminToken = useSelector((state: RootState) => state.user.token);
 const decoded = jwtDecode<TokenPayload>(adminToken);
  console.log("Decoded clinic id",decoded);
  const createAxiosConfig = () => {
    const config: any = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const token = localStorage?.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  };

  const fetchPendingConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/admin/pending-clinic-requests`, {
        method: 'GET',
        headers: createAxiosConfig().headers
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setApplications(data.consultations);
      } else {
        setError(data.message || 'Failed to fetch consultations');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

 // Fix in your updateApplicationStatus function
const updateApplicationStatus = async (
  consultationId: string, 
  newStatus: 'approved' | 'rejected', 
  alternativeDate?: string, 
  alternativeTime?: string, 
  note?: string
) => {
  try {
    setUpdating(true);
    setError('');

    const requestData: any = {
      consultationId,
      status: newStatus
    };

    // Send separate date and time fields if both are provided
    if (alternativeDate && alternativeTime) {
      requestData.alternativeDate = alternativeDate;
      requestData.alternativeTime = alternativeTime;
    }

    // Only add note if provided
    if (note) {
      requestData.adminNote = note;
    }

    const response = await fetch(`${API_BASE_URL}/admin/update-status`, {
      method: 'PATCH',
      headers: createAxiosConfig().headers,
      body: JSON.stringify(requestData)
    });
    
    console.log('Request Data:', requestData); // This will now show the alternative time
    
    const data = await response.json();

    if (response.ok && data.success) {
      setApplications(prev =>
        prev.map(app =>
          app._id === consultationId 
            ? { 
                ...app, 
                status: newStatus,
                alternativeTime: alternativeDate && alternativeTime ? `${alternativeDate} ${alternativeTime}` : app.alternativeTime,
                adminNote: note || app.adminNote
              } 
            : app
        )
      );
      
      setShowModal(false);
      setActionModal(null);
      resetActionModalForm();
      
      alert(`Consultation ${newStatus} successfully!`);
    } else {
      setError(data.message || 'Failed to update consultation status');
    }
  } catch (err) {
    setError('Error updating consultation status');
    console.error('Update error:', err);
  } finally {
    setUpdating(false);
  }
};

  const resetActionModalForm = () => {
    setAlternativeDate('');
    setAlternativeTime('');
    setAdminNote('');
  };


// Updated handleActionSubmit function
const handleActionSubmit = () => {
  if (!actionModal) return;

  const { type, application } = actionModal;
  
  const finalStatus = type === 'approve' ? 'approved' : 'rejected';
  
  // Pass the separate date and time values to the function
  updateApplicationStatus(
    application._id, 
    finalStatus, 
    alternativeDate || undefined,  // Pass separate date
    alternativeTime || undefined,  // Pass separate time
    adminNote || undefined
  );
};


  const openActionModal = (type: 'approve' | 'reject' | 'reschedule', application: ConsultationApplication) => {
    setActionModal({ type, application });
    resetActionModalForm();
  };

  useEffect(() => {
    fetchPendingConsultations();
  }, []);

  const isPharmacy = (app: ConsultationApplication) =>
    app.service.name.toLowerCase().includes('pharmacy') || 
    app.serviceType?.toLowerCase() === 'pharmacy';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phoneNumber.includes(searchTerm) ||
      app.service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  // Fixed formatDate function to handle both field names
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    
    // Handle different date formats
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // If it's not a valid ISO date, try to parse it as is (for formats like "2025-08-21 2:00 PM")
      return dateString;
    }
    
    return date.toLocaleString();
  };

  // Helper function to get the consultation time - handles both consultationTime and dateTime fields
  const getConsultationTime = (application: ConsultationApplication): string => {
    // Check if consultationTime exists in the data (like your example)
    if ((application as any).consultationTime) {
      return (application as any).consultationTime;
    }
    // Otherwise use dateTime
    return application.dateTime || '';
  };

  const formatDateForInput = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 16);
  };
const handleLogout = async () => {
  try {
    // 1. Get token from storage (with fallback)
    const adminToken = localStorage.getItem("authToken") || '';
    
    // 2. Immediate client-side cleanup
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // 3. Only proceed with token operations if token exists
    if (adminToken) {
      try {
        const decoded = jwtDecode<TokenPayload>(adminToken);
        
        // Fire-and-forget API call with timeout
        axios.post(
          `${baseUrl}/api/admin/logout`,
          { id: decoded?.id },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`
            },
            timeout: 3000 // 3 second timeout
          }
        ).catch(apiError => {
          console.warn("Logout API notification failed", apiError);
        });
      } catch (decodeError) {
        console.warn("Token decode failed - proceeding with logout", decodeError);
      }
    }

    // 4. Redirect and show success
    navigate("/admin");
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
    });

  } catch (error) {
    console.error("Logout process completed with notes:", error);
    
    // Final cleanup guarantee
    dispatch(clearUser());
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    
    navigate("/admin");
    
    toast({
      title: "Session cleared",
      description: "You have been logged out.",
      variant: "default",
    });
  }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-black rounded-sm mr-3"></div>
              <span className="text-xl font-semibold text-gray-900">
                Tdent Admin
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Bell className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />

              <button
                onClick={() => window.location.href = '/verifyclinic'}
                className="text-gray-700 hover:text-blue-600 px-2 py-1 border rounded"
              >
                Clinic Verification
              </button>
              
              <button
                onClick={fetchPendingConsultations}
                className="text-gray-700 hover:text-blue-600 px-2 py-1 border rounded"
              >
                Refresh
              </button>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Consultation Applications</h1>
          <p className="text-gray-600 mt-2">Manage and review all consultation requests</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone, or clinic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filter
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied: {formatDate(application.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {application.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.service.name}</div>
                      <div className="text-sm text-gray-500">{application.service.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(getConsultationTime(application))}
                      {application.alternativeTime && (
                        <div className="text-sm text-blue-600">
                          Alt: {application.alternativeTime}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No applications found matching your criteria.</p>
          </div>
        )}
      </main>

    {/* Application Details Modal */}
{showModal && selectedApplication && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 min-[350px]:p-4 z-50">
    <div className="bg-white rounded-lg max-w-md w-full p-4 min-[350px]:p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-3 min-[350px]:mb-4">
        <h2 className="text-lg min-[350px]:text-xl font-bold text-gray-900">
          {isPharmacy(selectedApplication) ? 'Pharmacy Application' : 'Application Details'}
        </h2>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 min-[350px]:w-6 h-5 min-[350px]:h-6" />
        </button>
      </div>

      <div className="space-y-3 min-[350px]:space-y-4">
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">User Name</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.fullName}</p>
        </div>
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Phone Number</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.phoneNumber}</p>
        </div>
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Service</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.service.name}</p>
          <p className="text-[10px] min-[350px]:text-sm text-gray-500">{selectedApplication.service.address}</p>
        </div>
        {!isPharmacy(selectedApplication) && (
          <div>
            <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Specializations</p>
            <p className="text-gray-900 text-xs min-[350px]:text-base">
              {selectedApplication.service.specializations?.join(', ') || 'N/A'}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Preferred Date & Time</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{formatDate(getConsultationTime(selectedApplication))}</p>
        </div>
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Purpose</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.purpose}</p>
        </div>
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Service Type</p>
          <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.serviceType}</p>
        </div>
        <div>
          <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Current Status</p>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] min-[350px]:text-xs font-medium ${getStatusColor(
              selectedApplication.status
            )}`}
          >
            {getStatusIcon(selectedApplication.status)}
            {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
          </span>
        </div>
        {selectedApplication.patientId && (
          <div>
            <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Patient Info</p>
            <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.patientId.name}</p>
            <p className="text-[10px] min-[350px]:text-sm text-gray-500">{selectedApplication.patientId.email}</p>
          </div>
        )}
        {selectedApplication.adminNote && (
          <div>
            <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Admin Note</p>
            <p className="text-gray-900 text-xs min-[350px]:text-base">{selectedApplication.adminNote}</p>
          </div>
        )}
        {selectedApplication.alternativeTime && (
          <div>
            <p className="text-xs min-[350px]:text-sm font-medium text-gray-600">Alternative Time Suggested</p>
            <p className="text-blue-600 text-xs min-[350px]:text-base">{selectedApplication.alternativeTime}</p>
          </div>
        )}
      </div>

      {selectedApplication.status === 'pending' && (
        <div className="flex gap-2 mt-4 min-[350px]:mt-6">
          <button
            onClick={() => openActionModal('approve', selectedApplication)}
            className="flex-1 bg-green-600 text-white px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 text-xs min-[350px]:text-sm"
          >
            <Check className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
            Approve
          </button>
          <button
            onClick={() => openActionModal('reject', selectedApplication)}
            className="flex-1 bg-red-600 text-white px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 text-xs min-[350px]:text-sm"
          >
            <X className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
            Reject
          </button>
        </div>
      )}
    </div>
  </div>
)}

{/* Action Modal (Approve/Reject with Time Selection) */}
{actionModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 min-[350px]:p-4 z-50">
    <div className="bg-white rounded-lg max-w-lg w-full p-4 min-[350px]:p-6">
      <div className="flex justify-between items-center mb-3 min-[350px]:mb-4">
        <h2 className="text-lg min-[350px]:text-xl font-bold text-gray-900">
          {actionModal.type === 'approve' ? 'Approve Consultation' : 'Reject Consultation'}
        </h2>
        <button
          onClick={() => setActionModal(null)}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-5 min-[350px]:w-6 h-5 min-[350px]:h-6" />
        </button>
      </div>

      <div className="space-y-3 min-[350px]:space-y-4">
        {/* Application Summary */}
        <div className="bg-gray-50 p-3 min-[350px]:p-4 rounded-lg">
          <p className="font-medium text-xs min-[350px]:text-base">{actionModal.application.fullName}</p>
          <p className="text-[10px] min-[350px]:text-sm text-gray-600">{actionModal.application.service.name}</p>
          <p className="text-[10px] min-[350px]:text-sm text-gray-600">
            Requested: {formatDate(getConsultationTime(actionModal.application))}
          </p>
        </div>

        {/* Action-specific forms */}
        {actionModal.type === 'approve' && (
          <div>
            <p className="text-xs min-[350px]:text-sm text-gray-600 mb-2 min-[350px]:mb-3">
              Confirm to approve this consultation. Optionally, suggest an alternative time.
            </p>

            <div className="grid grid-cols-1 min-[350px]:grid-cols-2 gap-2 min-[350px]:gap-4 mb-3 min-[350px]:mb-4">
              <div>
                <label className="block text-xs min-[350px]:text-sm font-medium text-gray-700 mb-1 min-[350px]:mb-2">
                  Alternative Date (Optional)
                </label>
                <input
                  type="date"
                  value={alternativeDate}
                  onChange={(e) => setAlternativeDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs min-[350px]:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs min-[350px]:text-sm font-medium text-gray-700 mb-1 min-[350px]:mb-2">
                  Alternative Time (Optional)
                </label>
                <input
                  type="time"
                  value={alternativeTime}
                  onChange={(e) => setAlternativeTime(e.target.value)}
                  className="w-full px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs min-[350px]:text-sm"
                />
              </div>
            </div>

            {alternativeDate && alternativeTime && (
              <div className="bg-blue-50 p-2 min-[350px]:p-3 rounded-lg mb-3 min-[350px]:mb-4">
                <div className="flex items-center gap-1 min-[350px]:gap-2">
                  <Calendar className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4 text-blue-600" />
                  <span className="text-[10px] min-[350px]:text-sm font-medium text-blue-800">
                    Alternative Time: {alternativeDate} {alternativeTime}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs min-[350px]:text-sm font-medium text-gray-700 mb-1 min-[350px]:mb-2">
                Admin Note (Optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add any notes for the patient..."
                className="w-full px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs min-[350px]:text-sm"
                rows={3}
              />
            </div>
          </div>
        )}

        {actionModal.type === 'reject' && (
          <div>
            <p className="text-xs min-[350px]:text-sm text-gray-600 mb-2 min-[350px]:mb-3">
              Please provide a reason for rejecting the consultation.
            </p>
            <div>
              <label className="block text-xs min-[350px]:text-sm font-medium text-gray-700 mb-1 min-[350px]:mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Explain why the consultation is being rejected..."
                className="w-full px-2 min-[350px]:px-3 py-1.5 min-[350px]:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs min-[350px]:text-sm"
                rows={3}
                required
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 min-[350px]:gap-3 pt-3 min-[350px]:pt-4">
          <button
            onClick={() => setActionModal(null)}
            className="flex-1 px-3 min-[350px]:px-4 py-1.5 min-[350px]:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs min-[350px]:text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleActionSubmit}
            disabled={updating || (actionModal.type === 'reject' && !adminNote.trim())}
            className={`flex-1 px-3 min-[350px]:px-4 py-1.5 min-[350px]:py-2 text-white rounded-lg flex items-center justify-center gap-1 min-[350px]:gap-2 text-xs min-[350px]:text-sm ${
              actionModal.type === 'approve'
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
            }`}
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-3 min-[350px]:h-4 w-3 min-[350px]:w-4 border-b-2 border-white"></div>
                Processing...
              </>
            ) : (
              <>
                {actionModal.type === 'approve' ? (
                  <Check className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
                ) : (
                  <X className="w-3 min-[350px]:w-4 h-3 min-[350px]:h-4" />
                )}
                {actionModal.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;