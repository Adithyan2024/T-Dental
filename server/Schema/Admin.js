import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, default: process.env.ADMIN_ROLE || 500 },
});

export default mongoose.model("Admin", adminSchema);
