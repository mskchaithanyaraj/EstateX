import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Camera,
  Edit3,
  Save,
  X,
  Calendar,
  Shield,
  Settings,
  Eye,
  EyeOff,
  Key,
  Trash2,
} from "lucide-react";
import { selectCurrentUser, signInSuccess } from "../redux/user/userSlice";
import { profileAPI } from "../services/api";
import type {
  UpdateProfileData,
  ChangePasswordData,
} from "../types/profile.types";
import { showErrorToast, showSuccessToast } from "../utils/custom-toast";

const Profile = () => {
  const { currentUser } = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    fullname: currentUser?.fullname || "",
    username: currentUser?.username || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updateData: UpdateProfileData = {};

      // Only include changed fields
      if (formData.fullname !== currentUser?.fullname) {
        updateData.fullname = formData.fullname.trim();
      }
      if (formData.username !== currentUser?.username) {
        updateData.username = formData.username.trim();
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        showSuccessToast("No Changes", "No changes detected to save");
        return;
      }

      const response = await profileAPI.updateProfile(updateData);

      // Update Redux state with new data
      const updatedUser = {
        id: response._id,
        username: response.username,
        fullname: response.fullname,
        email: response.email,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        avatar: response.avatar,
      };

      dispatch(signInSuccess(updatedUser));
      setIsEditing(false);

      // Show success toast
      showSuccessToast(
        "Profile Updated!",
        "Your profile information has been updated successfully"
      );
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to update profile";

      // Show error toast
      showErrorToast("Update Failed", errorMsg);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1700);
    }
  };

  const handleChangePassword = async () => {
    // TODO: Hide for google users
    // TODO: Add validation for current password ( min 8-10 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character )
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      const errorMsg = "New passwords don't match!";

      showErrorToast("Password Mismatch", errorMsg);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      const errorMsg = "New password must be at least 8 characters long!";

      showErrorToast("Password Too Short", errorMsg);
      return;
    }

    setPasswordLoading(true);

    try {
      const changePasswordData: ChangePasswordData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };

      await profileAPI.changePassword(changePasswordData);

      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success toast
      showSuccessToast(
        "Password Changed!",
        "Your password has been updated successfully"
      );
    } catch (error) {
      console.error("❌ Error changing password:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to change password";

      // Show error toast
      showErrorToast("Password Change Failed", errorMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent upload if not in edit mode
    if (!isEditing) {
      showErrorToast(
        "Edit Mode Required",
        "Please enable edit mode to change your avatar"
      );
      return;
    }

    const file = e.target.files?.[0];
    if (file && currentUser) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Image size must be less than 5MB";

        showErrorToast("File Too Large", errorMsg);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        const errorMsg = "Please select a valid image file";

        showErrorToast("Invalid File Type", errorMsg);
        return;
      }

      setAvatarLoading(true);

      try {
        const response = await profileAPI.uploadAvatar(file, currentUser);

        // Update Redux state
        const updatedUser = {
          ...currentUser,
          avatar: { url: response.avatarUrl, publicId: null },
        };
        dispatch(signInSuccess(updatedUser));

        // Show success toast
        showSuccessToast(
          "Avatar Updated!",
          "Your profile picture has been updated successfully"
        );
      } catch (error) {
        console.error("❌ Error uploading avatar:", error);
        const errorMsg =
          error instanceof Error ? error.message : "Failed to upload avatar";

        // Show error toast
        showErrorToast("Upload Failed", errorMsg);
      } finally {
        setAvatarLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setFormData({
      fullname: currentUser?.fullname || "",
      username: currentUser?.username || "",
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvatarUrl = () => {
    return currentUser?.avatar?.url;
  };

  return (
    <div className="min-h-screen bg-main py-4 sm:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-xtradex text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
            My Profile
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Manage your EstateX account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-card rounded-2xl shadow-xl border border-default p-4 sm:p-6 lg:p-8">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                  {/* Avatar */}
                  <div className="relative group mx-auto sm:mx-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-1">
                      <img
                        src={getAvatarUrl()}
                        alt={currentUser?.username}
                        className="w-full h-full rounded-full object-cover bg-white"
                      />
                      {avatarLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Hover overlay - only show when editing is enabled */}
                    {isEditing && !avatarLoading && (
                      <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={avatarLoading || !isEditing}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Disabled overlay when not editing */}
                    {!isEditing && (
                      <div className="absolute inset-0 rounded-full cursor-not-allowed" />
                    )}
                  </div>

                  <span className="hidden md:block "></span>

                  {/* Basic Info */}
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold text-primary">
                      {currentUser?.fullname || currentUser?.username}
                    </h2>
                    <p className="text-muted flex items-center justify-center sm:justify-start mt-1 text-sm sm:text-base">
                      <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span className="break-all">{currentUser?.email}</span>
                    </p>
                    <p className="text-muted flex items-center justify-center sm:justify-start mt-1 text-sm sm:text-base">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      <span>
                        Member since{" "}
                        {currentUser?.createdAt
                          ? formatDate(currentUser.createdAt)
                          : "Recently"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() =>
                    isEditing ? cancelEdit() : setIsEditing(true)
                  }
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-section hover:bg-input border border-default rounded-xl transition-all duration-200 text-primary hover:text-accent w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel Edit</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              {/* Profile Form */}
              <div className="space-y-4 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-input text-primary border rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base ${
                        !isEditing
                          ? "opacity-60 cursor-not-allowed"
                          : "border-input hover:border-input-focus"
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full pl-10 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-input text-primary border rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base ${
                        !isEditing
                          ? "opacity-60 cursor-not-allowed"
                          : "border-input hover:border-input-focus"
                      }`}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email Address
                    <span className="text-xs text-muted ml-2">
                      (Cannot be changed)
                    </span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted" />
                    <input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="w-full pl-10 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-input text-primary border border-input rounded-xl opacity-60 cursor-not-allowed text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 btn-primary px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 order-2">
            {/* Security Card */}
            <div className="bg-card rounded-2xl shadow-xl border border-default p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                <h3 className="text-base sm:text-lg font-semibold text-primary">
                  Security
                </h3>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Change Password Button */}
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="w-full flex items-center justify-between p-3 bg-section hover:bg-input border border-default rounded-xl transition-all duration-200 text-primary hover:text-accent text-sm sm:text-base"
                >
                  <div className="flex items-center space-x-3">
                    <Key className="w-4 h-4" />
                    <span>Change Password</span>
                  </div>
                  <span className="text-xl sm:text-2xl">
                    {showChangePassword ? "−" : "+"}
                  </span>
                </button>

                {/* Password Change Form */}
                {showChangePassword && (
                  <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-section rounded-xl border border-default">
                    {/* Current Password */}
                    <div className="relative">
                      <input
                        type={
                          showPassword.current ? "text" : "current-password"
                        }
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password"
                        className="w-full pr-10 pl-4 py-2.5 sm:py-3 bg-input text-primary border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-accent"
                      >
                        {showPassword.current ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "new-password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        className="w-full pr-10 pl-4 py-2.5 sm:py-3 bg-input text-primary border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-accent"
                      >
                        {showPassword.new ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "new-password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password"
                        className="w-full pr-10 pl-4 py-2.5 sm:py-3 bg-input text-primary border border-input rounded-xl focus:outline-none focus:border-input-focus focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-sm sm:text-base"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-accent"
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={
                        passwordLoading ||
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                      className="w-full btn-primary py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {passwordLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-card rounded-2xl shadow-xl border border-default p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                <h3 className="text-base sm:text-lg font-semibold text-primary">
                  Settings
                </h3>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left bg-section hover:bg-input border border-default rounded-xl transition-all duration-200 text-primary hover:text-accent text-sm sm:text-base">
                  <User className="w-4 h-4" />
                  <span>Account Preferences</span>
                </button>

                <button className="w-full flex items-center space-x-3 p-3 text-left bg-section hover:bg-input border border-default rounded-xl transition-all duration-200 text-primary hover:text-accent text-sm sm:text-base">
                  <Shield className="w-4 h-4" />
                  <span>Privacy Settings</span>
                </button>

                <button className="w-full flex items-center space-x-3 p-3 text-left bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl transition-all duration-200 text-red-600 dark:text-red-400 text-sm sm:text-base">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-card rounded-2xl shadow-xl border border-default p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary mb-4">
                Account Stats
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted">Properties Viewed</span>
                  <span className="font-medium text-primary">0</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted">Saved Listings</span>
                  <span className="font-medium text-primary">0</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-muted">Profile Completion</span>
                  <span className="font-medium text-accent">
                    {currentUser?.avatar?.url ? "100%" : "85%"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
