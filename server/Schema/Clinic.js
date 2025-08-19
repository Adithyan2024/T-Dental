import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true }, // New field for city/location
    specializations: [{ type: String, required: true }], // Array of specialization IDs
    numberOfDoctors: { type: Number }, // New field
    licenseProof: { type: String }, // File path or URL - not required  
    password: { type: String, required: true },
    acceptsEMI: { type: Boolean, required: true, default: false }, // New field for EMI acceptance
    acceptsInsurance:{ type: Boolean, required: true, default: false },
    role: {
      type: Number,
      default: process.env.CLINIC_ROLE || 400,
    },
    entityType: {
      type: String,
      enum: ["clinic", "pharmacy", "lab"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);