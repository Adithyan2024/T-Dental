import { Navigate } from "react-router-dom";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 

interface MyJwtPayload extends JwtPayload {
  role: string;
}

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = useSelector((state: RootState) => state.user.token);

  console.log("🔑 Token from Redux store:", token);
  console.log("✅ Allowed roles for this route:", allowedRoles);

  if (!token) {
    console.warn("🚫 No token found in Redux — redirecting to /login");
    return <Navigate to="/unauthorized" replace />;
  }

  try {
    const decoded = jwtDecode<MyJwtPayload>(token);

    console.log("📜 Decoded JWT payload:", decoded);
    console.log("👤 Extracted user role:", decoded.role);

    if (!allowedRoles.includes(decoded.role)) {
      console.warn(`🚫 Access denied for role '${decoded.role}'. Allowed:`, allowedRoles);
      return <Navigate to="/unauthorized" replace />;
    }

    console.log(`✅ Access granted for role '${decoded.role}'.`);
    return children;
  } catch (err) {
    console.error("❌ Invalid token or decoding error:", err);
    return <Navigate to="/login" replace />;
  }
};

export default RoleProtectedRoute;
