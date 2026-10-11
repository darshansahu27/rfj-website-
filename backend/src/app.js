import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import verifyFirebaseToken from "./middleware/verifyFirebaseToken.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/profile", profileRoutes);
app.use("/api/health", healthRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "RFJ backend is working!",
  });
});
app.get("/api/auth/test", verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    message: "Firebase token verified successfully",
    uid: req.firebaseUser.uid,
  });
});

export default app;