import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cards: [
      { title: "Active Sessions", value: "148", delta: "+12% vs last hour" },
      { title: "Missions Today", value: "34", delta: "+3% vs yesterday" },
      { title: "Fleet Availability", value: "96%", delta: "Stable" }
    ],
    status: "All drone fleets operating within parameters."
  });
}
