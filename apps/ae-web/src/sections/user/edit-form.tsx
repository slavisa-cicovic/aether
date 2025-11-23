"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Stack, TextField } from "@mui/material";

export type UserFormValues = {
  name: string;
  email: string;
  role: string;
};

type Props = {
  currentUser?: UserFormValues;
};

export default function UserEditForm({
  currentUser,
}: Props) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
    reset
  } = useForm<UserFormValues>({
    defaultValues: currentUser ?? { name: "", email: "", role: "" }
  });

  useEffect(() => {
    if (currentUser) {
      reset(currentUser);
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: any) => {

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Stack spacing={3}>
        <TextField
          label="Full name"
          fullWidth
          {...register("name", { required: "Name is required" })}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Enter a valid email"
            }
          })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          label="Role"
          fullWidth
          {...register("role", { required: "Role is required" })}
          error={Boolean(errors.role)}
          helperText={errors.role?.message}
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        size="large"
      >
        Save
      </Button>
    </form>
  );
}
