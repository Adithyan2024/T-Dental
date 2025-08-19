import Clinic from "../Schema/Clinic.js";
import Patient from "../Schema/Patient.js";
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";
import Pharmacy from "../Schema/Pharmacy.js";
import Laboratory from "../Schema/Laboratory.js";
import Consultation from "../Schema/Consultaion.js";
import PharmacyLabReq from "../Schema/PharmacyLabReq.js";
import crypto from "crypto";

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRY;

const registerClinic = async (req, res) => {
  try {
    const {
      entityType, // 'clinic', 'pharmacy', or 'lab'
      name,
      email,
      phone,
      address,
      location,
      password,
      acceptsEMI,
      acceptsInsurance, // Insurance acceptance field
      // Clinic-specific fields
      specializations,
      numberOfDoctors,
      // Pharmacy-specific fields
      pharmacyLicense,
      operatingHours,
      // Lab-specific fields
      testTypes,
      equipmentDetails,
    } = req.body;

    const licenseProof = req.file?.filename;

    // Validate entity type
    if (!entityType || !["clinic", "pharmacy", "lab"].includes(entityType)) {
      return res.status(400).json({
        message: "Valid entity type (clinic, pharmacy, lab) is required",
      });
    }

    // Common required fields
    if (!name || !email || !phone || !address || !location || !password || !specializations) {
      return res.status(400).json({
        message: "Name, email, phone, address, location, specializations, and password are required",
      });
    }

    // Validate acceptsEMI field (required)
    if (acceptsEMI === undefined || acceptsEMI === null || acceptsEMI === "" || !["yes", "no"].includes(acceptsEMI)) {
      return res.status(400).json({
        message: "EMI acceptance (yes/no) is required",
      });
    }

    // Validate acceptsInsurance field (required)
    if (acceptsInsurance === undefined || acceptsInsurance === null || acceptsInsurance === "" || !["yes", "no"].includes(acceptsInsurance)) {
      return res.status(400).json({
        message: "Insurance acceptance (yes/no) is required",
      });
    }

    if (entityType === "clinic" && !numberOfDoctors) {
      return res.status(400).json({ message: "Number of doctors is required for clinics" });
    }

    let Model, uploadPath;

    if (entityType === "clinic") {
      Model = Clinic;
      uploadPath = "clinicUploads";
    } else if (entityType === "pharmacy") {
      Model = Pharmacy;
      uploadPath = "clinicUploads";
    } else if (entityType === "lab") {
      Model = Laboratory;
      uploadPath = "clinicUploads";
    }

    // Check if email already exists
    const existingClinic = await Clinic.findOne({ email });
    const existingPharmacy = await Pharmacy.findOne({ email });
    const existingLab = await Laboratory.findOne({ email });
    const existingPatient = await Patient.findOne({ email });

    if (existingClinic || existingPharmacy || existingLab || existingPatient) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Include entityType, acceptsEMI, and acceptsInsurance
    let entityData = {
      entityType,
      name,
      email,
      phone,
      address,
      location,
      password: hashedPassword,
      acceptsEMI: acceptsEMI === "yes", // Convert "yes"/"no" to boolean
      acceptsInsurance: acceptsInsurance === "yes", // Convert "yes"/"no" to boolean
      licenseProof: licenseProof ? `/${uploadPath}/${licenseProof}` : null,
      status: "pending",
    };

    // Entity-specific fields
    if (entityType === "clinic") {
      let parsedSpecializations = [];
      if (specializations) {
        try {
          parsedSpecializations = typeof specializations === "string"
            ? JSON.parse(specializations)
            : specializations;
        } catch (error) {
          parsedSpecializations = [];
        }
      }

      entityData.specializations = parsedSpecializations;
      entityData.numberOfDoctors = parseInt(numberOfDoctors);
    } else if (entityType === "pharmacy") {
      if (pharmacyLicense) entityData.pharmacyLicense = pharmacyLicense;
      if (operatingHours) {
        entityData.operatingHours = typeof operatingHours === "string"
          ? JSON.parse(operatingHours)
          : operatingHours;
      }
    } else if (entityType === "lab") {
      if (testTypes) {
        entityData.testTypes = typeof testTypes === "string"
          ? JSON.parse(testTypes)
          : testTypes;
      }
      if (equipmentDetails) entityData.equipmentDetails = equipmentDetails;
    }

    const entity = new Model(entityData);
    await entity.save();

    const fullLicenseProofUrl = licenseProof
      ? `${req.protocol}://${req.get("host")}/${uploadPath}/${licenseProof}`
      : null;

    res.status(201).json({
      message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} registered successfully. Wait for admin approval.`,
      entityId: entity._id,
      entityType,
      role: "clinic", // still assigning this role to all
      acceptsEMI: entityData.acceptsEMI,
      acceptsInsurance: entityData.acceptsInsurance,
      licenseProof: fullLicenseProofUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: `Error registering ${req.body.entityType || "provider"}`,
      error: error.message,
    });
  }
};

const createToken = (payload, secret, expiry) => {
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

const login = async (req, res) => {
  try {
    const { email, password, role, entityType } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password, and role are required" });
    }

    let user;

    if (role === process.env.CLINIC_ROLE) {
      // Entity type is required for clinic/pharmacy/lab
      if (!entityType) {
        return res
          .status(400)
          .json({ message: "Entity type is required for clinic role" });
      }

      let Model;
      if (entityType === "clinic") {
        Model = Clinic;
      } else if (entityType === "pharmacy") {
        Model = Pharmacy;
      } else if (entityType === "lab") {
        Model = Laboratory; // ✅ assuming you're using ES module import
      } else {
        return res.status(400).json({ message: "Invalid entity type" });
      }

      user = await Model.findOne({ email });
    } else if (role === process.env.USER_ROLE) {
      user = await Patient.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Block unapproved clinic/pharmacy/lab
    if (role === process.env.CLINIC_ROLE && user.status !== "approved") {
      return res.status(403).json({
        message: `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } status is '${user.status}'. Wait for admin approval.`,
      });
    }

    const token = createToken(
      {
        id: user._id,
        role,
        entityType: role === process.env.CLINIC_ROLE ? entityType : undefined,
        email: user.email,
        name: user.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRY
    );

    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        id: user._id,
        role,
        email: user.email,
        status:user.status
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hello ${name},</p>
      <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p><strong>This OTP will expire in 10 minutes.</strong></p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Password Reset OTP - T-Dent Care",
    html: html,
  });
};

const getModelAndUser = async (email, role, entityType) => {
  let user;
  let Model;

  if (role == process.env.CLINIC_ROLE) {
    // For clinic role, check entityType to determine the correct model
    if (entityType === "clinic") {
      Model = Clinic;
      user = await Clinic.findOne({ email });
    } else if (entityType === "pharmacy") {
      Model = Pharmacy;
      user = await Pharmacy.findOne({ email });
    } else if (entityType === "lab") {
      Model = Laboratory;
      user = await Laboratory.findOne({ email });
    } else {
      throw new Error("Invalid entity type for clinic role");
    }
  } else if (role == process.env.USER_ROLE) {
    Model = Patient;
    user = await Patient.findOne({ email });
  } else {
    throw new Error("Invalid role");
  }

  return { Model, user };
};

const forgotPassword = async (req, res) => {
  try {
    const { email, role, entityType } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    // For clinic role, entityType is required
    if (role == process.env.CLINIC_ROLE && !entityType) {
      return res.status(400).json({ message: "Entity type is required for clinic role" });
    }

    let user;
    let Model;

    try {
      const result = await getModelAndUser(email, role, entityType);
      Model = result.Model;
      user = result.user;
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and expiry time (10 minutes from now)
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP and expiry to user document
    await Model.findByIdAndUpdate(user._id, {
      otp: otp,
      otpExpiry: otpExpiry,
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.name);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }
console.log("otp",otp);

    res.status(200).json({
      message: "OTP sent to your email address",
      email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // Masked email for security
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, role, otp, entityType } = req.body;

    if (!email || !role || !otp) {
      return res
        .status(400)
        .json({ message: "Email, role, and OTP are required" });
    }

    // For clinic role, entityType is required
    if (role == process.env.CLINIC_ROLE && !entityType) {
      return res.status(400).json({ message: "Entity type is required for clinic role" });
    }

    let user;
    let Model;

    try {
      const result = await getModelAndUser(email, role, entityType);
      Model = result.Model;
      user = result.user;
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check OTP
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: "OTP expired" });

    // Mark OTP as verified
    await Model.findByIdAndUpdate(user._id, {
      otpVerified: true,
    });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, role, entityType } = req.body;

    if (!email || !newPassword || !role) {
      return res
        .status(400)
        .json({ message: "Email, new password, and role are required" });
    }

    // For clinic role, entityType is required
    if (role == process.env.CLINIC_ROLE && !entityType) {
      return res.status(400).json({ message: "Entity type is required for clinic role" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    let user;
    let Model;

    try {
      const result = await getModelAndUser(email, role, entityType);
      Model = result.Model;
      user = result.user;
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Make sure OTP was verified
    if (!user.otpVerified) {
      return res
        .status(400)
        .json({
          message:
            "OTP not verified. Please verify OTP before resetting password.",
        });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await Model.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      otp: undefined,
      otpExpiry: undefined,
      otpVerified: false, // reset this flag
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// In getPendingClinicRequests, add debug
const getPendingClinicRequests = async (req, res) => {
  try {
    console.log('Getting approved consultation requests for clinic:', req.clinic.id);
    
    // Get the logged-in clinic's ID from the auth token
    const clinicId = req.clinic.id;
    
    if (!clinicId) {
      return res.status(401).json({
        success: false,
        message: 'Clinic authentication required'
      });
    }
    
    // Find consultations that are:
    // 1. For this specific clinic
    // 2. Approved by admin
    // 3. Service type is Clinic
    const consultations = await Consultation.find({
      service: clinicId,
      serviceType: 'Clinic',
      status: 'approved' // Only show admin-approved consultations
    })
    .populate('patientId', 'name email phone')
    .sort({ createdAt: -1 });

    console.log(`Found ${consultations.length} approved consultations for clinic ${clinicId}`);

    // Populate the clinic service details
    const populatedConsultations = await Promise.all(
      consultations.map(async (consultation) => {
        const populatedService = await mongoose.model('Clinic').findById(consultation.service)
          .select('name address location specializations');
        
        return {
          _id: consultation._id,
          fullName: consultation.fullName,
          phoneNumber: consultation.phoneNumber,
          dateTime: consultation.consultationTime,
          purpose: consultation.purpose,
          service: {
            _id: populatedService?._id || consultation.service,
            name: populatedService?.name || 'Clinic Service',
            address: populatedService?.address || '',
            location: populatedService?.location || '',
            specializations: populatedService?.specializations || []
          },
          serviceType: consultation.serviceType,
          status: consultation.status,
          patientId: consultation.patientId,
          createdAt: consultation.createdAt,
          updatedAt: consultation.updatedAt
        };
      })
    );

    res.json({
      success: true,
      consultations: populatedConsultations,
      count: populatedConsultations.length,
      message: `Found ${populatedConsultations.length} approved consultation requests`
    });
  } catch (error) {
    console.error('Error fetching clinic consultations:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;
    const clinicId = req.clinic.id;

    const patient = await Patient.findOne({
      _id: patientId,
      clinicAdmitted: clinicId,
    }).select("-password -otp -otpExpiry");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found or not admitted to your clinic",
      });
    }

    res.json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get consultations booked for this clinic
// const getMyConsultations = async (req, res) => {
//   try {
//     const clinicId = req.clinic.id;
//     const { status } = req.query;

//     let filter = {
//       service: clinicId,
//       serviceType: "Clinic",
//     };

//     if (status) filter.status = status;

//     const consultations = await Consultation.find(filter)
//       .populate("userId", "name email phone")
//       .sort({ consultationTime: 1 });

//     res.json({
//       success: true,
//       consultations,
//       count: consultations.length,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// Update consultation status
const updateConsultationStatus = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const { status } = req.body;
    const clinicId = req.clinic.id;

    const consultation = await Consultation.findOne({
      _id: consultationId,
      service: clinicId,
      serviceType: "Clinic",
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found or does not belong to your clinic",
      });
    }

    consultation.status = status;
    consultation.updatedAt = new Date();
    await consultation.save();

    res.json({
      success: true,
      message: `Consultation ${status} successfully`,
      consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getApprovedProviders = async (req, res) => {
  try {
    // Fetch all approved entities
    const clinics = await Clinic.find({ status: "approved" }).select(
      "-password -otp -otpExpiry -otpVerified"
    );
    const labs = await Laboratory.find({ status: "approved" }).select(
      "-password -otp -otpExpiry -otpVerified"
    );
    const pharmacies = await Pharmacy.find({ status: "approved" }).select(
      "-password -otp -otpExpiry -otpVerified"
    );

    res.status(200).json({
      success: true,
      message: "Approved providers fetched successfully",
      clinics,
      laboratories: labs,
      pharmacies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved providers",
      error: error.message,
    });
  }
};

const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: "approved" })
      .select("name email phone address location services")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findById(id).select("-password -otp");

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy,
    });
  } catch (error) {
    console.error("Error fetching pharmacy:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getAllLaboratories = async (req, res) => {
  try {
    const laboratories = await Laboratory.find({ status: "approved" })
      .select("name email phone address location services")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: laboratories,
    });
  } catch (error) {
    console.error("Error fetching laboratories:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const getLaboratoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const laboratory = await Laboratory.findById(id).select("-password -otp");

    if (!laboratory) {
      return res.status(404).json({
        success: false,
        message: "Laboratory not found",
      });
    }

    res.status(200).json({
      success: true,
      data: laboratory,
    });
  } catch (error) {
    console.error("Error fetching laboratory:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const clinicLogout = async (req, res) => {
  const { id, entityType } = req.body;

  try {
    let Model;
    
    // Determine which model to use based on entityType
    switch(entityType) {
      case 'clinic':
        Model = Clinic;
        break;
      case 'pharmacy':
        Model = Pharmacy;
        break;
      case 'lab':
        Model = Laboratory;
        break;
    
      default:
        return res.status(400).json({ message: "Invalid entity type" });
    }

    const entity = await Model.findById(id);
    if (!entity) {
      return res.status(404).json({ message: `${entityType} not found` });
    }

    // Clear token
    entity.token = null;
    await entity.save();

    return res.status(200).json({ 
      message: `${entityType} logged out successfully`,
      entityType 
    });
    
  } catch (error) {
    console.error(`${entityType} logout error:`, error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
};
export {
  registerClinic,
  login,
  generateOTP,
  sendOTPEmail,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getPendingClinicRequests,
  getPatientDetails,
  updateConsultationStatus,
  getApprovedProviders,
  getAllPharmacies,
  getPharmacyById,
  getAllLaboratories,
  getLaboratoryById,
  clinicLogout
};
