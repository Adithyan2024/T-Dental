import { Router } from "express";
import { registerAdmin, loginAdmin,getPendingClinics,updateClinicStatus,getPendingConsultations,updateConsultationStatus, adminLogout } from "../Controller/adminController.js";

const adminRouter = Router();

adminRouter.post("/registeradmin", registerAdmin);
adminRouter.post("/loginadmin", loginAdmin);
adminRouter.get("/pending-clinics", getPendingClinics); 
adminRouter.patch("/verify/:type/:id", updateClinicStatus);
adminRouter.get("/pending-clinic-requests", getPendingConsultations); //get the consultation info of users who applied to the clinic
adminRouter.patch("/update-status", updateConsultationStatus); //to accept or reject the patients to the clinic
adminRouter.post("/logout", adminLogout);


export default adminRouter;
