import firebaseAdminAuth from "../config/firebaseAdmin.js";

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const idToken = authHeader.split(" ")[1];

    const decodedToken =
      await firebaseAdminAuth.verifyIdToken(idToken);

    req.firebaseUser = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
};

export default verifyFirebaseToken;