import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { validateRegisterForm } from "../validation/authSchemas";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("Test");

    const [lastName, setLastName] = useState("Last Test");

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [email, setEmail] =
        useState("test@test.com");

    const [password, setPassword] =
        useState("Test123!");

    const [confirmPassword, setConfirmPassword] = useState("Test123!");

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const isSubmitDisabled =
        isSubmitting ||
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim() ||
        !acceptedTerms;

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const validation = validateRegisterForm({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            acceptedTerms,
        });

        if (!validation.isValid) {
            setMessage(validation.message ?? "Validation failed");
            setIsError(true);
            return;
        }

        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        setIsSubmitting(true);

        try {
            await api.post("/auth/register", {
                firstName: trimmedFirstName,
                lastName: trimmedLastName,
                email: trimmedEmail,
                password: trimmedPassword,
                acceptedTerms,
            });

            setMessage("Registration successful");
            setIsError(false);

            setEmail("");
            setPassword("");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error: any) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
            setIsError(true);
        } finally {
            window.setTimeout(() => {
                setIsSubmitting(false);
            }, 600);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-3 py-6 sm:px-4">
            {isSubmitting && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <p className="text-sm font-medium text-slate-700">
                            Creating your account...
                        </p>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur sm:p-8"
            >
                <h1 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
                    Register
                </h1>

                <div className="mt-5 space-y-3 sm:space-y-4">
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            if (message) {
                                setMessage("");
                                setIsError(false);
                            }
                        }}
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${isError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500"
                            }`}
                    />

                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            if (message) {
                                setMessage("");
                                setIsError(false);
                            }
                        }}
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${isError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500"
                            }`}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (message) {
                                setMessage("");
                                setIsError(false);
                            }
                        }}
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${isError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500"
                            }`}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (message) {
                                setMessage("");
                                setIsError(false);
                            }
                        }}
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${isError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500"
                            }`}
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (message) {
                                setMessage("");
                                setIsError(false);
                            }
                        }}
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${isError
                            ? "border-red-500 bg-red-50"
                            : "border-slate-300 focus:border-blue-500"
                            }`}
                    />

                    <label className="flex items-start gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) =>
                                setAcceptedTerms(e.target.checked)
                            }
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>Accept Terms & Conditions</span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-blue-700 bg-blue-600 p-3.5 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-400"
                    >
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>

                    {message && (
                        <p className={`rounded-lg p-3 text-sm ${isError
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-600"
                            }`}>
                            {message}
                        </p>
                    )}

                    <div className="pt-2">
                        <p className="text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="cursor-pointer font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Log in here
                            </button>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;