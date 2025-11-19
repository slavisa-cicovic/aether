"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Alert, Stack, Divider } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, LoginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    setError(null);
    try {
      await login(data.email, data.password);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Unable to sign in");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase text-slate-500">
          Aether Console
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Sign in
        </h1>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={3}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          {...register("password")}
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
      <Divider />
      <p className="text-center text-xs text-slate-500">
        Use your Aether operator credentials.
      </p>
    </form>
  );
}
