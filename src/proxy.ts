import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(
  request: NextRequest
) {
  const token =
    request.cookies.get("taskpilot_token")?.value;

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/projects/:path*",
    "/tasks/:path*",
    "/me/:path*",
  ],
};