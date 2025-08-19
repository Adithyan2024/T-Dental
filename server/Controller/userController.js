import Patient from "../Schema/Patient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Consultation from "../Schema/Consultaion.js";
import PharmacyLabRequest from "../Schema/PharmacyLabReq.js";
import sendEmail from "../utils/sendEmail.js";
import Pharmacy from "../Schema/Pharmacy.js";
import nodemailer from "nodemailer";
import Laboratory from "../Schema/Laboratory.js";

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRY;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: ACCESS_TOKEN_SECRET not defined");
  process.exit(1);
}
// Register Patient
const registerPatient = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number. Must be a 10-digit Indian number starting with 6-9.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      });
    }

    // Check if phone or email already exists
    const existingPatient = await Patient.findOne({
      $or: [{ phone }, { email }],
    });

    if (existingPatient) {
      return res.status(400).json({
        message: "Phone or email already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create patient
    const newPatient = new Patient({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newPatient.save();

    return res.status(201).json({
      message: "Registration successful",
      patientId: newPatient._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error registering patient",
      error: err.message,
    });
  }
};



// Login Patient


const bookConsultation = async (req, res) => {
  try {
    const { fullName, phoneNumber, consultationTime, purpose, service, serviceType } = req.body;
    
    let patientId = null;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        patientId = decoded.patientId || decoded.id; // Use patientId instead of userId
      } catch (error) {
        console.log('Invalid token provided for consultation booking');
      }
    }
    
    if (!fullName || !phoneNumber || !consultationTime || !purpose || !service || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (!['Clinic', 'Laboratory'].includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Service type must be either Clinic or Laboratory'
      });
    }

    const consultation = new Consultation({
      fullName,
      phoneNumber,
      consultationTime,
      purpose,
      service,
      serviceType,
      patientId, // Use patientId instead of userId
      status: 'pending'
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted for admin approval',
      consultationId: consultation._id,
      data: consultation
    });

  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking consultation',
      error: error.message
    });
  }
};

// const getUserConsultations = async (req, res) => {
//   try {
//     // Get user from token
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Access token required'
//       });
//     }

//     let userId;
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       userId = decoded.userId || decoded.id;
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid access token'
//       });
//     }

//     const { status, page = 1, limit = 10 } = req.query;
//     const filter = { userId }; // Filter by logged-in user
    
//     if (status) filter.status = status;

//     const consultations = await Consultation.find(filter)
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Consultation.countDocuments(filter);

//     res.status(200).json({
//       success: true,
//       data: consultations,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit)
//       }
//     });

//   } catch (error) {
//     console.error('Error fetching user consultations:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching consultations',
//       error: error.message
//     });
//   }
// };

// ============= USER PHARMACY FUNCTIONS =============

