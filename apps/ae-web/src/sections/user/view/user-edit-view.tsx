"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import UserEditForm, { UserFormValues } from "../edit-form";
import EmptyContent from "@/components/empty-content";

type Props = {
  id: number;
};

export default function UserEditView({ id }: Props) {
  const router = useRouter();

  const renderError = (
    <EmptyContent
      title={`User not found ${id}`}
    />
  )

  const renederUser = (
    <UserEditForm defaultValues={user} />
  )

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight="bold">
        Edit user
      </Typography>
      <Card>
        <CardContent className="space-y-4">
          <UserEditForm
            defaultValues={user}
            onSubmit={handleSubmit}
            submitLabel="Update user"
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
