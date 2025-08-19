import { Router } from "express";
import { getNotifications, markAllNotificationsAsRead, markNotificationsAsRead } from "../Controller/notificationController.js"
import authMiddleware from "../middleware/authMiddleware.js";
const notificationRouter = Router();
notificationRouter.use(authMiddleware); //every route on this router is token authenticated
notificationRouter.route('/get-notifications').get(getNotifications);
notificationRouter.route('/read-notification').post(markNotificationsAsRead); 
notificationRouter.route('/read-all-notifications').post(markAllNotificationsAsRead);   


export default notificationRouter
