import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function ProtectedRoute({ allowedRole, loginPath, children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/profile/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setUserRole(result.profile?.role || null);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Access verification failed:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Checking access...</p>;
  }

  if (!auth.currentUser) {
    return <Navigate to={loginPath} replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;