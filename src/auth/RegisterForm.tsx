import React, { useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  userRegistrationSchema,
  UserRegistrationData,
  validateData,
  getFieldError,
  hasFieldError,
} from "@/utils/validation";

// Password strength calculator
const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, text: "", color: "" };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  if (score < 2) return { score, text: "Weak", color: "text-red-500" };
  if (score < 4) return { score, text: "Fair", color: "text-yellow-500" };
  if (score < 5) return { score, text: "Good", color: "text-blue-500" };
  return { score, text: "Strong", color: "text-green-500" };
};

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();

  // Calculate password strength
  const passwordStrength = useMemo(() => 
    getPasswordStrength(formData.password), 
    [formData.password]
  );

  const validateField = (
    fieldName: keyof UserRegistrationData,
    value: string
  ) => {
    const validation = validateData(userRegistrationSchema, {
      ...formData,
      [fieldName]: value,
    });

    if (!validation.success && validation.errors) {
      const fieldError = getFieldError(fieldName, validation.errors);
      if (fieldError) {
        setFieldErrors((prev) => ({
          ...prev,
          [fieldName]: fieldError,
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    } else {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleFieldChange = (
    fieldName: keyof UserRegistrationData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleFieldBlur = (fieldName: keyof UserRegistrationData) => {
    validateField(fieldName, formData[fieldName]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const validation = validateData(userRegistrationSchema, formData);

    if (!validation.success) {
      setFieldErrors(validation.errors || {});
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        validation.data!.email,
        validation.data!.name,
        validation.data!.password
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full shadow-2xl border border-white/20 bg-white/90 backdrop-blur-xl">
      <CardHeader className="text-center space-y-6 pb-8">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Create an account
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-3 font-medium">
            Enter your details to get started for free
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            <div className="flex items-center space-x-3">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{formError}</span>
            </div>
            {formError.includes("already") && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-sm text-red-600 mb-2">
                  Already have an account?
                </p>
                <button
                  onClick={onToggleForm}
                  className="inline-flex items-center text-sm font-semibold text-red-700 hover:text-red-800 hover:underline"
                >
                  Sign in instead
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-900"
            >
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              onBlur={() => handleFieldBlur("name")}
              className={`w-full h-12 px-4 rounded-xl focus:ring-1 transition-all duration-200 placeholder:text-gray-500 bg-white border-solid ${
                hasFieldError("name", fieldErrors)
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {hasFieldError("name", fieldErrors) && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {getFieldError("name", fieldErrors)}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-900"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={() => handleFieldBlur("email")}
              className={`w-full h-12 px-4 rounded-xl focus:ring-1 transition-all duration-200 placeholder:text-gray-500 bg-white border-solid ${
                hasFieldError("email", fieldErrors)
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {hasFieldError("email", fieldErrors) && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {getFieldError("email", fieldErrors)}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-900"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              onBlur={() => handleFieldBlur("password")}
              className={`w-full h-12 px-4 rounded-xl focus:ring-1 transition-all duration-200 placeholder:text-gray-500 bg-white border-solid ${
                hasFieldError("password", fieldErrors)
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Password strength:</span>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      passwordStrength.score === 1 ? 'bg-red-500 w-1/5' :
                      passwordStrength.score === 2 ? 'bg-yellow-500 w-2/5' :
                      passwordStrength.score === 3 ? 'bg-yellow-500 w-3/5' :
                      passwordStrength.score === 4 ? 'bg-blue-500 w-4/5' :
                      passwordStrength.score === 5 ? 'bg-green-500 w-full' :
                      'bg-gray-300 w-0'
                    }`}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 space-y-1">
                  <div className="flex flex-wrap gap-2">
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                      ✓ 8+ characters
                    </span>
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      ✓ uppercase
                    </span>
                    <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      ✓ lowercase
                    </span>
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                      ✓ number
                    </span>
                  </div>
                </div>
              </div>
            )}
            {hasFieldError("password", fieldErrors) && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {getFieldError("password", fieldErrors)}
              </p>
            )}
          </div>
          <div className="space-y-3">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-gray-900"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleFieldChange("confirmPassword", e.target.value)
              }
              onBlur={() => handleFieldBlur("confirmPassword")}
              className={`w-full h-12 px-4 rounded-xl focus:ring-1 transition-all duration-200 placeholder:text-gray-500 bg-white border-solid ${
                hasFieldError("confirmPassword", fieldErrors)
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {hasFieldError("confirmPassword", fieldErrors) && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {getFieldError("confirmPassword", fieldErrors)}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] mt-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="px-8 pt-6 pb-8">
        <div className="text-center w-full">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onToggleForm}
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
