import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import OverviewPage from "./pages/OverviewPage";
import PrivateRoutes from "./components/PrivateRoute";
import { resetAuthState } from "./redux/user/userSlice";
import NotFound from "./pages/NotFound";
import TermsAndPrivacy from "./pages/TermsAndPrivacy";
import Settings from "./pages/Settings";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoutes>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </PrivateRoutes>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </>
  );
};

export default App;
