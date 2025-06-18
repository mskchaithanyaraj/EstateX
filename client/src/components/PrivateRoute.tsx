import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectCurrentUser } from "../redux/user/userSlice";

interface PrivateRoutesProps {
  children: React.ReactNode;
}

// Multiple Private Routes Wrapper
const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ children }) => {
  const { currentUser } = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoutes;
