import firebaseAdminAuth from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const idToken = authHeader.slice(7).trim();

    if (!idToken) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required.",
      });
    }

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(idToken);

    req.firebaseUser = decodedToken;

    return next();
  } catch (error) {
    console.error("Firebase token verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token.",
    });
  }
};

export default verifyFirebaseToken;