import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: Number,
      default: process.env.PATIENT_ROLE || 300,
    },
    clinicRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null
    },
    clinicAdmitted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic",
      default: null
    },
    otp: { type: String },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);