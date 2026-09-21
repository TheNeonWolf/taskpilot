import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { verifyAuthToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("taskpilot_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    let payload;

    try {
      payload = await verifyAuthToken(token);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired authentication token",
        },
        {
          status: 401,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Failed to get authenticated user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to get authenticated user",
      },
      {
        status: 500,
      }
    );
  }
}