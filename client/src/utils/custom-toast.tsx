import toast from "react-hot-toast";
import CustomToast from "../components/CustomeToast";

// Custom toast functions
export const showSuccessToast = (title: string, message?: string) => {
  toast.custom((t) => (
    <CustomToast t={t} type="success" title={title} message={message} />
  ));
};

export const showErrorToast = (title: string, message?: string) => {
  toast.custom((t) => (
    <CustomToast t={t} type="error" title={title} message={message} />
  ));
};
