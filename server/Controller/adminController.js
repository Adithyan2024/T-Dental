import Admin from "../Schema/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Clinic from "../Schema/Clinic.js";
import Patient from "../Schema/Patient.js";
import Pharmacy from "../Schema/Pharmacy.js";
import Laboratory from "../Schema/Laboratory.js";
import Consultation from "../Schema/Consultaion.js";
import { sendNotification } from "../utils/sendNotifications.js";

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRY;
const ADMIN_ROLE=process.env.ADMIN_ROLE;

const registerAdmin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required" });
    }

    const existingAdmin = await Admin.findOne({ phone });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ phone, password: hashedPassword });

    res.status(201).json({ message: "Admin registered successfully", adminId: newAdmin._id });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { adminId: admin._id, phone: admin.phone,role:ADMIN_ROLE },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }

    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};
const getPendingClinics = async (req, res) => {
  try {
    const [clinics, pharmacies, labs] = await Promise.all([
      Clinic.find({ status: "pending" }),
      Pharmacy.find({ status: "pending" }),
      Laboratory.find({ status: "pending" }),
    ]);

    // Add entityType to each item
    const clinicsWithType = clinics.map((item) => ({
      ...item.toObject(),
      entityType: "clinic",
    }));

    const pharmaciesWithType = pharmacies.map((item) => ({
      ...item.toObject(),
      entityType: "pharmacy",
    }));

    const labsWithType = labs.map((item) => ({
      ...item.toObject(),
      entityType: "laboratory",
    }));

    res.status(200).json({
      clinics: clinicsWithType,
      pharmacies: pharmaciesWithType,
      labs: labsWithType,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending registrations",
      error: error.message,
    });
  }
};

const modelMap = {
  clinic: Clinic,
  pharmacy: Pharmacy,
  lab: Laboratory
};
const updateClinicStatus = async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    const { io, connectedUsers } = req;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be either 'approved' or 'rejected'" });
    }

    const Model = modelMap[type.toLowerCase()];
    if (!Model) {
      return res.status(400).json({ message: "Invalid type provided" });
    }

    const updated = await Model.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: `${type} not found` });
    }

    // ✅ Send notification directly to the clinic/lab/pharmacy
    const message = `Your ${type} has been ${status} by the admin.`;
    await sendNotification({
      receiverId: updated._id,       // 🔹 Send to the clinic itself
      receiverRole: updated.role,    // 🔹 Role should be stored in the clinic model
      entityType: type.toLowerCase(),
      message,
      io,
      connectedUsers
    });

    res.status(200).json({
      message: `${type} ${status} successfully`,
      data: updated
    });

  } catch (error) {
    console.error("Error in updateClinicStatus:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
  }
};


