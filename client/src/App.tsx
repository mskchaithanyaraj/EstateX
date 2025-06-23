import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import ListingDetail from "./pages/ListingDetail";
import EditListing from "./pages/EditListing";
import SearchResults from "./pages/SearchResults";
import PageTransition from "./components/PageTransition";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/overview"
            element={
              <PageTransition>
                <OverviewPage />
              </PageTransition>
            }
          />
          <Route
            path="/not-found"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="/sign-in"
            element={
              <PageTransition>
                <SignIn />
              </PageTransition>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PageTransition>
                <SignUp />
              </PageTransition>
            }
          />
          <Route
            path="/terms-and-privacy"
            element={
              <PageTransition>
                <TermsAndPrivacy />
              </PageTransition>
            }
          />
          <Route
            path="/listings/:id"
            element={
              <PageTransition>
                <ListingDetail />
              </PageTransition>
            }
          />

          {/* Private Routes - Keep your reusable structure */}
          <Route
            path="/*"
            element={
              <PrivateRoutes>
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PageTransition>
                        <Profile />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PageTransition>
                        <Settings />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/create-listing"
                    element={
                      <PageTransition>
                        <CreateListing />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <PageTransition>
                        <MyListings />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <PageTransition>
                        <SearchResults />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/listings/:id/edit"
                    element={
                      <PageTransition>
                        <EditListing />
                      </PageTransition>
                    }
                  />
                </Routes>
              </PrivateRoutes>
            }
          />

          {/* Catch all route */}
          <Route
            path="*"
            element={
              <PageTransition>
                <Navigate to="/not-found" replace />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
