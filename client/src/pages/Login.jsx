import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordField from "@/components/PasswordField";

import { useLoginMutation } from "../features/api/authApi";
import { loginSchema } from "../validations/authSchema";

const Login = () => {
  const navigate = useNavigate();
  const emailErrorId = "login-email-error";
  const passwordErrorId = "login-password-error";
  const formErrorId = "login-form-error";

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) navigate("/");
  }, [navigate]);

  const [loginUser, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data).unwrap();

      if (response?.token) localStorage.setItem("token", response.token);
      if (response?.user)
        localStorage.setItem("user", JSON.stringify(response.user));

      reset();
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const footer = (
    <p className="text-center text-sm text-muted-foreground">
      New here?{" "}
      <Link
        to="/register"
        className="font-medium text-foreground underline underline-offset-4"
      >
        Create an account
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Sign in"
      description="Welcome back. Sign in to continue tracking your money."
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? emailErrorId : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id={emailErrorId} className="text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="password">Password</Label>
          <PasswordField
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            hasError={Boolean(errors.password)}
            describedBy={errors.password ? passwordErrorId : undefined}
            toggleLabel="password"
            {...register("password")}
          />
          {errors.password && (
            <p id={passwordErrorId} className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {error && (
          <div
            id={formErrorId}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error?.data?.message || "We could not sign you in. Try again."}
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isLoading}
          aria-describedby={error ? formErrorId : undefined}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Signing in..." : "Sign in"}</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Login;
