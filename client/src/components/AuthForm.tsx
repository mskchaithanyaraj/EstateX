import React, { useState, useEffect } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { authAPI } from "../services/api";
import { signupSchema, signinSchema } from "../schemas/auth.schemas";
import type {
  SignupFormData,
  SigninFormData,
  SignupData,
  SigninData,
} from "../types/auth.types";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";
import { getPasswordStrength } from "../utils/utils";
import {
  // Sign In
  signInStart,
  signInSuccess,
  signInFailure,
  selectSignInLoading,
  clearSignInError,
  // Sign Up
  signUpStart,
  signUpSuccess,
  signUpFailure,
  selectSignUpLoading,
  clearSignUpError,
  resetAuthState,
} from "../redux/user/userSlice";
import { type AppDispatch } from "../redux/store";
import OAuth from "./OAuth";

type AuthType = "signup" | "signin";

interface AuthFormProps {
  type: AuthType;
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux selectors
  const signInLoading = useSelector(selectSignInLoading);
  const signUpLoading = useSelector(selectSignUpLoading);

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSignup = type === "signup";

  // Determine which loading/error state to use
  const isLoading = isSignup ? signUpLoading : signInLoading;
  // Form configuration
  const schema = isSignup ? signupSchema : signinSchema;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm<SignupFormData | SigninFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const password = watch("password");
  const signupErrors = errors as FieldErrors<SignupFormData>;
  const signupTouched = touchedFields as Partial<
    Record<keyof SignupFormData, boolean>
  >;

  useEffect(() => {
    // Reset auth state when form loads
    dispatch(resetAuthState());
  }, [dispatch]);

  // Clear errors when component mounts or type changes
  useEffect(() => {
    if (isSignup) {
      dispatch(clearSignUpError());
    } else {
      dispatch(clearSignInError());
    }
    reset(); // Reset form when switching between signup/signin
  }, [type, dispatch, reset, isSignup]);

  // Handle form submission
  const onSubmit = async (data: SignupFormData | SigninFormData) => {
    try {
      if (isSignup) {
        dispatch(signUpStart());

        const signupData = data as SignupFormData;
        const payload: SignupData = {
          fullname: signupData.fullname,
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
        };

        await authAPI.signup(payload);
        dispatch(signUpSuccess());

        showSuccessToast(
          "Account created successfully!",
          "Welcome to EstateX. Please sign in to continue."
        );
        navigate("/sign-in");
      } else {
        dispatch(signInStart());

        const signinData = data as SigninFormData;
        const payload: SigninData = {
          email: signinData.email,
          password: signinData.password,
        };

        const response = await authAPI.signin(payload);

        // Transform response to match User interface
        const user = {
          id: response._id,
          username: response.username,
          email: response.email,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          fullname: response.fullname,
          avatar: response.avatar, // Ensure avatar is always a string
        };

        dispatch(signInSuccess(user));

        showSuccessToast(
          "Welcome back!",
          `Signed in successfully as ${user.fullname}`
        );
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";

      if (isSignup) {
        dispatch(signUpFailure(errorMessage));
      } else {
        dispatch(signInFailure(errorMessage));
      }

      // Show toast notification for immediate feedback
      showErrorToast(
        isSignup ? "Signup failed" : "Signin failed",
        errorMessage
      );
    }
  };

  const passwordStrength = isSignup
    ? getPasswordStrength(password || "")
    : null;

  // Configuration object for different auth types
  const config = {
    signup: {
      title: "Create Account",
      subtitle: "Join thousands of property seekers",
      submitText: "Create Account",
      loadingText: "Creating Account...",
      alternateText: "Already have an account?",
      alternateLink: "/sign-in",
      alternateLinkText: "Sign in here",
    },
    signin: {
      title: "Welcome Back",
      subtitle: "Sign in to your EstateX account",
      submitText: "Sign In",
      loadingText: "Signing in...",
      alternateText: "Don't have an account?",
      alternateLink: "/sign-up",
      alternateLinkText: "Create one here",
    },
  };

  const currentConfig = config[type];

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4 py-8 scrollbar-custom">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center space-x-3 group"
          >
            <div
              className="font-extrabold text-5xl flex items-center"
              style={{ fontFamily: "Xtradex" }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-800 dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 bg-clip-text text-transparent p-1">
                Estate
              </span>
              <span className="ml-1 text-amber-600 dark:text-amber-400 group-hover:text-amber-500 transition-colors duration-300">
                X
              </span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold text-primary mb-2">
            {currentConfig.title}
          </h1>
          <p className="text-secondary">{currentConfig.subtitle}</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-default p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {isSignup && (
              <div className="relative">
                <label htmlFor="fullname" className="sr-only">
                  Full Name
                </label>
                <input
                  id="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 bg-input text-primary border rounded-xl
                 focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20
                 transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400
                 ${
                   signupErrors.fullname ? "border-input-error" : "border-input"
                 }`}
                  {...register("fullname")}
                />

                {/* Validation Icons */}
                {signupTouched.fullname && !signupErrors.fullname && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                )}

                {signupErrors.fullname && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}

                {/* Error Message */}
                {signupErrors.fullname && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {signupErrors.fullname.message}
                  </p>
                )}
              </div>
            )}
            {/* Username Field - Only for Signup */}
            {isSignup && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    {...register("username")}
                    type="text"
                    id="username"
                    autoComplete="username"
                    className={`w-full pl-10 pr-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                      signupErrors.username
                        ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                        : signupTouched.username && !signupErrors.username
                        ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                        : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                    }`}
                    placeholder="Enter your username"
                    disabled={isLoading}
                  />
                  {signupTouched.username && !signupErrors.username && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                  )}
                </div>

                {signupErrors.username && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {signupErrors.username.message}
                  </p>
                )}
              </div>
            )}
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.email && !errors.email
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {touchedFields.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted" />
                </div>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  className={`w-full pl-10 pr-12 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.password
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.password && !errors.password
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder={
                    isSignup
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator - Only for Signup */}
              {isSignup && password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted min-w-0">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Confirm Password Field - Only for Signup */}
            {isSignup && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-primary mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                      signupErrors.confirmPassword
                        ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                        : signupTouched.confirmPassword &&
                          !signupErrors.confirmPassword
                        ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                        : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                    )}
                  </button>
                </div>
                {signupErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
            {/* Forgot Password Link - Only for Signin */}
            {!isSignup && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full btn-primary py-3 px-4 rounded-xl font-semibold text-white 
                       transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{currentConfig.loadingText}</span>
                </>
              ) : (
                <>
                  <span>{currentConfig.submitText}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-default"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Button */}
          <OAuth disabled={isLoading} />

          {/* Alternate Action Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary">
              {currentConfig.alternateText}{" "}
              <Link
                to={currentConfig.alternateLink}
                className="text-accent hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                {currentConfig.alternateLinkText}
              </Link>
            </p>
          </div>
        </div>

        {/* Terms - Only for Signup */}
        {isSignup && (
          <p className="text-center text-sm text-muted mt-6">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms-and-privacy"
              className="text-accent hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/terms-and-privacy"
              className="text-accent hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
