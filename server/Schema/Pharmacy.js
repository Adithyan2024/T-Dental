import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    services: [{ type: String, required: true }], // Available pharmacy services
    licenseProof: { type: String }, // File path or URL
    password: { type: String, required: true },
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

export default mongoose.model("Pharmacy", pharmacySchema);