import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

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

  const result = registerSchema.safeParse(body);

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
    const name = result.data.name.trim();
    const username = result.data.username.trim().toLowerCase();
    const email = result.data.email.trim().toLowerCase();
    const password = result.data.password;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this email already exists",
        },
        {
          status: 409,
        }
      );
    }

    const existingUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          error: "This username is already taken",
        },
        {
          status: 409,
        }
      );
    }

    const passwordHash = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Failed to register user:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to register user",
      },
      {
        status: 500,
      }
    );
  }
}