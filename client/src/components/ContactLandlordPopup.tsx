import { useState, useEffect } from "react";
import { X, Mail, MessageSquare, Loader2 } from "lucide-react";
import { userAPI } from "../services/api";
import type { User } from "../redux/user/userSlice";
import { Link } from "react-router-dom";

interface ContactLandlordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  landlordId: string;
  listingTitle?: string;
}

const ContactLandlordPopup = ({
  isOpen,
  onClose,
  landlordId,
  listingTitle = "Property",
}: ContactLandlordPopupProps) => {
  const [landlord, setLandlord] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Fetch landlord data when popup opens
  useEffect(() => {
    if (isOpen && landlordId) {
      const fetchLandlord = async () => {
        setLoading(true);
        setError(null);
        try {
          const landlordData = await userAPI.getUserById(landlordId);
          setLandlord(landlordData);

          // Set default message
          setMessage(
            `Hi ${landlordData.fullname},\n\nI'm interested in your property listing: "${listingTitle}".\n\nCould you please provide more details?\n\nThank you!`
          );
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || "Failed to fetch landlord information");
          } else {
            setError("Failed to fetch landlord information");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchLandlord();
    }
  }, [isOpen, landlordId, listingTitle]);

  // Reset state when popup closes
  useEffect(() => {
    if (!isOpen) {
      setLandlord(null);
      setError(null);
      setMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailContact = () => {
    if (!landlord?.email) return;

    const subject = encodeURIComponent(`Inquiry about: ${listingTitle}`);
    const body = encodeURIComponent(message);
    const mailtoLink = `mailto:${landlord.email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl border border-default max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-default">
          <h2 className="text-xl font-bold text-primary">Contact Landlord</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-muted hover:text-primary transition-colors rounded-lg hover:bg-section"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-3 text-muted">Loading landlord info...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-500" />
              </div>

              {error.includes("not authenticated") ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      Sign In Required
                    </h3>
                    <p className="text-muted text-sm mb-4">
                      You need to be signed in to view contact information
                    </p>
                  </div>
                  <Link
                    to="/sign-in"
                    className="inline-flex items-center justify-center px-6 py-3 bg-accent hover:bg-accent/90 dark:bg-blue-950 dark:hover:bg-accent/80 dark:text-white font-medium rounded-xl transition-colors shadow-sm hover:shadow-md"
                    onClick={onClose}
                  >
                    Sign In to Continue
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Something went wrong
                  </h3>
                  <p className="text-red-600 dark:text-red-400 text-sm leading-relaxed">
                    {error}
                  </p>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      window.location.reload();
                    }}
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}

          {landlord && !loading && !error && (
            <>
              {/* Landlord Info */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <img
                    src={
                      landlord.avatar?.url ||
                      `https://ui-avatars.com/api/?name=${landlord.fullname}&background=f97316&color=fff`
                    }
                    alt={landlord.fullname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {landlord.fullname}
                    </h3>
                    <p className="text-sm text-muted">@{landlord.username}</p>
                  </div>
                </div>
                <p className="text-muted text-sm">Property: {listingTitle}</p>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                {landlord.email && (
                  <button
                    onClick={handleEmailContact}
                    className="w-full btn-primary py-4 rounded-xl flex items-center justify-center space-x-3"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Send Email</span>
                  </button>
                )}
              </div>

              {/* Message Preview */}
              {landlord.email && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-primary">
                    Message Preview:
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 px-4 py-3 rounded-xl border border-default bg-section text-primary resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Write your message..."
                  />
                  <p className="text-xs text-muted">
                    This message will be included in the email
                  </p>
                </div>
              )}

              {!landlord.email && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted mx-auto mb-3" />
                  <p className="text-muted">
                    No contact information available for this landlord.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactLandlordPopup;
