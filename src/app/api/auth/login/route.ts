import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations";
import { createAuthToken } from "@/lib/auth";

export async function POST(request: Request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body",
      },
      {
        status: 400,
      }
    );
  }

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const email = result.data.email.trim().toLowerCase();
    const password = result.data.password;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const passwordMatches = await compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        {
          status: 401,
        }
      );
    }

    const token = await createAuthToken({
      userId: user.id,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200,
      }
    );

    response.cookies.set("taskpilot_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Failed to log in:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to log in",
      },
      {
        status: 500,
      }
    );
  }
}