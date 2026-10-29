import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function ProtectedRoute({
  allowedRole,
  loginPath,
  authType = "customer",
  children,
}) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const permittedRoles = Array.isArray(allowedRole)
    ? allowedRole
    : [allowedRole];

  const activeAuth = auth;

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError("");

    const unsubscribe = onAuthStateChanged(
      activeAuth,
      async (currentUser) => {
        if (!active) return;

        setUser(currentUser);

        if (!currentUser) {
          setUserRole(null);
          setLoading(false);
          return;
        }

        setLoading(true);

        try {
          const token = await currentUser.getIdToken();

          const response = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/profile/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              result.message || `Profile verification failed (${response.status})`
            );
          }

          if (active) {
            setUserRole(result.profile?.role || null);
          }
        } catch (err) {
          console.error("ProtectedRoute verification failed:", err);

          if (active) {
            setError(err.message || "Unable to verify your account.");
          }
        } finally {
          if (active) setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase auth state error:", err);

        if (active) {
          setError(err.message || "Unable to restore the authentication session.");
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [activeAuth]);

  if (loading) {
    return <p className="p-6">Checking access...</p>;
  }

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="font-bold">Unable to verify access</h2>
        <p>{error}</p>
        <p>Authentication instance: {authType}</p>
        <p>Account: {user.email}</p>
      </div>
    );
  }

  if (!permittedRoles.includes(userRole)) {
    return (
      <div className="p-6">
        <h2 className="font-bold">Access denied</h2>
        <p>Expected role: {permittedRoles.join(", ")}</p>
        <p>Received role: {userRole || "No role returned"}</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;