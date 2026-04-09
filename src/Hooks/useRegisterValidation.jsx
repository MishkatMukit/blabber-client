import { useState } from "react";

const useRegisterValidation = () => {
  const [error, setError] = useState("");

  const validateUsername = (username) => {
    if (username.includes(" ")) {
      setError("Username cannot contain spaces");
      return false;
    }
    if (username.length < 2 || username.length > 20) {
      setError("Username must be between 2 and 20 characters.");
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Only letters, numbers, and underscores are allowed.");
      return false;
    }
    if (username.startsWith("_") || username.endsWith("_")) {
      setError("Username cannot start or end with underscore.");
      return false;
    }
    if (username.includes("__")) {
      setError("Username cannot contain consecutive underscores.");
      return false;
    }
    return true;
  };

  const validatePassword = (password, confirmPassword) => {
    const hasMinLength = /.{6,}/;
    const hasLowercase = /[a-z]/;
    const hasUppercase = /[A-Z]/;

    if (!hasMinLength.test(password)) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!hasLowercase.test(password)) {
      setError("Password must have at least one lowercase letter");
      return false;
    }
    if (!hasUppercase.test(password)) {
      setError("Password must have at least one uppercase letter");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Confirm Password not matched");
      return false;
    }
    return true;
  };

  const validateForm = (userName, password, confirmPassword) => {
    setError("");

    if (!validateUsername(userName)) {
      return false;
    }

    if (!validatePassword(password, confirmPassword)) {
      return false;
    }

    return true;
  };

  return { error, setError, validateForm, validateUsername, validatePassword };
};

export default useRegisterValidation;
