import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { validateLoginForm } from "../validation/authSchemas";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] =
        useState("testw1w1@test.com");

    const [password, setPassword] =
        useState("Test123!");

    const [message, setMessage] =
        useState("");

    const [isError, setIsError] =
        useState(false);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const isSubmitDisabled =
        isSubmitting || !email.trim() || !password.trim();

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const validation = validateLoginForm(email, password);

        if (!validation.isValid) {
            setMessage(validation.message ?? "Validation failed");
            setIsError(true);
            return;
        }

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        setIsSubmitting(true);

        try {
            const response = await api.post(
                "/auth/login",
                {
                    email: trimmedEmail,
                    password: trimmedPassword,
                }
            );
            console.log(response.data);

            const loginUser = response.data?.user ?? response.data;

            await login(
                response.data.accessToken,
                {
                    userId: loginUser?.userId,
                    email: loginUser?.email,
                },
                response.data.refreshToken
            );
            setIsError(false);
        } catch (error: any) {
            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
            setIsError(true);
        } finally {
            window.setTimeout(() => {
                setIsSubmitting(false);
            }, 800);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-3 py-6 sm:px-4">
            {isSubmitting && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-lg">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <p className="text-sm font-medium text-slate-700">
                            Signing you in...
                        </p>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-lg backdrop-blur sm:p-8"
            >
                <h1 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
                    Login
                </h1>

                <div className="mt-5 space-y-3 sm:space-y-4">
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
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${
                            isError
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
                        className={`w-full rounded-lg border p-3 text-base text-slate-700 outline-none transition ${
                            isError
                                ? "border-red-500 bg-red-50"
                                : "border-slate-300 focus:border-blue-500"
                        }`}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-blue-700 bg-blue-600 p-3.5 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-400"
                    >
                        {isSubmitting ? "Signing in..." : "Send"}
                    </button>

                    {message && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {message}
                        </p>
                    )}

                    <div className="pt-2">
                        <p className="text-center text-sm text-slate-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/register")
                                }
                                className="cursor-pointer font-semibold text-blue-600 transition-colors hover:text-blue-700"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;