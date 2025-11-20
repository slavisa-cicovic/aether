"use client";

import { Card, CardContent, Typography, Grid } from "@mui/material";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();
  const t = useTranslations("dashboard");

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Typography variant="body1">{t("loading")}</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Typography variant="h4" fontWeight="bold">
        {t("title")}
      </Typography>
      <Grid container spacing={3}>
        {data?.cards.map(card => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{card.title}</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="body2" color="success.main">
                  {card.delta}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("liveStatus")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.status}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
