export const getPasswordStrength = (password: string) => {
  if (!password) return { strength: 0, label: "", color: "" };

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengthData = [
    { label: "", color: "" },
    { label: "Weak", color: "bg-red-500 dark:bg-red-400" },
    { label: "Fair", color: "bg-orange-500 dark:bg-orange-400" },
    { label: "Good", color: "bg-yellow-500 dark:bg-yellow-400" },
    { label: "Strong", color: "bg-green-500 dark:bg-green-400" },
    { label: "Very Strong", color: "bg-emerald-500 dark:bg-emerald-400" },
  ];

  return { strength, ...strengthData[strength] };
};
