import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectCurrentUser } from "../redux/user/userSlice";

interface PrivateRoutesProps {
  children: React.ReactNode;
}

// Multiple Private Routes Wrapper
const PrivateRoutes: React.FC<PrivateRoutesProps> = ({ children }) => {
  const { currentUser } = useSelector(selectCurrentUser);

  if (!currentUser) {
    return <Navigate to="/overview" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoutes;
