import mongoose from "mongoose";

const pharmacyLabRequestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['pharmacy', 'lab'],
    required: true
  },
  doctor: {
    type: String,
  },
  date: {
    type: Date,
    required: true
  },
  service: {
  type: String,
},
  prescriptionFile: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  username: {
    type: String
  },
  mobile: {
    type: String
  },
  // ADD THESE NEW FIELDS TO YOUR EXISTING MODEL
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'providerModel'
  },
  providerModel: {
    type: String,
    required: true,
    enum: ['Pharmacy', 'Laboratory']
  },
  providerName: {
    type: String,
    required: true
  },
  providerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String
  }
  // END NEW FIELDS
}, { timestamps: true });

export default mongoose.model("PharmacyLabRequest", pharmacyLabRequestSchema);
