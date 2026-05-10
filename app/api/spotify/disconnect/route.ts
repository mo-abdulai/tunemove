import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { clearSpotifyConnection } from "@/lib/spotify-connection-store";

function buildUnauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      },
    },
    { status: 401 },
  );
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return buildUnauthorizedResponse();
  }

  clearSpotifyConnection(userId);

  return NextResponse.redirect(
    new URL("/dashboard/connections?spotify=disconnected", request.url),
    { status: 303 },
  );
}

