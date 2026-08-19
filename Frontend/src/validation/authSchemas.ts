type ValidationResult = {
  isValid: boolean;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return {
      isValid: false,
      message: "Email and password are required",
    };
  }

  if (!emailPattern.test(trimmedEmail)) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
    };
  }

  if (trimmedPassword.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  return { isValid: true };
};

export const validateRegisterForm = ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  acceptedTerms,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}): ValidationResult => {
  const trimmedFirstName = firstName.trim();
  const trimmedLastName = lastName.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
  const trimmedConfirmPassword = confirmPassword.trim();

  if (!trimmedFirstName || !trimmedLastName) {
    return {
      isValid: false,
      message: "First name and last name are required",
    };
  }

  if (!trimmedEmail) {
    return {
      isValid: false,
      message: "Email is required",
    };
  }

  if (!emailPattern.test(trimmedEmail)) {
    return {
      isValid: false,
      message: "Please enter a valid email address",
    };
  }

  if (!trimmedPassword || !trimmedConfirmPassword) {
    return {
      isValid: false,
      message: "Password and confirm password are required",
    };
  }

  if (trimmedPassword.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters",
    };
  }

  if (trimmedPassword !== trimmedConfirmPassword) {
    return {
      isValid: false,
      message: "Passwords do not match",
    };
  }

  if (!acceptedTerms) {
    return {
      isValid: false,
      message: "Please accept the Terms & Conditions",
    };
  }

  return { isValid: true };
};