const uploadPharmacyOrLabPrescription = async (req, res) => {
  try {
    const authHeader = req.header("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const {
      doctor,
      date,
      service,
      type,
      username,
      mobile,
      providerId,
      notes,
    } = req.body;

    if (!["pharmacy", "lab"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type (must be "pharmacy" or "lab")',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Prescription file is required",
      });
    }

    let provider, providerModel;
    if (type === "pharmacy") {
      provider = await Pharmacy.findById(providerId);
      providerModel = "Pharmacy";
    } else {
      provider = await Laboratory.findById(providerId);
      providerModel = "Laboratory";
    }

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: `${
          type === "pharmacy" ? "Pharmacy" : "Laboratory"
        } not found`,
      });
    }

    const newRequest = new PharmacyLabRequest({
      type,
      doctor,
      date: new Date(date),
      service,
      userId,
      username,
      mobile,
      notes,
      providerId,
      providerModel,
      providerName: provider.name,
      providerEmail: provider.email,
      prescriptionFile: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });

    await newRequest.save();

    await sendPrescriptionEmail(provider, newRequest, req.file, type);

    res.status(201).json({
  success: true,
  message: `Prescription uploaded and sent to ${provider.name} successfully`,
  requestId: newRequest._id,
  prescriptionImageUrl: `https://t-dental-lpw1.onrender.com/uploads/prescriptions/${req.file.filename}`,
});

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getUserPrescriptionRequests = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access token required" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const requests = await PharmacyLabRequest
      .find({ userId })
      .populate('service')
      .populate('providerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUserConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });

  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultation',
      error: error.message
    });
  }
};

 const getUserPrescriptionById = async (req, res) => {
  try {
    const prescription = await PharmacyLabRequest.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    const obj = prescription.toObject();
    if (obj.prescriptionFile?.filename) {
      obj.prescriptionFile.fullUrl = `${req.protocol}://${req.get("host")}/uploads/prescriptions/${obj.prescriptionFile.filename}`;
    }

    res.status(200).json({
      success: true,
      data: obj
    });
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
const sendPrescriptionEmail = async (provider, request, file, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const typeDisplayName = type === 'pharmacy' ? 'Pharmacy' : 'Laboratory';
    const hasFile = file && file.originalname;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: provider.email,
      subject: `New Prescription Request - ${provider.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Prescription Request</h2>
            <p style="margin: 5px 0 0 0;">Received for ${provider.name}</p>
          </div>
          
          <div style="padding: 20px;">
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Patient Details</h3>
              <p><strong>Patient Name:</strong> ${request.username}</p>
              <p><strong>Mobile:</strong> ${request.mobile}</p>
              <p><strong>Doctor:</strong> ${request.doctor}</p>
              <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
              <p><strong>Service Type:</strong> ${typeDisplayName}</p>
              ${request.notes ? `<p><strong>Notes:</strong> ${request.notes}</p>` : ''}
              <p><strong>Request ID:</strong> ${request._id}</p>
            </div>

            ${
              hasFile && file.mimetype.startsWith('image/')
                ? `
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📎 Prescription Image:</h3>
              <p style="margin: 5px 0;"><strong>File:</strong> ${file.originalname}</p>
              <p style="margin: 5px 0 15px 0; font-size: 12px; color: #666;">
                File size: ${(file.size / 1024).toFixed(2)} KB | Type: ${file.mimetype}
              </p>
              
              <!-- Embedded Image -->
              <div style="text-align: center; margin: 15px 0;">
                <img src="cid:prescription_image" 
                     alt="Prescription" 
                     style="max-width: 100%; height: auto; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              </div>
              
              <p style="font-size: 12px; color: #666; text-align: center; margin: 10px 0 0 0;">
                Click on the image to view in full size
              </p>
            </div>`
                : hasFile
                ? `
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>📎 Prescription File:</strong> ${file.originalname}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                File size: ${(file.size / 1024).toFixed(2)} KB | Type: ${file.mimetype}
              </p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #856404;">
                <strong>Note:</strong> File is attached but cannot be displayed inline (non-image format)
              </p>
            </div>`
                : `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;"><strong>No prescription file was uploaded with this request.</strong></p>
            </div>`
            }

            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4CAF50;">
              <h4 style="color: #333; margin: 0 0 10px 0;">Next Steps:</h4>
              <ul style="margin: 0; padding-left: 20px; color: #555;">
                <li>Review the prescription image above</li>
                <li>Contact patient at ${request.mobile} if clarification needed</li>
                <li>Process the ${typeDisplayName.toLowerCase()} request</li>
                <li>Update patient with availability and pricing</li>
              </ul>
            </div>

            <p style="color: #666; font-size: 14px;">
              Please check your system for the complete request details.
              Contact the patient directly for any clarifications needed.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              This is an automated notification. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
      attachments: hasFile
        ? [
            {
              filename: file.originalname,
              path: file.path,
              // For image files, also embed them inline
              ...(file.mimetype.startsWith('image/') ? {
                cid: 'prescription_image' // Content ID for inline embedding
              } : {})
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${provider.name} (${provider.email}) with ${hasFile && file.mimetype.startsWith('image/') ? 'embedded' : 'attached'} prescription`);
    
  } catch (error) {
    console.error('Email sending error:', error);
    throw error; // Re-throw to handle in calling function
  }
};
const sendPrescriptionEmailBase64 = async (provider, request, file, type) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const typeDisplayName = type === 'pharmacy' ? 'Pharmacy' : 'Laboratory';
    const hasFile = file && file.originalname;
    
    let imageBase64 = '';
    if (hasFile && file.mimetype.startsWith('image/')) {
      try {
        const imageBuffer = fs.readFileSync(file.path);
        imageBase64 = `data:${file.mimetype};base64,${imageBuffer.toString('base64')}`;
      } catch (err) {
        console.error('Error reading image file:', err);
      }
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: provider.email,
      subject: `New Prescription Request - ${provider.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <!-- Header section remains the same -->
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Prescription Request</h2>
            <p style="margin: 5px 0 0 0;">Received for ${provider.name}</p>
          </div>
          
          <div style="padding: 20px;">
            <!-- Patient details section remains the same -->
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Patient Details</h3>
              <p><strong>Patient Name:</strong> ${request.username}</p>
              <p><strong>Mobile:</strong> ${request.mobile}</p>
              <p><strong>Doctor:</strong> ${request.doctor}</p>
              <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
              <p><strong>Service Type:</strong> ${typeDisplayName}</p>
              ${request.notes ? `<p><strong>Notes:</strong> ${request.notes}</p>` : ''}
              <p><strong>Request ID:</strong> ${request._id}</p>
            </div>

            ${
              imageBase64
                ? `
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📎 Prescription Image:</h3>
              <p style="margin: 5px 0 15px 0;"><strong>File:</strong> ${file.originalname}</p>
              
              <!-- Base64 Embedded Image -->
              <div style="text-align: center; margin: 15px 0;">
                <img src="${imageBase64}" 
                     alt="Prescription" 
                     style="max-width: 100%; max-height: 600px; height: auto; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              </div>
            </div>`
                : hasFile
                ? `
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0;"><strong>📎 Prescription File:</strong> ${file.originalname}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">File attached</p>
            </div>`
                : `
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;"><strong>No prescription file uploaded.</strong></p>
            </div>`
            }

            <p style="color: #666; font-size: 14px;">
              Please review the prescription and contact the patient at ${request.mobile} for any clarifications.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              This is an automated notification. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${provider.name} (${provider.email}) with embedded prescription image`);
    
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};
const getAllProviders = async (req, res) => {
  try {
    const { type } = req.query; // 'clinic', 'pharmacy', 'lab', or no filter for all
    
    let providers = [];
    
    if (!type || type === 'clinic') {
      const clinics = await Clinic.find({ status: 'approved' })
        .select('name email phone address location specializations numberOfDoctors')
        .sort({ name: 1 });
      providers.push(...clinics.map(c => ({ ...c.toObject(), type: 'clinic' })));
    }
    
    if (!type || type === 'pharmacy') {
      const pharmacies = await Pharmacy.find({ status: 'approved' })
        .select('name email phone address location services')
        .sort({ name: 1 });
      providers.push(...pharmacies.map(p => ({ ...p.toObject(), type: 'pharmacy' })));
    }
    
    if (!type || type === 'lab') {
      const laboratories = await Laboratory.find({ status: 'approved' })
        .select('name email phone address location services')
        .sort({ name: 1 });
      providers.push(...laboratories.map(l => ({ ...l.toObject(), type: 'lab' })));
    }
    
    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) { 
    console.error('Error fetching providers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Helper function to send OTP email
const sendOTPEmail = async (email, otp, name) => {
  const subject = 'Password Reset OTP - T-Dent Care';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>You have requested to reset your password. Please use the following OTP to verify your identity:</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
      </div>
      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #6c757d; font-size: 14px;">
        Best regards,<br>
        T-Dent Care Team
      </p>
    </div>
  `;
  
  return await sendEmail({ to: email, subject, html });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    let user;
    let Model;

    // Determine which model to use based on role
    if (role == process.env.CLINIC_ROLE) {
      Model = Clinic;
      user = await Clinic.findOne({ email });
    } else if (role == 300) {
      Model = Patient;
      user = await Patient.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role" });
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
      console.log(otp);

    res.status(200).json({
      message: "OTP sent to your email address",
      email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // Masked email for security
      
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    if (!email || !role || !otp) {
      return res
        .status(400)
        .json({ message: "Email, role, and OTP are required" });
    }

    let user;
    let Model;

    if (role == process.env.CLINIC_ROLE) {
      Model = Clinic;
    } else if (role == 300) {
      Model = Patient;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, role } = req.body;

    if (!email || !newPassword || !role) {
      return res
        .status(400)
        .json({ message: "Email, new password, and role are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    let user;
    let Model;

    if (role == process.env.CLINIC_ROLE) {
      Model = Clinic;
    } else if (role == 300) {
      Model = Patient;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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
//user logout
const userLogout = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await Patient.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.token = null;
    await user.save();

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
export{
    registerPatient,
    bookConsultation,
    // getUserConsultations,
    uploadPharmacyOrLabPrescription,
    getUserPrescriptionRequests,
    getUserConsultationById,
    getUserPrescriptionById,
    sendPrescriptionEmail,
    sendPrescriptionEmailBase64,
    getAllProviders,
    forgotPassword, 
    verifyOTP,
     resetPassword,
     userLogout

}