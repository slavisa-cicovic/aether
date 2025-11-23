"use client";

import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function UserListView() {
  const router = useRouter();

  const t = useTranslations('user');

  const handleCreate = () => router.push("/user/new");

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight="bold">
          Users
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          {t('create')}
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            User table will be placed here using shared table components.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
