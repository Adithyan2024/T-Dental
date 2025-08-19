import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  consultationTime: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'serviceType'
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Clinic', 'Laboratory']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  adminNote: {
  type: String,
  trim: true,
  default: ''
},
alternativeTime: {
  type: String,
  trim: true,
  default: ''
},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

consultationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;