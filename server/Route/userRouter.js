import { Router } from "express";
import {
  registerPatient,
  bookConsultation,
  // getUserConsultations,
  uploadPharmacyOrLabPrescription,
  getUserPrescriptionRequests,
  getUserConsultationById,
  getUserPrescriptionById,
  forgotPassword,
  verifyOTP,
  resetPassword,
  userLogout,
} from "../Controller/userController.js";
import { login } from "../Controller/clinicController.js";
import prescriptionUpload from "../multer/PrescriptionMulter.js";
const userRouter = Router();

userRouter.post("/register", registerPatient);
userRouter.post("/login", login);
userRouter.post("/consultations", bookConsultation);
userRouter.post("/prescriptions",prescriptionUpload.single("prescription"),uploadPharmacyOrLabPrescription);
// userRouter.get("/getconsultations", getUserConsultations);
userRouter.get("/consultations/:id", getUserConsultationById);
userRouter.get("/getprescriptions", getUserPrescriptionRequests);
userRouter.get("/prescriptions/:id", getUserPrescriptionById);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/logout", userLogout);


export default userRouter;
