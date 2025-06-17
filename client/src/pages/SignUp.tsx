import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Home,
} from "lucide-react";
import { authAPI } from "../services/api";
import { signupSchema } from "../schemas/auth.schemas";
import type { SignupData, SignupFormData } from "../types/auth.types";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";
import { getPasswordStrength } from "../utils/utils";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, touchedFields },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const signupData: SignupData = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      await authAPI.signup(signupData);

      showSuccessToast(
        "Account created successfully!",
        "Welcome to EstateX. Please sign in to continue."
      );

      navigate("/sign-in");
    } catch (error) {
      showErrorToast(
        "Signup failed",
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password || "");

  return (
    <div className="min-h-screen bg-main flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 mb-6 group"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg group-hover:shadow-lg transition-all duration-300">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Estate
              </span>
              <span className="text-orange-500 dark:text-orange-400 ml-1">
                X
              </span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-primary mb-2">
            Create Account
          </h1>
          <p className="text-secondary">Join thousands of property seekers</p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-default p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
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
                  className={`w-full pl-10 pr-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.username
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.username && !errors.username
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder="Enter your username"
                />
                {touchedFields.username && !errors.username && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username.message}
                </p>
              )}
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.email
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.email && !errors.email
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder="Enter your email"
                />
                {touchedFields.email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
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
                  className={`w-full pl-10 pr-12 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.password
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.password && !errors.password
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
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
                    <span className="text-xs font-medium text-muted">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
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
                  className={`w-full pl-10 pr-12 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-primary placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.confirmPassword
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400"
                      : touchedFields.confirmPassword && !errors.confirmPassword
                      ? "border-green-500 dark:border-green-400 focus:border-green-500 dark:focus:border-green-400"
                      : "border-input focus:border-blue-500 dark:focus:border-blue-400"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted hover:text-primary transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-secondary">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-accent hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-sm text-muted mt-6">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