// Get all pending consultations for admin
const getPendingConsultations = async (req, res) => {
  try {
    const pendingConsultations = await Consultation.find({
      status: 'pending'
    })
    .populate('service', 'name address location specializations')
    .populate('patientId', 'name email phone') // Populate patient data
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      consultations: pendingConsultations,
      count: pendingConsultations.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Admin accepts/rejects patient's clinic request
// In your updateConsultationStatus function, add console logs




const updateConsultationStatus = async (req, res) => {
  try {
    const { consultationId, status, adminNote, alternativeDate, alternativeTime } = req.body;

    console.log("📝 Request body:", { consultationId, status, adminNote, alternativeDate, alternativeTime });

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    // Validation for rejection - admin note is required
    if (status === 'rejected' && (!adminNote || !adminNote.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Admin note is required when rejecting a consultation'
      });
    }

    const consultation = await Consultation.findById(consultationId)
      .populate("service", "name");

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    console.log("📋 Original consultation:", {
      id: consultation._id,
      originalTime: consultation.consultationTime,
      status: consultation.status
    });

    // Update consultation status
    consultation.status = status;
    
    // Add admin note if provided
    if (adminNote && adminNote.trim()) {
      consultation.adminNote = adminNote.trim();
      console.log("💬 Added admin note:", consultation.adminNote);
    } else {
      console.log("⚠️ No admin note provided or empty");
    }
    
    // Handle alternative time for approved consultations
    let finalAlternativeTime = null;
    if (status === 'approved' && alternativeDate && alternativeTime) {
      finalAlternativeTime = `${alternativeDate} ${alternativeTime}`;
      consultation.alternativeTime = finalAlternativeTime;
      console.log("🕒 Alternative time set:", finalAlternativeTime);
    } else {
      console.log("⚠️ Alternative time not provided:", { alternativeDate, alternativeTime, status });
    }
    
    await consultation.save();
    console.log("💾 Consultation saved with updates");

    // Prepare notification receiver
    let receiverId;
    let receiverRole = 300; // Patient role

    if (consultation.patientId) {
      receiverId = consultation.patientId;
    } else {
      const patient = await Patient.findOne({ phone: consultation.phoneNumber });
      if (patient) receiverId = patient._id;
    }

    // Enhanced notification for patients
    if (receiverId) {
      const clinicName = consultation.service?.name || "Healthcare Service";
      const originalDateTime = consultation.consultationTime || "N/A";
      
      let message = '';
      
      if (status === 'approved') {
        if (finalAlternativeTime) {
          // Show alternative time when provided
          message = `Your consultation request for ${clinicName} has been APPROVED with alternative time: ${finalAlternativeTime}.`;
        } else {
          // Show original time when no alternative provided
          message = `Your consultation request for ${clinicName} on ${originalDateTime} has been APPROVED.`;
        }
        
        if (adminNote && adminNote.trim()) {
          message += ` Admin note: ${adminNote.trim()}`;
        }
      } else if (status === 'rejected') {
        message = `Your consultation request for ${clinicName} on ${originalDateTime} has been REJECTED. Reason: ${adminNote}`;
      }

      console.log("📨 Notification message:", message);

      // Send notification to patient
      const notificationResult = await sendNotification({
        receiverId,
        receiverRole, // 300 for patient
        message,
        extraData: {
          consultationId,
          clinicName,
          originalDateTime,
          alternativeTime: finalAlternativeTime, // Use the variable, not consultation.alternativeTime
          adminNote: consultation.adminNote,
          status
        }
      });

      console.log("🔔 Notification sent:", notificationResult ? "Success" : "Failed");
      console.log("📊 Final data sent to notification:", {
        alternativeTime: finalAlternativeTime,
        adminNote: consultation.adminNote,
        message: message.substring(0, 100) + "..."
      });
    }

    // Handle clinic request for approved consultations
    if (status === 'approved' && consultation.serviceType === 'Clinic') {
      try {
        let patient;

        if (consultation.patientId) {
          patient = await Patient.findById(consultation.patientId);
        } else {
          patient = await Patient.findOne({ phone: consultation.phoneNumber });
        }

        if (patient && !patient.clinicRequest && !patient.clinicAdmitted) {
          await Patient.findByIdAndUpdate(patient._id, {
            clinicRequest: consultation.service
          });
        } else if (!patient) {
          patient = new Patient({
            name: consultation.fullName,
            phone: consultation.phoneNumber,
            email: `${consultation.phoneNumber}@temp.com`,
            password: 'tempPassword123',
            clinicRequest: consultation.service
          });
          await patient.save();

          await Consultation.findByIdAndUpdate(consultationId, {
            patientId: patient._id
          });
        }
      } catch (patientError) {
        console.log('Error creating clinic request:', patientError);
      }
    }

    // Return the updated consultation with alternative time
    const updatedConsultation = await Consultation.findById(consultationId)
      .populate("service", "name");

    res.json({
      success: true,
      message: `Consultation ${status} successfully`,
      consultation: updatedConsultation,
      debug: {
        originalTime: consultation.consultationTime,
        alternativeTime: finalAlternativeTime,
        adminNote: consultation.adminNote
      }
    });

  } catch (error) {
    console.error("❌ Error in updateConsultationStatus:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const adminLogout = async (req, res) => {
  const { id } = req.body;

  try {
    // 1. Validate required field
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Admin ID is required" 
      });
    }

    // 2. Find admin in database
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    // 3. Clear admin token
    admin.token = null;
    await admin.save();

    // 4. Respond with success
    return res.status(200).json({ 
      success: true,
      message: "Admin logged out successfully",
      data: {
        id: admin._id,
        email: admin.email
      }
    });
    
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error during admin logout",
      error: error.message 
    });
  }
};





export{
    registerAdmin,
    loginAdmin,
    getPendingClinics,
    updateClinicStatus,
    getPendingConsultations,
    updateConsultationStatus,
    adminLogout
    

}