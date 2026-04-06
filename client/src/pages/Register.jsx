import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRegisterMutation } from "../features/api/authApi";
import { registerSchema } from "../validations/authSchema";

const Register = () => {
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
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              Create your account
            </CardTitle>
            <CardDescription>
              Start tracking your income and expenses with Expensify
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                <p className="text-sm text-muted-foreground">
                  Use at least 6 characters.
                </p>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-500">
                  {error?.data?.message || "Something went wrong"}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Register;
