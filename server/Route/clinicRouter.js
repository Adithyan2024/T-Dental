import { Router } from "express";
import { registerClinic, login, forgotPassword, verifyOTP,
  resetPassword, getPendingClinicRequests,getPatientDetails,getApprovedProviders,
  clinicLogout
  } from "../Controller/clinicController.js";
import authClinic from "../middleware/authClinic.js";
import clinicUpload from "../multer/ClinicMulter.js";

const clinicRouter = Router();

// 👇 Fix: use `.single("fieldName")` if uploading a single file
clinicRouter.post("/register", clinicUpload.single("licenseProof"), registerClinic);
clinicRouter.post("/login", login);
clinicRouter.post("/forgot-password", forgotPassword);
clinicRouter.post("/reset-password", resetPassword);
clinicRouter.post("/verify-otp", verifyOTP);
clinicRouter.get("/approved-clinics", getApprovedProviders);
clinicRouter.get("/my-patients", authClinic, getPendingClinicRequests);
clinicRouter.get("/patient-details/:patientId", authClinic, getPatientDetails);
clinicRouter.post("/logout", clinicLogout);

// clinicRouter.get("/my-consultations", authClinic, getMyConsultations);

export default clinicRouter;
