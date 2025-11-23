"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Divider, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { createLoginSchema, LoginSchema } from "@/lib/validation/auth";

export default function LoginView() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("login");
  const validation = useTranslations("login.validation");
  const validationSchema = useMemo(() => createLoginSchema(validation), [validation]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginSchema>({
    resolver: zodResolver(validationSchema)
  });

  const onSubmit = async (data: LoginSchema) => {
    setError(null);
    try {
      await login(data.email, data.password);
      router.replace("/dashboard");
    } catch (err: any) {
      const fallbackError = t("error");
      const message =
        typeof err?.message === "string" && err.message !== "LOGIN_ERROR"
          ? err.message
          : fallbackError;
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase text-slate-500">
          {t("subtitle")}
        </p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={3}>
        <TextField
          label={t("fields.email")}
          type="email"
          fullWidth
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label={t("fields.password")}
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
        {isSubmitting ? t("ctaLoading") : t("cta")}
      </Button>
      <Divider />
      <p className="text-center text-xs text-slate-500">
        {t("helper")}
      </p>
    </form>
  );
}
