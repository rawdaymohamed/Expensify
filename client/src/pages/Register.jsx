import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordField from "@/components/PasswordField";

import { useRegisterMutation } from "../features/api/authApi";
import { registerSchema } from "../validations/authSchema";

const Register = () => {
  const navigate = useNavigate();
  const nameErrorId = "register-name-error";
  const emailErrorId = "register-email-error";
  const passwordErrorId = "register-password-error";
  const passwordHelpId = "register-password-help";
  const reassuranceId = "register-reassurance";
  const formErrorId = "register-form-error";

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      // Save JWT and user info to localStorage
      if (response?.token) {
        localStorage.setItem("token", response.token);
      }
      if (response?.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      reset();
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const footer = (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-medium text-foreground underline underline-offset-4"
      >
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Create your account"
      description="Start tracking your income and expenses with Expensify."
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            className="h-11"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? nameErrorId : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id={nameErrorId} className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

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
            placeholder="Create a password"
            autoComplete="new-password"
            hasError={Boolean(errors.password)}
            describedBy={
              errors.password
                ? `${passwordHelpId} ${passwordErrorId}`
                : passwordHelpId
            }
            toggleLabel="password"
            {...register("password")}
          />
          <p id={passwordHelpId} className="text-xs text-muted-foreground">
            Use at least 6 characters.
          </p>
          {errors.password && (
            <p id={passwordErrorId} className="text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <p id={reassuranceId} className="text-xs text-slate-500">
          Your transactions stay in your account.
        </p>

        {error && (
          <div
            id={formErrorId}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error?.data?.message ||
              "We could not create your account. Try again."}
          </div>
        )}

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isLoading}
          aria-describedby={
            error ? `${reassuranceId} ${formErrorId}` : reassuranceId
          }
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Creating account..." : "Create account"}</span>
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
