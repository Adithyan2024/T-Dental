import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import connectDb from "./mongoDb/connectDb.js";
import {baseUrl} from "./baseUrl.js"

// Routers
import userRouter from "./Route/userRouter.js";
import clinicRouter from "./Route/clinicRouter.js";
import adminRouter from "./Route/adminRouter.js";
import notificationRouter from "./Route/notificationRoute.js";

// Middleware
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: `${baseUrl}`, // Change to your frontend URL in production
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "Uploads")));
app.use(
  "/clinicUploads",
  express.static(path.join(__dirname, "Uploads/clinicUploads"))
);
app.use(
  "/uploads/prescriptions",
  express.static(path.join(__dirname, "Uploads/prescriptionUploads"))
);
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// Global vars for socket
const connectedUsers = new Map();
let io = null;

// Middleware to attach socket info
const injectSocket = (req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
};

// Routes
app.use("/api/user", injectSocket, userRouter);
app.use("/api/clinic", injectSocket, clinicRouter);
app.use("/api/admin", injectSocket, adminRouter);
app.use("/api/notifications", injectSocket, authMiddleware, notificationRouter);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

const PORT = process.env.PORT || 8000;

// Start server & setup Socket.IO
connectDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

    io = new Server(server, {
      cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 New client connected:", socket.id);
      socket.on("register", (userId) => {
        console.log("Register event received with userId:", userId);
        if (userId) {
          const userKey = String(userId).trim();
          console.log("Storing userKey:", userKey);
          connectedUsers.set(userKey, socket.id);
          console.log(`📌 User ${userKey} registered with socket ${socket.id}`);
        }
      });

      socket.on("disconnect", () => {
        for (const [userId, sockId] of connectedUsers.entries()) {
          if (sockId === socket.id) {
            connectedUsers.delete(userId);
            console.log(`🔴 User ${userId} disconnected`);
            break;
          }
        }
      });
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
