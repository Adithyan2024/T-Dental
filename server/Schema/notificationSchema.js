import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  receiverRole: { 
    type: Number, 
    enum: [300, 400, 500], 
    required: true 
  },
  entityType: {
    type: String,
    enum: [
      "clinic",
      "laboratory", 
      "pharmacy"
    ],
    required: false // Not required for patients (role 300)
  },
  message: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  readAt: {
    type: Date,
    default: null
  },
  // Optional: Extra data for notifications
  consultationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Consultation',
    required: false
  },
  clinicName: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['approved', 'rejected', 'pending'],
    required: false
  },
  // Alternative time and admin note fields:
  alternativeTime: {
    type: String,
    trim: true,
    default: ''
  },
  adminNote: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: { expires: '90d' } 
  }
});

export default mongoose.model("Notification", notificationSchema);

