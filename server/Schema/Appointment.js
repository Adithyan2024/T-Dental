import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true
  },
  requestedDate: { type: Date, required: true }, // What patient selected
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "cancelled"],
    default: "pending"
  },
  confirmedDate: { type: Date }, // Set by admin
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
