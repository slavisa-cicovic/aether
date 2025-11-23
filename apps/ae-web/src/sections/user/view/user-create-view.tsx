"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import UserEditForm, { UserFormValues } from "../edit-form";

export default function UserCreateView() {
  const router = useRouter();

  const handleSubmit = async (values: UserFormValues) => {
    // TODO: replace with create user API call
    router.push("/user");
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight="bold">
        Create user
      </Typography>
      <Card>
        <CardContent className="space-y-4">
          <UserEditForm onSubmit={handleSubmit} submitLabel="Create user" />
        </CardContent>
      </Card>
    </Stack>
  );
}
